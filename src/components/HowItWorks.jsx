const cards = [
  {
    number: '01',
    title:  'Data & Exploratory Analysis',
    body:   '1,337 patient records across 7 features. Statistical testing — Pearson correlation for numeric features, Chi-Square for categorical — identified smoking status and age as the dominant cost drivers before any model was built.',
    detail: 'Pearson r · Chi-Square · Distribution analysis · Outlier detection',
  },
  {
    number: '02',
    title:  'Preprocessing & Feature Engineering',
    body:   'IQR outlier capping on BMI, log-transformation of the target variable to correct right-skew, WHO-standard BMI binning, and leakage-safe StandardScaler fit only on training data. Every decision is documented and reproducible.',
    detail: 'Log-transform · IQR capping · WHO BMI bins · StandardScaler · OHE',
  },
  {
    number: '03',
    title:  'Model Selection & Explainability',
    body:   '8 algorithms evaluated — Linear Regression, Lasso, ElasticNet, SVR, KNN, Decision Tree, Random Forest, and Gradient Boosting. The winner was validated with a subgroup fairness audit across smoker and non-smoker cohorts.',
    detail: 'GridSearchCV · LassoCV · Validation curve · SHAP TreeExplainer · Fairness audit',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="border-b border-stone-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">

        <div className="mb-12">
          <p className="eyebrow mb-3">Methodology</p>
          <h2 className="section-title">How It Works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-0 border border-stone-200 divide-y md:divide-y-0 md:divide-x divide-stone-200">
          {cards.map(c => (
            <div key={c.number} className="p-8 space-y-4">
              <span className="font-mono text-3xl font-medium text-stone-300">{c.number}</span>
              <h3 className="font-display text-lg text-ink-900">{c.title}</h3>
              <p className="font-body text-sm text-ink-600 leading-relaxed">{c.body}</p>
              <p className="font-mono text-xs text-ink-400 leading-relaxed border-t border-stone-100 pt-3">
                {c.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
