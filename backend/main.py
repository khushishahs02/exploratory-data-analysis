from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib, os, io, math
import numpy as np
import pandas as pd
import shap

# ── Absolute paths so Render can find the pkl files ──────────────
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH  = os.path.join(BASE_DIR, 'gb_model.pkl')
SCALER_PATH = os.path.join(BASE_DIR, 'scaler.pkl')

app = FastAPI(title="HealthWealth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Globals ───────────────────────────────────────────────────────
model     = None
scaler    = None
explainer = None

MODEL_COLS = [
    'age', 'is_female', 'bmi', 'children', 'is_smoker',
    'region_northwest', 'region_southeast', 'region_southwest',
    'bmi_category_Normal', 'bmi_category_Overweight', 'bmi_category_Obese'
]
SCALE_COLS = ['age', 'bmi', 'children']

# ── Load everything at startup ────────────────────────────────────
@app.on_event("startup")
def load_models():
    global model, scaler, explainer
    model     = joblib.load(MODEL_PATH)
    scaler    = joblib.load(SCALER_PATH)
    explainer = shap.TreeExplainer(model)   # ← actually assigned now
    print("Model, scaler and SHAP explainer loaded successfully.")

# ── Input schema ──────────────────────────────────────────────────
class PatientInput(BaseModel):
    age:      int
    sex:      str      # 'male' | 'female'
    bmi:      float
    children: int
    smoker:   bool
    region:   str      # 'northeast' | 'northwest' | 'southeast' | 'southwest'

# ── Helpers ───────────────────────────────────────────────────────
def get_bmi_category(bmi: float) -> str:
    if bmi < 18.5: return 'Underweight'
    if bmi < 25:   return 'Normal'
    if bmi < 30:   return 'Overweight'
    return 'Obese'

def preprocess_patient(data: PatientInput) -> pd.DataFrame:
    row = {col: 0 for col in MODEL_COLS}
    row['age']       = data.age
    row['bmi']       = data.bmi
    row['children']  = data.children
    row['is_smoker'] = 1 if data.smoker else 0
    row['is_female'] = 1 if data.sex.lower() == 'female' else 0

    region_col = f"region_{data.region.lower()}"
    if region_col in row:
        row[region_col] = 1

    bmi_col = f"bmi_category_{get_bmi_category(data.bmi)}"
    if bmi_col in row:
        row[bmi_col] = 1

    return pd.DataFrame([row])

NAME_MAP = {
    'is_smoker': 'Smoking status', 'age': 'Your age', 'bmi': 'Your BMI',
    'children': 'Number of dependents', 'is_female': 'Sex',
    'bmi_category_Obese': 'Obese BMI category',
    'bmi_category_Overweight': 'Overweight BMI category',
    'bmi_category_Normal': 'Normal BMI category',
}

# ── POST /predict ─────────────────────────────────────────────────
@app.post("/predict")
def predict_single_patient(patient: PatientInput):
    df_raw    = preprocess_patient(patient)
    df_scaled = df_raw.copy()
    df_scaled[SCALE_COLS] = scaler.transform(df_raw[SCALE_COLS])
    scaled_data = df_scaled[MODEL_COLS]

    log_pred         = model.predict(scaled_data)[0]
    predicted_charge = float(np.exp(log_pred))

    shap_vals       = explainer.shap_values(scaled_data)[0]
    feature_impacts = sorted(zip(MODEL_COLS, shap_vals), key=lambda x: abs(x[1]), reverse=True)

    base_raw = explainer.expected_value
    base     = float(base_raw[0]) if isinstance(base_raw, (list, np.ndarray)) else float(base_raw)

    top_f, top_v   = feature_impacts[0]
    sec_f, sec_v   = feature_impacts[1]
    f1_name        = NAME_MAP.get(top_f, top_f.replace('_', ' ').capitalize())
    f2_name        = NAME_MAP.get(sec_f, sec_f.replace('_', ' ').capitalize())
    f1_dollar      = abs(np.exp(base + top_v) - np.exp(base))
    f2_dollar      = abs(np.exp(base + sec_v) - np.exp(base))
    f1_action      = "increasing" if top_v  > 0 else "decreasing"
    f2_action      = "increases"  if sec_v  > 0 else "decreases"

    explanation = (
        f"{f1_name} is the single largest cost driver for this profile, "
        f"{f1_action} the estimate by approximately ${f1_dollar:,.0f} relative to the baseline. "
        f"{f2_name} {f2_action} the estimate by an additional ${f2_dollar:,.0f}."
    )

    return {
        "estimated_charge": round(predicted_charge, 2),
        "range_min":        round(predicted_charge * 0.85, 2),
        "range_max":        round(predicted_charge * 1.15, 2),
        "explanation":      explanation,
        "shap_data":        [{"feature": c, "value": float(v)} for c, v in zip(MODEL_COLS, shap_vals)],
        "base_value":       base,
    }

# ── POST /predict_batch ───────────────────────────────────────────
@app.post("/predict_batch")
async def predict_batch(file: UploadFile = File(...)):
    contents  = await file.read()
    df        = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    results   = df.to_dict('records')

    batch_frames = []
    for _, r in df.iterrows():
        p = PatientInput(
            age=int(r['age']), sex=str(r['sex']), bmi=float(r['bmi']),
            children=int(r['children']),
            smoker=str(r['smoker']).lower() in ('yes', 'true', '1'),
            region=str(r['region'])
        )
        batch_frames.append(preprocess_patient(p))

    df_batch              = pd.concat(batch_frames, ignore_index=True)
    df_batch[SCALE_COLS]  = scaler.transform(df_batch[SCALE_COLS])
    dollar_preds          = np.exp(model.predict(df_batch[MODEL_COLS]))

    for i, row in enumerate(results):
        charge              = float(dollar_preds[i])
        row['Predicted Charge'] = round(charge, 2)
        row['Risk Category']    = 'Low' if charge < 10000 else 'Medium' if charge < 25000 else 'High'

    return {"batch_results": results}

# ── Health check ──────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {"status": "ok", "model": "GradientBoostingRegressor"}