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

## Modeling & Evaluation

We trained and compared multiple models on log-transformed charges:

### Model Scorecard Comparison

| Model | Hyperparameters | Train $R^2$ | Test $R^2$ | Generalization Gap | Status |
|---|---|---|---|---|---|
| **Linear Regression (Baseline)** | Default | 0.7351 | 0.8046 | -0.0695 | Underfitting/Baseline |
| **Decision Tree (Unconstrained)** | Default (`depth=19`, `leaves=979`) | 1.0000 | 0.6242 | +0.3758 | Severe Overfitting |
| **Decision Tree (Tuned)** | `max_depth=4`, `min_samples_leaf=10`, `min_samples_split=2` | 0.8095 | 0.8570 | -0.0475 | **Best Performer** |

### Residuals Diagnostics (Baseline)
- **Homoscedasticity:** Verified via the Residuals vs. Predicted Values plot. The residuals are randomly scattered around the $y=0$ baseline, indicating constant variance.
- **Normality:** The distribution of residuals (histogram and KDE curve) is approximately bell-shaped and centered close to 0, satisfying the normality assumption of regression.

---

## Setup

```bash
pip install -r requirements.txt
```
