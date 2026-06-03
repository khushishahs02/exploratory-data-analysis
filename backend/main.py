from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
import shap
import io

app = FastAPI(title="Veda Life AI API")

# --- CORS Configuration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global Asset Loading ---
model = None
scaler = None
explainer = None

# Exact feature order the model was trained on
MODEL_COLS = [
    'age', 'is_female', 'bmi', 'children', 'is_smoker',
    'region_northwest', 'region_southeast', 'region_southwest',
    'bmi_category_Normal', 'bmi_category_Overweight', 'bmi_category_Obese'
]
# Columns the scaler was fitted on (numeric only)
SCALE_COLS = ['age', 'bmi', 'children']

@app.on_event("startup")
def load_models():
    global model, scaler, explainer
    model = joblib.load('gb_model.pkl')
    scaler = joblib.load('scaler.pkl')
    def get_explainer():
     return shap.TreeExplainer(model)

class PatientInput(BaseModel):
    age: int
    sex: str
    bmi: float
    children: int
    smoker: bool
    region: str

def get_bmi_category(bmi: float):
    if bmi < 18.5:
        return 'Underweight'
    elif bmi < 25:
        return 'Normal'
    elif bmi < 30:
        return 'Overweight'
    else:
        return 'Obese'

def preprocess_patient(data: PatientInput):
    """Build a single-row DataFrame with the exact 11 features the model expects."""
    row = {col: 0 for col in MODEL_COLS}

    row['age'] = data.age
    row['bmi'] = data.bmi
    row['children'] = data.children
    row['is_smoker'] = 1 if data.smoker else 0
    row['is_female'] = 1 if data.sex.lower() == 'female' else 0

    # Region one-hot (northeast is the reference/dropped category)
    region = data.region.lower()
    region_col = f"region_{region}"
    if region_col in row:
        row[region_col] = 1

    # BMI category one-hot
    bmi_cat = get_bmi_category(data.bmi)
    bmi_col = f"bmi_category_{bmi_cat}"
    if bmi_col in row:
        row[bmi_col] = 1

    return pd.DataFrame([row])

@app.post("/predict")
def predict_single_patient(patient: PatientInput):
    df_raw = preprocess_patient(patient)

    # Scale only the numeric columns
    df_scaled = df_raw.copy()
    df_scaled[SCALE_COLS] = scaler.transform(df_raw[SCALE_COLS])

    scaled_data = df_scaled[MODEL_COLS]

    # Predict in log-space, convert to dollars
    log_pred = model.predict(scaled_data)[0]
    predicted_charge = float(np.exp(log_pred))

    # SHAP explanation
    shap_vals = explainer.shap_values(scaled_data)[0]
    feature_impacts = list(zip(MODEL_COLS, shap_vals))
    feature_impacts.sort(key=lambda x: abs(x[1]), reverse=True)

    top_feature, top_val = feature_impacts[0]
    second_feature, second_val = feature_impacts[1]

    name_map = {
        'is_smoker': 'Smoking status', 'age': 'Your age', 'bmi': 'Your BMI',
        'children': 'Number of dependents', 'is_female': 'Sex',
        'bmi_category_Obese': 'Obese BMI category',
        'bmi_category_Overweight': 'Overweight BMI category',
        'bmi_category_Normal': 'Normal BMI category',
    }
    f1_name = name_map.get(top_feature, top_feature.replace('_', ' ').capitalize())
    f2_name = name_map.get(second_feature, second_feature.replace('_', ' ').capitalize())

    # Proper log-space to dollar conversion for SHAP contributions
    base_val = explainer.expected_value
    base = float(base_val[0]) if isinstance(base_val, (list, np.ndarray)) else float(base_val)
    f1_dollar = abs(np.exp(base + top_val) - np.exp(base))
    f2_dollar = abs(np.exp(base + second_val) - np.exp(base))

    f1_action = "increasing" if top_val > 0 else "decreasing"
    f2_action = "increases" if second_val > 0 else "decreases"

    explanation_text = (
        f"{f1_name} is the single largest cost driver for this profile, "
        f"{f1_action} the estimate by approximately ${f1_dollar:,.0f} relative to the baseline. "
        f"{f2_name} {f2_action} the estimate by an additional ${f2_dollar:,.0f}."
    )

    return {
        "estimated_charge": round(predicted_charge, 2),
        "range_min": round(predicted_charge * 0.85, 2),
        "range_max": round(predicted_charge * 1.15, 2),
        "explanation": explanation_text,
        "shap_data": [{"feature": col, "value": float(val)} for col, val in zip(MODEL_COLS, shap_vals)],
        "base_value": float(explainer.expected_value)
    }

@app.post("/predict_batch")
async def predict_batch(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    results = df.to_dict('records')

    # Build features for each row
    batch_frames = []
    for _, row_data in df.iterrows():
        p = PatientInput(
            age=int(row_data['age']),
            sex=str(row_data['sex']),
            bmi=float(row_data['bmi']),
            children=int(row_data['children']),
            smoker=str(row_data['smoker']).lower() in ('yes', 'true', '1'),
            region=str(row_data['region'])
        )
        batch_frames.append(preprocess_patient(p))

    df_batch = pd.concat(batch_frames, ignore_index=True)
    df_batch[SCALE_COLS] = scaler.transform(df_batch[SCALE_COLS])

    log_preds = model.predict(df_batch[MODEL_COLS])
    dollar_preds = np.exp(log_preds)

    for i, row in enumerate(results):
        charge = float(dollar_preds[i])
        row['Predicted Charge'] = round(charge, 2)
        if charge < 10000:
            row['Risk Category'] = 'Low'
        elif charge < 25000:
            row['Risk Category'] = 'Medium'
        else:
            row['Risk Category'] = 'High'

    return {"batch_results": results}