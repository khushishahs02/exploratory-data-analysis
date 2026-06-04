const GITHUB = 'https://github.com/khushishahs02'
const LINKEDIN = 'https://www.linkedin.com/in/khushi-shah-047761287/'

const concepts = [
  'NumPy & Pandas', 'Exploratory Data Analysis',
  'Leakage-safe Scaling', 'Outlier Treatment', 'Correlation Mapping',
  'Feature Engineering (BMI categories)', 'Linear Regression',
  'Lasso & ElasticNet', 'Support Vector Regression (SVR)',
  'K-Nearest Neighbours', 'Decision Tree', 'Random Forest',
  'Gradient Boosting / XGBoost', 'GridSearchCV', 'SHAP TreeExplainer',
  'Waterfall & Beeswarm Plots', 'Explainable AI', 'FastAPI',
  'React + Tailwind CSS', 'Vercel + Render Deployment',
]

const GithubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
)

const LinkedinIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

export default function AuthorPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">

      {/* ── Top: Name + role + links — centred ── */}
      <div className="fade-up text-center mb-14 border-b border-[#E4E2DA] pb-12">
        <h1 className="font-display text-4xl md:text-5xl text-[#1A1A1A] mb-2">Khushi Shah</h1>
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#AAA] mb-6">
          ICT CS Student · Data Science &amp; ML Enthusiast
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs py-2.5 px-5 flex items-center gap-2"
          >
            <GithubIcon /> GitHub ↗
          </a>
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2"
          >
            <LinkedinIcon /> LinkedIn ↗
          </a>
        </div>
      </div>

      {/* ── Story — full width ── */}
      <div className="fade-up-d1 space-y-6 font-body text-[#444] text-base leading-loose max-w-3xl mx-auto">

        <p>
          My journey into data science started with the raw basics, wrestling with NumPy and
          Pandas, and building visual dashboards in Microsoft Power BI. That was the initial
          spark. I became incredibly passionate about data analytics and eventually found myself
          following a tutorial from Sheryians AI School (huge shoutout to my mentor, Akarsh Vyas)
          to build an insurance pricing model. But halfway through, I realized the pace was moving
          too quickly. I didn't just want to copy-paste code; I wanted to truly understand the
          mechanics under the hood. I have a personal philosophy: if I start learning something,
          I do it in exhaustive detail the first time, because I know I won't want to backtrack
          to the basics later.
        </p>

        <p>
          So, I took a massive detour into the deep end. I spent days mastering the gritty
          realities of data preprocessing, starting up with exploratory data analysis (EDA),
          leakage-safe scaling, outlier treatment, correlation mapping, and complex feature
          engineering around BMI categories. When it came to the actual Machine Learning phase,
          I refused to just run three or four basic algorithms and call it a day. I used Gemini
          as a learning companion to systematically explore the entire landscape of supervised
          learning, training an arsenal of models so I wouldn't miss a single concept.
        </p>

        <p>
          Here is where the project got really interesting. My most mathematically precise model
          was actually Support Vector Regression (SVR). However, I was determined to implement
          Explainable AI using SHAP. SVR requires a{' '}
          <code className="font-mono text-sm bg-[#EDECEA] px-1.5 py-0.5">KernelExplainer</code>,
          which is notoriously computationally heavy and threatened to completely crash my RAM.
          So, I made a conscious engineering trade-off: I sacrificed a tiny fraction of accuracy
          to deploy my second-best model, XGBoost (Gradient Boosting), which integrates
          beautifully with SHAP's lightning-fast{' '}
          <code className="font-mono text-sm bg-[#EDECEA] px-1.5 py-0.5">TreeExplainer</code>.
          Discovering SHAP and realizing we can actually force a "black box" AI to explain its
          math in plain English was an absolute game-changer for me.
        </p>

        <p>
          To bring it all together, I coded this exact UI using Claude based on my strict design
          specifications. This is my very first major, end-to-end project where I invested not
          just my time, but my entire brain. I genuinely loved the entire process. Next up, I'm
          planning to dive into complex classification algorithms and tackle even messier datasets.
        </p>

        <p className="font-display text-lg text-[#1A1A1A]">
          Give the Predictor a try if you liked it — and do check out my other projects on GitHub.
        </p>

        <div className="pt-2 border-t border-[#E4E2DA]">
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="btn-ghost inline-flex items-center gap-2">
            <GithubIcon /> View the Notebooks on GitHub ↗
          </a>
        </div>
      </div>

      {/* ── Concepts — full width, after story ── */}
      <div className="fade-up-d2 mt-14 pt-10 border-t border-[#E4E2DA]">
        <p className="eyebrow mb-4">Concepts Covered in This Project</p>
        <div className="flex flex-wrap gap-2">
          {concepts.map(c => (
            <span
              key={c}
              className="font-mono text-[10px] text-[#555] bg-white border border-[#E4E2DA] px-2.5 py-1.5"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}