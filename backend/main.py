import os, io, math, traceback
import joblib
import numpy as np
import pandas as pd
import shap
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── Load artifacts ────────────────────────────────────────────────────────────
BASE_DIR  = os.path.dirname(__file__)
model     = joblib.load(os.path.join(BASE_DIR, 'gb_model.pkl'))
scaler    = joblib.load(os.path.join(BASE_DIR, 'scaler.pkl'))
explainer = shap.TreeExplainer(model)

ALL_FEATURES = [
    'age', 'is_female', 'bmi', 'children', 'is_smoker',
    'region_northwest', 'region_southeast', 'region_southwest',
    'bmi_category_Normal', 'bmi_category_Overweight', 'bmi_category_Obese',
]

# Columns that were Scaled during training
NUMERIC_COLS = ['age', 'bmi', 'children']

app = FastAPI(title='HealthWealth', version='1.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=['*'],
    allow_headers=['*'],
)

# ── Input schema ──────────────────────────────────────────────────────────────
class PatientInput(BaseModel):
    age:      int
    sex:      str    # 'male' | 'female'
    bmi:      float
    children: int
    smoker:   str    # 'yes' | 'no'
    region:   str    # 'northeast' | 'northwest' | 'southeast' | 'southwest'


# ── Build feature DataFrame ───────────────────────────────────────────────────
def build_features(p: PatientInput) -> pd.DataFrame:
    bmi = float(p.bmi)

    # WHO BMI category
    if   bmi < 18.5: cat = 'Underweight'
    elif bmi < 25:   cat = 'Normal'
    elif bmi < 30:   cat = 'Overweight'
    else:            cat = 'Obese'

    # Construct in EXACT same order as X_train
    row = {
        'age':                     int(p.age),
        'is_female':               1 if p.sex.strip().lower() == 'female' else 0,
        'bmi':                     bmi,
        'children':                int(p.children),
        'is_smoker':               1 if p.smoker.strip().lower() == 'yes' else 0,
        'region_northwest':        1 if p.region.strip().lower() == 'northwest'  else 0,
        'region_southeast':        1 if p.region.strip().lower() == 'southeast'  else 0,
        'region_southwest':        1 if p.region.strip().lower() == 'southwest'  else 0,
        'bmi_category_Normal':     1 if cat == 'Normal'      else 0,
        'bmi_category_Overweight': 1 if cat == 'Overweight'  else 0,
        'bmi_category_Obese':      1 if cat == 'Obese'       else 0,
    }

    df = pd.DataFrame([row])[ALL_FEATURES]          # enforce exact order
    df[NUMERIC_COLS] = scaler.transform(df[NUMERIC_COLS])   # scale numerics
    return df


# ── SHAP → plain English ──────────────────────────────────────────────────────
LABELS = {
    'is_smoker':               'Smoking status',
    'age':                     'Age',
    'bmi':                     'BMI',
    'bmi_category_Obese':      'Obese BMI classification',
    'bmi_category_Overweight': 'Overweight BMI classification',
    'bmi_category_Normal':     'Normal BMI classification',
    'children':                'Number of dependents',
    'is_female':               'Biological sex',
    'region_northwest':        'Northwest region',
    'region_southeast':        'Southeast region',
    'region_southwest':        'Southwest region',
}

def plain_english(shap_arr, features, prediction: float) -> list[str]:
    """
    SHAP values are in log-charge space.
    Dollar impact ≈ prediction × (exp(shap_val) − 1)
    """
    pairs = sorted(zip(features, shap_arr), key=lambda x: abs(x[1]), reverse=True)
    lines = []
    for feat, val in pairs[:3]:
        if abs(val) < 0.02:
            continue
        label     = LABELS.get(feat, feat)
        dollar    = abs(round((math.exp(float(val)) - 1) * prediction))
        direction = 'adds' if val > 0 else 'reduces'
        lines.append(f"{label} {direction} approximately ${dollar:,} to your estimated charge.")
    lines.append(
        f"Overall estimated annual charge: ${int(prediction):,}, "
        "before plan discounts or deductibles."
    )
    return lines


def risk_tier(charge: float) -> str:
    if charge < 10_000: return 'Low'
    if charge < 25_000: return 'Medium'
    return 'High'


# ── POST /api/predict ─────────────────────────────────────────────────────────
@app.post('/api/predict')
def predict(patient: PatientInput):
    try:
        df         = build_features(patient)
        log_pred   = float(model.predict(df)[0])
        prediction = math.exp(log_pred)             # convert from log-space to dollars

        sv         = explainer(df)
        shap_arr   = sv.values[0]
        base_val   = math.exp(float(sv.base_values[0]))

        shap_list  = sorted(
            [{'feature': f, 'value': float(v)} for f, v in zip(ALL_FEATURES, shap_arr)],
            key=lambda x: abs(x['value']),
            reverse=True,
        )

        return {
            'prediction':    prediction,
            'base_value':    base_val,
            'shap_values':   shap_list,
            'plain_english': plain_english(shap_arr, ALL_FEATURES, prediction),
        }
    except Exception as e:
        traceback.print_exc()           # prints full error to your terminal
        raise HTTPException(status_code=500, detail=str(e))


# ── POST /api/predict-batch ───────────────────────────────────────────────────
@app.post('/api/predict-batch')
async def predict_batch(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.csv'):
        raise HTTPException(400, 'Upload a .csv file.')
    contents = await file.read()
    try:
        df_raw = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    except Exception:
        raise HTTPException(400, 'Could not parse CSV.')

    required = {'age', 'sex', 'bmi', 'children', 'smoker', 'region'}
    missing  = required - set(df_raw.columns.str.strip().str.lower())
    if missing:
        raise HTTPException(400, f'Missing columns: {sorted(missing)}')

    results = []
    for _, row in df_raw.iterrows():
        try:
            p      = PatientInput(
                age=int(row['age']), sex=str(row['sex']), bmi=float(row['bmi']),
                children=int(row['children']), smoker=str(row['smoker']), region=str(row['region'])
            )
            feat   = build_features(p)
            charge = math.exp(float(model.predict(feat)[0]))
            results.append({
                **row.to_dict(),
                'predicted_charge': round(charge, 2),
                'risk_tier':        risk_tier(charge),
            })
        except Exception as ex:
            results.append({**row.to_dict(), 'predicted_charge': 'ERROR', 'risk_tier': 'N/A', 'error': str(ex)})

    return {'results': results}


# ── GET /api/health ───────────────────────────────────────────────────────────
@app.get('/api/health')
def health():
    return {
        'status':             'ok',
        'model_type':         type(model).__name__,
        'expected_features':  ALL_FEATURES,
        'feature_count':      len(ALL_FEATURES),
        'scaled_columns':     NUMERIC_COLS,
    }