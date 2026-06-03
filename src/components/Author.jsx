// ── Fill in your own details below ──
const AUTHOR = {
  name:     'Khushi Shah',           // ← your name
  role:     'CS Student · Full-Stack & ML Developer',
  github:   'https://github.com/khushishahs02',        // ← your GitHub
  linkedin: 'https://linkedin.com/in/yourprofile',     // ← your LinkedIn
  avatar:   null,                    // ← set to '/your-photo.jpg' if you add one to /public
}

const story = [
  {
    para: `I started this project not because it was assigned — but because a question bothered me.
    I was reading about how opaque insurance pricing is, and I wanted to know:
    can a machine actually explain why one person pays three times more than another?
    That curiosity became a three-notebook, eight-model, six-week obsession.`,
  },
  {
    para: `I started with EDA — not to jump to models, but to genuinely understand the data first.
    I used Pearson correlation and Chi-Square tests to ask statistically: which features actually
    matter? Smoking status answered loud and clear. Then I spent more time than I expected on
    preprocessing — log-transforming the target, capping outliers, engineering WHO BMI categories,
    making sure the scaler never touched test data. These felt like small decisions but I learned
    they are the difference between a model that works and one that just looks like it works.`,
  },
  {
    para: `I evaluated eight algorithms. Not to collect them like trophies, but to understand the
    trade-offs — when does regularisation help, what does a validation curve actually tell you,
    why does Gradient Boosting beat Random Forest on this specific dataset. The part I'm most
    proud of is the fairness audit: independently measuring the model's accuracy on smokers vs
    non-smokers to check it wasn't hiding a performance gap. Most tutorials don't cover this.
    I'm glad I added it.`,
  },
  {
    para: `SHAP was the final piece — and the one that made everything click. Suddenly I could
    look at a single patient and say exactly why the model charged them what it did, in plain numbers.
    That's when this stopped feeling like a notebook and started feeling like a product.
    Building this site was my way of closing that loop.`,
  },
]

const concepts = [
  'Exploratory Data Analysis', 'Statistical Feature Selection', 'Pearson Correlation',
  'Chi-Square Testing', 'Outlier Treatment (IQR)', 'Log Transformation',
  'Feature Engineering', 'StandardScaler', 'One-Hot Encoding',
  'Linear / Lasso / ElasticNet Regression', 'Support Vector Regression',
  'Decision Tree & Validation Curve', 'Random Forest (Bagging)',
  'Gradient Boosting (Boosting)', 'GridSearchCV', 'LassoCV / ElasticNetCV',
  'SHAP TreeExplainer', 'Waterfall & Beeswarm Plots', 'Subgroup Fairness Audit',
  'Model Serialisation (joblib)', 'FastAPI', 'React + Tailwind', 'Vercel + Render',
]

export default function Author() {
  return (
    <section id="author" className="border-b border-stone-200 bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">

        <div className="mb-12">
          <p className="eyebrow mb-3">The Builder</p>
          <h2 className="section-title">Author</h2>
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-12 items-start">

          {/* Left — identity card */}
          <div className="space-y-6">
            <div className="card text-center p-8">
              {/* Avatar */}
              <div className="w-20 h-20 mx-auto bg-ink-900 flex items-center justify-center mb-4">
                {AUTHOR.avatar ? (
                  <img src={AUTHOR.avatar} alt={AUTHOR.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display text-3xl text-stone-50 font-bold">
                    {AUTHOR.name.charAt(0)}
                  </span>
                )}
              </div>
              <h3 className="font-display text-xl text-ink-900">{AUTHOR.name}</h3>
              <p className="font-body text-xs text-ink-500 mt-1">{AUTHOR.role}</p>

              <div className="flex gap-3 mt-5 justify-center">
                <a
                  href={AUTHOR.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-xs py-2 px-4"
                >
                  GitHub ↗
                </a>
                <a
                  href={AUTHOR.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs py-2 px-4"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>

            {/* Concepts covered */}
            <div>
              <p className="eyebrow mb-3">Concepts Covered</p>
              <div className="flex flex-wrap gap-2">
                {concepts.map(c => (
                  <span key={c} className="font-mono text-xs text-ink-600 bg-white border border-stone-200 px-2 py-1">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — story */}
          <div className="space-y-6">
            {story.map((s, i) => (
              <p key={i} className="font-body text-base text-ink-700 leading-loose">
                {s.para}
              </p>
            ))}

            {/* Notebooks link */}
            <div className="border-t border-stone-200 pt-6">
              <a
                href={AUTHOR.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost inline-flex"
              >
                View the Notebooks on GitHub ↗
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
