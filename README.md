# Insurance Charges Prediction

Predicting individual medical insurance charges using regression models.

**Dataset:** Medical Cost Personal Dataset — [Kaggle](https://www.kaggle.com/datasets/mirichoi0218/insurance)  
**Problem type:** Regression  
**Target variable:** `charges` (individual medical costs billed)

---

## Notebooks

| Notebook | Purpose |
|---|---|
| 01_EDA | Explore raw data, distributions, correlations, statistical tests |
| 02_preprocessing | Clean, encode, engineer features, split, scale, save |
| 03_modeling | Train models, compare, tune, evaluate |

---

## Key Findings from EDA

- `is_smoker` is the strongest predictor of charges (Pearson r = 0.787)
- `age` is the second most important numeric feature (r ≈ 0.30)
- `charges` is right-skewed - log-transformed for modeling
- `region` shows weak statistical significance

---

## Setup

```bash
pip install -r requirements.txt
```
