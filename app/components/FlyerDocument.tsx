import {
  companyName,
  companyTagline,
  companyMission,
  conceptNote,
  conceptOneLiner,
  conceptScopeNote,
  contactEmail,
  contactLine,
  featureGoal,
  featurePersonalization,
  ideator,
  platformFeatures,
} from "../content/platformContent";
import "../flyer/flyer-document.css";

const valuePillars = [
  { label: "Scholar Data", detail: "Students access research with AI help" },
  { label: "Big Ten Focus", detail: "Initial concept scope" },
  { label: "K12–14 Focus", detail: "Reading-level adaptive AI" },
];

const processSteps = [
  "Students access scholar data",
  "AI-assisted comprehension help",
  "Personalized for each community",
];

export function FlyerDocument() {
  return (
    <article className="flyer-document" aria-label="Project Arch overview flyer">
      <div className="flyer-flag-bar" aria-hidden="true" />

      <header className="flyer-header">
        <div className="flyer-header-accent" aria-hidden="true" />
        <p className="flyer-eyebrow">Concept Overview</p>
        <h1>{companyName}</h1>
        <p className="flyer-tagline">{companyTagline}</p>
        <p className="flyer-oneliner">{conceptOneLiner}</p>
        <p className="flyer-mission">{companyMission}</p>

        <div className="flyer-stats" aria-label="Platform highlights">
          {valuePillars.map((item) => (
            <div className="flyer-stat" key={item.label}>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </div>
          ))}
        </div>
      </header>

      <div className="flyer-main">
        <section className="flyer-band flyer-band-blue">
          <strong>Concept Scope</strong>
          <p>{conceptScopeNote}</p>
        </section>

        <section className="flyer-process" aria-label="How Project Arch would work">
          {processSteps.map((step, index) => (
            <div className="flyer-process-step" key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </div>
          ))}
        </section>

        <section className="flyer-body">
          <div className="flyer-body-head">
            <h2>Platform Features</h2>
            <p>{conceptNote}</p>
          </div>

          <div className="flyer-features-panel">
            <ol className="flyer-features">
              {platformFeatures.map((feature, index) => (
                <li key={feature}>
                  <span className="flyer-feature-index">{index + 1}</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="flyer-highlights">
          <p className="flyer-callout">{featurePersonalization}</p>
          <p className="flyer-goal">{featureGoal}</p>
        </div>

        <div className="flyer-value-strip" aria-label="Project Arch value summary">
          <div>
            <strong>Scholar access</strong>
            <span>Students explore research and background data</span>
          </div>
          <div>
            <strong>AI assistance</strong>
            <span>Help with comprehension and learning</span>
          </div>
          <div>
            <strong>Idea announced</strong>
            <span>Concept shared—not a live release</span>
          </div>
        </div>
      </div>

      <footer className="flyer-footer">
        <div className="flyer-footer-grid">
          <div className="flyer-footer-copy">
            <div className="flyer-footer-block">
              <span className="flyer-footer-label">Ideated by</span>
              <strong>{ideator}</strong>
            </div>
            <div className="flyer-footer-block flyer-footer-contact">
              <span className="flyer-footer-label">{contactLine}</span>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </div>
          </div>

          <div className="flyer-qr-card">
            <img src="/qr-code.svg" alt="" width="88" height="88" />
            <strong>Scan to learn more</strong>
            <span>Full concept overview online</span>
          </div>
        </div>

        <p className="flyer-footer-note">
          Project Arch · An announced concept only. Big Ten is a registered trademark
          of the Big Ten Conference.
        </p>
      </footer>

      <div className="flyer-flag-bar flyer-flag-bar-bottom" aria-hidden="true" />
    </article>
  );
}
