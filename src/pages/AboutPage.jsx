// About page — what this is, sample patient, US-region note, no login note

const samplePatient = {
  name: 'Levi Ackerman',
  age: 34,
  sex: 'Male',
  bmi: 21.28,
  children: 0,
  smoker: 'No',
  region: 'Northeast (US)',
  estimate: '$3,749',
}

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 space-y-16">

      {/* Header */}
      <div className="fade-up max-w-2xl">
        <p className="eyebrow mb-3">What is this</p>
        <h1 className="section-title mb-4">About HealthWealth</h1>
        <p className="font-body text-[#555] text-base leading-relaxed">
          HealthWealth is an academic ML project that predicts annual health insurance charges
          based on a patient's demographic and lifestyle profile. It was built end-to-end
          from raw data exploration to a deployed explainable AI interface as a Summer 2026
          portfolio project.
        </p>
      </div>

      {/* Notices */}
      <div className="fade-up-d1 grid md:grid-cols-3 gap-4">
        {[
          {
            icon: '🔓',
            title: 'No Login Required',
            body: 'This tool is fully open. No account, no sign-up, no data stored. Enter any patient profile and get an instant prediction.'
          },
          {
            icon: '🎓',
            title: 'Academic Use Only',
            body: 'This is not a licensed insurance product. Predictions are for educational and demonstration purposes only and carry no legal or financial weight.'
          },
          {
            icon: '🇺🇸',
            title: 'US Data Only',
            body: 'The model was trained on a US insurance dataset. The region dropdown (Northeast, Northwest, Southeast, Southwest) refers to US geographical regions. Results will not generalise to other countries.'
          },
        ].map(n => (
          <div key={n.title} className="card space-y-2">
            <span className="text-2xl">{n.icon}</span>
            <h3 className="font-body font-semibold text-[#1A1A1A] text-sm">{n.title}</h3>
            <p className="font-body text-xs text-[#666] leading-relaxed">{n.body}</p>
          </div>
        ))}
      </div>

      {/* Sample patient */}
      <div className="fade-up-d2">
        <p className="eyebrow mb-4">Example Prediction</p>
        <div className="grid md:grid-cols-[1fr_320px] gap-8 items-start">
          <div className="card space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#EDECEA]">
              <div className="w-10 h-10 bg-[#1A1A1A] flex items-center justify-center">
                <span className="text-[#F5F4F0] font-display font-bold">LA</span>
              </div>
              <div>
                <p className="font-body font-semibold text-[#1A1A1A]">{samplePatient.name}</p>
                <p className="font-mono text-xs text-[#888]">Sample Patient Profile</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
              {Object.entries(samplePatient).filter(([k]) => k !== 'name' && k !== 'estimate').map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-[#F0EEE8] pb-2">
                  <span className="font-mono text-xs text-[#888] capitalize">{k}</span>
                  <span className="font-body text-xs text-[#1A1A1A]">{v}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-[#EDECEA] flex justify-between items-center">
              <span className="eyebrow">Estimated Annual Charge</span>
              <span className="font-display text-2xl text-[#1A1A1A]">{samplePatient.estimate}</span>
            </div>
            <p className="font-body text-xs text-[#999] italic">
              Levi is a 34-year-old non-smoker with a healthy BMI and zero dependents. His relatively
              young age, normal BMI, and non-smoker status result in a below-average estimate.
              Try changing the smoker status to Yes in the predictor to see how dramatically the
              estimate shifts.
            </p>
          </div>

          <div className="space-y-4">
            <div className="card bg-[#FAFAF8]">
              <p className="eyebrow mb-2">What the model considers</p>
              <ul className="space-y-2 mt-3">
                {[
                  ['Age', 'Older patients have higher charges'],
                  ['BMI', 'Higher BMI, especially obese range, increases costs'],
                  ['Smoker', 'Major cost driver, nearly 3× the baseline'],
                  ['Children', 'Mild positive effect on charges'],
                  ['Sex', 'Minor influence in this dataset'],
                  ['Region', 'US region; minor regional pricing variation'],
                ].map(([f, d]) => (
                  <li key={f} className="text-xs font-body text-[#555] flex gap-2">
                    <span className="font-mono text-[#AAA] shrink-0">—</span>
                    <span><span className="font-medium text-[#1A1A1A]">{f}:</span> {d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card bg-[#FDF3E3] border-[#F0D6A8]">
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9A6320] mb-2">Note on Regions</p>
              <p className="font-body text-xs text-[#7A4F10] leading-relaxed">
                The region field is US-specific (Northeast, Northwest, Southeast, Southwest).
                If you are outside the US, select any region but understand the prediction
                will not reflect your actual healthcare market.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
