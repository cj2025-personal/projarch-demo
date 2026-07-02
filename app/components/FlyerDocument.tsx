import type { FlyerContent } from "../content/flyerContent";
import "../flyer/flyer-document.css";

type FlyerDocumentProps = {
  content: FlyerContent;
  mode?: "screen" | "export";
};

function FlyerFeatureIcon({
  icon,
}: {
  icon: FlyerContent["frontFeatureRows"][number]["icon"];
}) {
  if (icon === "chat") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M10 12h28v18H18l-8 6V12Z" fill="currentColor" opacity="0.14" />
        <path
          d="M10 12h28v18H18l-8 6V12Zm8 8h12M18 25h8"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "directory") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="11" y="9" width="26" height="30" rx="4" fill="currentColor" opacity="0.12" />
        <path
          d="M16 17h16M16 24h16M16 31h10M12 14h6v20h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "podcast") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="6" fill="currentColor" />
        <path
          d="M24 30v8M17 19a10 10 0 0 0 0 10M31 19a10 10 0 0 1 0 10M11 14a17 17 0 0 0 0 20M37 14a17 17 0 0 1 0 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M12 10h24v28H12z" fill="currentColor" opacity="0.12" />
      <path
        d="M16 16h16M16 22h16M16 28h10M30 28l4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FlyerDocument({ content, mode = "screen" }: FlyerDocumentProps) {
  const visibleValuePillars = content.valuePillars.filter(
    (item) => item.label.trim().length > 0 || item.detail.trim().length > 0,
  );
  const visibleFeatureRows = content.frontFeatureRows.filter(
    (item) => item.title.trim().length > 0 || item.detail.trim().length > 0,
  );
  const visibleValueSummary = content.valueSummary.filter(
    (item) => item.label.trim().length > 0 || item.detail.trim().length > 0,
  );
  const visiblePlatformFeatures = content.platformFeatures.filter(
    (item) => item.trim().length > 0,
  );
  const showHeroCard =
    content.heroCardTitle.trim().length > 0 || visibleValuePillars.length > 0;
  const showScopeBand =
    content.scopeHeading.trim().length > 0 || content.scopeNote.trim().length > 0;
  const showSummaryCard =
    content.summaryHeading.trim().length > 0 ||
    content.featurePersonalization.trim().length > 0 ||
    content.featureGoal.trim().length > 0;
  const showFooterIdeator =
    content.ideatorLabel.trim().length > 0 || content.ideator.trim().length > 0;
  const showFooterContact = content.contactLine.trim().length > 0;
  const showFooterNote = content.footerNote.trim().length > 0;
  const showFrontFooter = showFooterIdeator || showFooterContact || showFooterNote;
  const showBackHeader =
    content.backEyebrow.trim().length > 0 ||
    content.featuresHeading.trim().length > 0 ||
    content.featuresIntro.trim().length > 0;
  const showCollaborationCard =
    content.collaborationHeading.trim().length > 0 ||
    content.collaborationBody.trim().length > 0;
  const showBackNoteCard =
    content.backNoteHeading.trim().length > 0 ||
    content.featurePersonalization.trim().length > 0;

  return (
    <article
      className={`flyer-document flyer-document-${mode}`}
      aria-label="Project Arch overview flyer"
    >
      <section className="flyer-sheet flyer-sheet-front" aria-label="Front flyer page">
        <div className="flyer-flag-bar" aria-hidden="true" />

        <header className="flyer-header">
          <div className="flyer-header-accent" aria-hidden="true" />
          <div className="flyer-header-grid">
            <div className="flyer-header-copy">
              <p className="flyer-eyebrow">{content.frontEyebrow}</p>
              <h1>{content.companyName}</h1>
              <p className="flyer-tagline">{content.companyTagline}</p>
              <div className="flyer-title-rule" aria-hidden="true" />
              <p className="flyer-oneliner">{content.conceptOneLiner}</p>
              <p className="flyer-mission">{content.companyMission}</p>
            </div>

            {showHeroCard ? (
              <aside className="flyer-hero-card" aria-label="Project Arch summary">
                {content.heroCardTitle.trim().length > 0 ? (
                  <span className="flyer-hero-kicker">{content.heroCardTitle}</span>
                ) : null}
                {visibleValuePillars.length > 0 ? (
                  <div className="flyer-stats" aria-label="Platform highlights">
                    {visibleValuePillars.map((item) => (
                      <div className="flyer-stat" key={`${item.label}-${item.detail}`}>
                        {item.label.trim().length > 0 ? <strong>{item.label}</strong> : null}
                        {item.detail.trim().length > 0 ? <span>{item.detail}</span> : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </aside>
            ) : null}
          </div>
        </header>

        {showScopeBand ? (
          <section className="flyer-band flyer-band-blue">
            {content.scopeHeading.trim().length > 0 ? <strong>{content.scopeHeading}</strong> : null}
            {content.scopeNote.trim().length > 0 ? <p>{content.scopeNote}</p> : null}
          </section>
        ) : null}

        <section className="flyer-front-story" aria-label="Front flyer feature story">
          {visibleFeatureRows.map((item, index) => (
            <div
              className={`flyer-story-row${index % 2 === 1 ? " flyer-story-row-reverse" : ""}`}
              key={`${item.title}-${item.detail}`}
            >
              <div className="flyer-story-copy">
                <span className="flyer-story-index">{String(index + 1).padStart(2, "0")}</span>
                {item.title.trim().length > 0 ? <h2>{item.title}</h2> : null}
                {item.detail.trim().length > 0 ? <p>{item.detail}</p> : null}
              </div>
              <div className="flyer-story-icon" aria-hidden="true">
                <FlyerFeatureIcon icon={item.icon} />
              </div>
            </div>
          ))}
        </section>

        {showSummaryCard || visibleValueSummary.length > 0 ? (
          <section className="flyer-front-summary" aria-label="Project Arch front-page summary">
            {showSummaryCard ? (
              <div className="flyer-highlights flyer-highlights-card">
                {content.summaryHeading.trim().length > 0 ? (
                  <span className="flyer-panel-kicker">{content.summaryHeading}</span>
                ) : null}
                {content.featurePersonalization.trim().length > 0 ? (
                  <p className="flyer-callout">{content.featurePersonalization}</p>
                ) : null}
                {content.featureGoal.trim().length > 0 ? (
                  <p className="flyer-goal">{content.featureGoal}</p>
                ) : null}
              </div>
            ) : null}

            {visibleValueSummary.length > 0 ? (
              <div className="flyer-value-strip" aria-label="Project Arch value summary">
                {visibleValueSummary.map((item) => (
                  <div key={`${item.label}-${item.detail}`}>
                    {item.label.trim().length > 0 ? <strong>{item.label}</strong> : null}
                    {item.detail.trim().length > 0 ? <span>{item.detail}</span> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        {showFrontFooter ? (
          <footer className="flyer-footer">
            <div className="flyer-footer-grid">
              <div className="flyer-footer-copy">
                {showFooterIdeator ? (
                  <div className="flyer-footer-block">
                    {content.ideatorLabel.trim().length > 0 ? (
                      <span className="flyer-footer-label">{content.ideatorLabel}</span>
                    ) : null}
                    {content.ideator.trim().length > 0 ? <strong>{content.ideator}</strong> : null}
                  </div>
                ) : null}
                {showFooterContact ? (
                  <div className="flyer-footer-block flyer-footer-contact">
                    <span className="flyer-footer-label">{content.contactLine}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {showFooterNote ? <p className="flyer-footer-note">{content.footerNote}</p> : null}
          </footer>
        ) : null}

        <div className="flyer-flag-bar flyer-flag-bar-bottom" aria-hidden="true" />
      </section>

      <section className="flyer-sheet flyer-sheet-back" aria-label="Back flyer page">
        <div className="flyer-flag-bar" aria-hidden="true" />

        {showBackHeader ? (
          <header className="flyer-back-header">
            <div className="flyer-back-accent" aria-hidden="true" />
            {content.backEyebrow.trim().length > 0 ? (
              <p className="flyer-eyebrow">{content.backEyebrow}</p>
            ) : null}
            {content.featuresHeading.trim().length > 0 ? <h2>{content.featuresHeading}</h2> : null}
            {content.featuresIntro.trim().length > 0 ? <p>{content.featuresIntro}</p> : null}
          </header>
        ) : null}

        {visiblePlatformFeatures.length > 0 ? (
          <section className="flyer-body">
            <div className="flyer-features-panel">
              <ol className="flyer-features">
                {visiblePlatformFeatures.map((feature, index) => (
                  <li key={`${index + 1}-${feature}`}>
                    <span className="flyer-feature-index">{index + 1}</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ) : null}

        {showCollaborationCard || showBackNoteCard ? (
          <section className="flyer-back-grid">
            {showCollaborationCard ? (
              <div className="flyer-back-card flyer-back-card-red">
                {content.collaborationHeading.trim().length > 0 ? (
                  <strong>{content.collaborationHeading}</strong>
                ) : null}
                {content.collaborationBody.trim().length > 0 ? (
                  <p>{content.collaborationBody}</p>
                ) : null}
              </div>
            ) : null}

            {showBackNoteCard ? (
              <div className="flyer-back-card flyer-back-card-blue">
                {content.backNoteHeading.trim().length > 0 ? (
                  <strong>{content.backNoteHeading}</strong>
                ) : null}
                {content.featurePersonalization.trim().length > 0 ? (
                  <p>{content.featurePersonalization}</p>
                ) : null}
              </div>
            ) : null}
          </section>
        ) : null}

        {showFrontFooter ? (
          <footer className="flyer-footer flyer-footer-back">
            <div className="flyer-footer-grid">
              <div className="flyer-footer-copy">
                {showFooterIdeator ? (
                  <div className="flyer-footer-block">
                    {content.ideatorLabel.trim().length > 0 ? (
                      <span className="flyer-footer-label">{content.ideatorLabel}</span>
                    ) : null}
                    {content.ideator.trim().length > 0 ? <strong>{content.ideator}</strong> : null}
                  </div>
                ) : null}
                {showFooterContact ? (
                  <div className="flyer-footer-block flyer-footer-contact">
                    <span className="flyer-footer-label">{content.contactLine}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {showFooterNote ? <p className="flyer-footer-note">{content.footerNote}</p> : null}
          </footer>
        ) : null}

        <div className="flyer-flag-bar flyer-flag-bar-bottom" aria-hidden="true" />
      </section>
    </article>
  );
}
