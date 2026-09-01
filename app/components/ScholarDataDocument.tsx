import type { ScholarDataContent } from "../content/scholarDataContent";
import { ScholarDataStageIcon } from "./ScholarDataStageIcon";
import { ScholarGroupIcon } from "./ScholarGroupIcon";
import "../flyer/flyer-document.css";
import "../scholar-data/scholar-data-document.css";

type ScholarDataDocumentProps = {
  content: ScholarDataContent;
  mode?: "screen" | "export";
};

export function ScholarDataDocument({ content, mode = "screen" }: ScholarDataDocumentProps) {
  const visiblePillars = content.dataPillars.filter(
    (item) => item.label.trim().length > 0 || item.detail.trim().length > 0,
  );
  const visibleStages = content.pipelineStages.filter(
    (item) => item.title.trim().length > 0 || item.detail.trim().length > 0,
  );
  const visibleAudience = content.audienceSummary.filter(
    (item) => item.label.trim().length > 0 || item.detail.trim().length > 0,
  );
  const visibleGroups = content.scholarGroups.filter(
    (item) => item.name.trim().length > 0 || item.detail.trim().length > 0,
  );
  const visibleTiers = content.hierarchyTiers.filter(
    (item) => item.title.trim().length > 0 || item.detail.trim().length > 0,
  );
  const visibleSafeguards = content.safeguards.filter((item) => item.trim().length > 0);

  const showHeroCard = content.heroCardTitle.trim().length > 0 || visiblePillars.length > 0;
  const showScopeBand =
    content.scopeHeading.trim().length > 0 || content.scopeNote.trim().length > 0;
  const showPipelineHeader =
    content.pipelineHeading.trim().length > 0 || content.pipelineIntro.trim().length > 0;
  const showAssurance =
    content.assuranceHeading.trim().length > 0 || content.assuranceNote.trim().length > 0;
  const showBackHeader =
    content.backEyebrow.trim().length > 0 ||
    content.hierarchyHeading.trim().length > 0 ||
    content.hierarchyIntro.trim().length > 0;
  const showGroupsHeader =
    content.groupsHeading.trim().length > 0 || content.groupsIntro.trim().length > 0;
  const showSafeguards =
    content.safeguardsHeading.trim().length > 0 || visibleSafeguards.length > 0;
  const showClassification =
    content.classificationHeading.trim().length > 0 ||
    content.classificationNote.trim().length > 0;
  const showFooterIdeator =
    content.ideatorLabel.trim().length > 0 || content.ideator.trim().length > 0;
  const showFooterContact = content.contactLine.trim().length > 0;
  const showFooterNote = content.footerNote.trim().length > 0;
  const showFooter = showFooterIdeator || showFooterContact || showFooterNote;

  const footer = showFooter ? (
    <>
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
    </>
  ) : null;

  return (
    <article
      className={`flyer-document flyer-document-${mode} sd-document`}
      aria-label="Project Arch scholar data flyer"
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
              <aside className="flyer-hero-card" aria-label="Scholar data snapshot">
                {content.heroCardTitle.trim().length > 0 ? (
                  <span className="flyer-hero-kicker">{content.heroCardTitle}</span>
                ) : null}
                {visiblePillars.length > 0 ? (
                  <div className="flyer-stats">
                    {visiblePillars.map((item) => (
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

        <section className="sd-pipeline" aria-label="Scholar data pipeline">
          {showPipelineHeader ? (
            <div className="sd-section-head">
              {content.pipelineHeading.trim().length > 0 ? (
                <h2>{content.pipelineHeading}</h2>
              ) : null}
              {content.pipelineIntro.trim().length > 0 ? <p>{content.pipelineIntro}</p> : null}
            </div>
          ) : null}

          {visibleStages.length > 0 ? (
            <>
              <div className="sd-rail" aria-hidden="true">
                <div className="sd-rail-line" />
                {visibleStages.map((item, index) => (
                  <div className="sd-rail-node" key={`rail-${index}-${item.title}`}>
                    <span className="sd-rail-dot">{item.step || String(index + 1)}</span>
                    <span className="sd-rail-label">{item.title}</span>
                  </div>
                ))}
              </div>

              <div className="sd-stage-grid">
                {visibleStages.map((item, index) => (
                  <div className="sd-stage-card" key={`stage-${index}-${item.title}`}>
                    <div className="sd-stage-top">
                      <span className="sd-stage-step">{item.step || String(index + 1)}</span>
                      <span className="sd-stage-icon">
                        <ScholarDataStageIcon icon={item.icon} />
                      </span>
                    </div>
                    {item.title.trim().length > 0 ? <h3>{item.title}</h3> : null}
                    {item.detail.trim().length > 0 ? <p>{item.detail}</p> : null}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </section>

        {showAssurance || visibleAudience.length > 0 ? (
          <section className="flyer-front-summary" aria-label="Scholar data summary">
            {showAssurance ? (
              <div className="flyer-highlights flyer-highlights-card">
                {content.assuranceHeading.trim().length > 0 ? (
                  <span className="flyer-panel-kicker">{content.assuranceHeading}</span>
                ) : null}
                {content.assuranceNote.trim().length > 0 ? (
                  <p className="flyer-callout">{content.assuranceNote}</p>
                ) : null}
              </div>
            ) : null}

            {visibleAudience.length > 0 ? (
              <div className="flyer-value-strip" aria-label="Who this is for">
                {visibleAudience.map((item) => (
                  <div key={`${item.label}-${item.detail}`}>
                    {item.label.trim().length > 0 ? <strong>{item.label}</strong> : null}
                    {item.detail.trim().length > 0 ? <span>{item.detail}</span> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        {showFooter ? <footer className="flyer-footer">{footer}</footer> : null}

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
            {content.hierarchyHeading.trim().length > 0 ? (
              <h2>{content.hierarchyHeading}</h2>
            ) : null}
            {content.hierarchyIntro.trim().length > 0 ? <p>{content.hierarchyIntro}</p> : null}
          </header>
        ) : null}

        <section className="sd-groups" aria-label="Scholar groups">
          {showGroupsHeader ? (
            <div className="sd-section-head sd-section-head-tight">
              {content.groupsHeading.trim().length > 0 ? <h2>{content.groupsHeading}</h2> : null}
              {content.groupsIntro.trim().length > 0 ? <p>{content.groupsIntro}</p> : null}
            </div>
          ) : null}

          {visibleGroups.length > 0 ? (
            <div className="sd-group-grid">
              {visibleGroups.map((item, index) => (
                <div className={`sd-group-card sd-group-card-${item.icon}`} key={`group-${index}`}>
                  <span className="sd-group-icon">
                    <ScholarGroupIcon icon={item.icon} />
                  </span>
                  {item.name.trim().length > 0 ? <strong>{item.name}</strong> : null}
                  {item.dashboardLabel.trim().length > 0 ? (
                    <span className="sd-group-tag">{item.dashboardLabel}</span>
                  ) : null}
                  {item.detail.trim().length > 0 ? (
                    <p className="sd-group-detail">{item.detail}</p>
                  ) : null}
                  {item.criteriaLabel.trim().length > 0 || item.criteria.trim().length > 0 ? (
                    <div className="sd-group-criteria">
                      {item.criteriaLabel.trim().length > 0 ? (
                        <span>{item.criteriaLabel}</span>
                      ) : null}
                      {item.criteria.trim().length > 0 ? <p>{item.criteria}</p> : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </section>

        {visibleTiers.length > 0 ? (
          <section className="sd-hierarchy" aria-label="Scholar data hierarchy levels">
            {visibleTiers.map((item, index) => (
              <div
                className="sd-tier"
                key={`tier-${index}-${item.title}`}
                style={{ width: `${100 - index * 6}%` }}
              >
                <span className="sd-tier-badge">{item.tier || `Level ${index + 1}`}</span>
                <div className="sd-tier-copy">
                  {item.title.trim().length > 0 ? <strong>{item.title}</strong> : null}
                  {item.detail.trim().length > 0 ? <p>{item.detail}</p> : null}
                </div>
              </div>
            ))}
          </section>
        ) : null}

        {showClassification ? (
          <section className="sd-classification" aria-label="Classification placeholder">
            <span className="sd-classification-flag">Draft</span>
            <div className="sd-classification-copy">
              {content.classificationHeading.trim().length > 0 ? (
                <strong>{content.classificationHeading}</strong>
              ) : null}
              {content.classificationNote.trim().length > 0 ? (
                <p>{content.classificationNote}</p>
              ) : null}
            </div>
          </section>
        ) : null}

        {showSafeguards ? (
          <section className="sd-safeguards">
            {content.safeguardsHeading.trim().length > 0 ? (
              <div className="sd-section-head sd-section-head-tight">
                <h2>{content.safeguardsHeading}</h2>
              </div>
            ) : null}

            {visibleSafeguards.length > 0 ? (
              <ol className="sd-safeguard-list">
                {visibleSafeguards.map((item, index) => (
                  <li key={`safeguard-${index}-${item.slice(0, 12)}`}>
                    <span className="sd-safeguard-check" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M5 12.5l4.5 4.5L19 7.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            ) : null}
          </section>
        ) : null}

        {showFooter ? <footer className="flyer-footer flyer-footer-back">{footer}</footer> : null}

        <div className="flyer-flag-bar flyer-flag-bar-bottom" aria-hidden="true" />
      </section>
    </article>
  );
}
