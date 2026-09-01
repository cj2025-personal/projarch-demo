"use client";

import type {
  ScholarDataContent,
  ScholarDataPair,
  ScholarDataStage,
  ScholarDataTextField,
  ScholarDataTier,
  ScholarGroup,
} from "../content/scholarDataContent";
import { EditableField } from "./flyerEditPrimitives";
import { ScholarDataStageIcon } from "./ScholarDataStageIcon";
import { ScholarGroupIcon } from "./ScholarGroupIcon";
import "../flyer/flyer-document.css";
import "../scholar-data/scholar-data-document.css";

type PairField = "dataPillars" | "audienceSummary";

type ScholarDataEditableDocumentProps = {
  content: ScholarDataContent;
  onTextChange: (field: ScholarDataTextField, value: string) => void;
  onTextDelete: (field: ScholarDataTextField) => void;
  onPairChange: (
    field: PairField,
    index: number,
    key: keyof ScholarDataPair,
    value: string,
  ) => void;
  onPairDelete: (field: PairField, index: number) => void;
  onPairRestore: (field: PairField, index: number) => void;
  onStageChange: (index: number, key: keyof ScholarDataStage, value: string) => void;
  onStageDelete: (index: number) => void;
  onStageRestore: (index: number) => void;
  onGroupChange: (index: number, key: keyof ScholarGroup, value: string) => void;
  onGroupDelete: (index: number) => void;
  onGroupRestore: (index: number) => void;
  onTierChange: (index: number, key: keyof ScholarDataTier, value: string) => void;
  onTierDelete: (index: number) => void;
  onTierRestore: (index: number) => void;
  onSafeguardChange: (index: number, value: string) => void;
  onSafeguardDelete: (index: number) => void;
  onSafeguardRestore: (index: number) => void;
};

function EditablePairCard({
  detail,
  detailLabel,
  label,
  labelLabel,
  onDelete,
  onDetailChange,
  onLabelChange,
  onRestore,
}: {
  detail: string;
  detailLabel: string;
  label: string;
  labelLabel: string;
  onDelete: () => void;
  onDetailChange: (value: string) => void;
  onLabelChange: (value: string) => void;
  onRestore: () => void;
}) {
  const isDeleted = label.trim().length === 0 && detail.trim().length === 0;

  if (isDeleted) {
    return (
      <div className="flyer-edit-value-card flyer-edit-placeholder-card">
        <button className="flyer-edit-add" onClick={onRestore} type="button">
          +
        </button>
      </div>
    );
  }

  return (
    <div className="flyer-edit-card flyer-edit-value-card">
      <button className="flyer-edit-delete" onClick={onDelete} type="button">
        Delete
      </button>
      <EditableField
        ariaLabel={labelLabel}
        className="flyer-value-label"
        deleteLabel={`Delete ${labelLabel}`}
        onChange={onLabelChange}
        onDelete={() => onLabelChange("")}
        value={label}
      />
      <EditableField
        ariaLabel={detailLabel}
        className="flyer-value-detail"
        deleteLabel={`Delete ${detailLabel}`}
        multiline
        onChange={onDetailChange}
        onDelete={() => onDetailChange("")}
        value={detail}
      />
    </div>
  );
}

export function ScholarDataEditableDocument({
  content,
  onPairChange,
  onPairDelete,
  onPairRestore,
  onGroupChange,
  onGroupDelete,
  onGroupRestore,
  onSafeguardChange,
  onSafeguardDelete,
  onSafeguardRestore,
  onStageChange,
  onStageDelete,
  onStageRestore,
  onTextChange,
  onTextDelete,
  onTierChange,
  onTierDelete,
  onTierRestore,
}: ScholarDataEditableDocumentProps) {
  const heroCardDeleted =
    content.heroCardTitle.trim().length === 0 &&
    content.dataPillars.every(
      (item) => item.label.trim().length === 0 && item.detail.trim().length === 0,
    );
  const scopeBandDeleted =
    content.scopeHeading.trim().length === 0 && content.scopeNote.trim().length === 0;
  const assuranceDeleted =
    content.assuranceHeading.trim().length === 0 && content.assuranceNote.trim().length === 0;
  const classificationDeleted =
    content.classificationHeading.trim().length === 0 &&
    content.classificationNote.trim().length === 0;
  const footerIdeatorDeleted =
    content.ideatorLabel.trim().length === 0 && content.ideator.trim().length === 0;
  const footerContactDeleted = content.contactLine.trim().length === 0;

  const deleteHeroCard = () => {
    onTextDelete("heroCardTitle");
    content.dataPillars.forEach((_, index) => onPairDelete("dataPillars", index));
  };

  const restoreHeroCard = () => {
    onTextChange("heroCardTitle", "What we hold");
    content.dataPillars.forEach((item, index) => {
      if (item.label.trim().length === 0 && item.detail.trim().length === 0) {
        onPairRestore("dataPillars", index);
      }
    });
  };

  const deleteScopeBand = () => {
    onTextDelete("scopeHeading");
    onTextDelete("scopeNote");
  };

  const restoreScopeBand = () => {
    onTextChange("scopeHeading", "Why this matters in a classroom");
    onTextChange("scopeNote", "Add scope copy.");
  };

  const deleteAssuranceCard = () => {
    onTextDelete("assuranceHeading");
    onTextDelete("assuranceNote");
  };

  const restoreAssuranceCard = () => {
    onTextChange("assuranceHeading", "The short version");
    onTextChange("assuranceNote", "Add the summary line.");
  };

  const deleteClassification = () => {
    onTextDelete("classificationHeading");
    onTextDelete("classificationNote");
  };

  const restoreClassification = () => {
    onTextChange("classificationHeading", "Placeholder: how legacy and legendary are decided");
    onTextChange("classificationNote", "Add the agreed definition here.");
  };

  const renderFooter = () => (
    <>
      <div className="flyer-footer-grid">
        <div className="flyer-footer-copy">
          {footerIdeatorDeleted ? (
            <button
              className="flyer-edit-add"
              onClick={() => {
                onTextChange("ideatorLabel", "Ideated by");
                onTextChange("ideator", "Add name");
              }}
              type="button"
            >
              +
            </button>
          ) : (
            <div className="flyer-edit-card flyer-footer-block">
              <button
                className="flyer-edit-delete"
                onClick={() => {
                  onTextDelete("ideatorLabel");
                  onTextDelete("ideator");
                }}
                type="button"
              >
                Delete
              </button>
              <EditableField
                ariaLabel="Footer ideator label"
                className="flyer-footer-label"
                deleteLabel="Delete footer ideator label"
                onChange={(value) => onTextChange("ideatorLabel", value)}
                onDelete={() => onTextDelete("ideatorLabel")}
                value={content.ideatorLabel}
              />
              <EditableField
                ariaLabel="Footer ideator name"
                className="flyer-footer-strong"
                deleteLabel="Delete footer ideator name"
                onChange={(value) => onTextChange("ideator", value)}
                onDelete={() => onTextDelete("ideator")}
                value={content.ideator}
              />
            </div>
          )}

          {footerContactDeleted ? (
            <button
              className="flyer-edit-add"
              onClick={() => onTextChange("contactLine", "Add contact copy.")}
              type="button"
            >
              +
            </button>
          ) : (
            <div className="flyer-edit-card flyer-footer-block flyer-footer-contact">
              <button
                className="flyer-edit-delete"
                onClick={() => onTextDelete("contactLine")}
                type="button"
              >
                Delete
              </button>
              <EditableField
                ariaLabel="Footer contact line"
                className="flyer-footer-label"
                deleteLabel="Delete footer contact line"
                multiline
                onChange={(value) => onTextChange("contactLine", value)}
                onDelete={() => onTextDelete("contactLine")}
                value={content.contactLine}
              />
            </div>
          )}
        </div>
      </div>

      <EditableField
        ariaLabel="Footer note"
        className="flyer-footer-note"
        deleteLabel="Delete footer note"
        multiline
        onChange={(value) => onTextChange("footerNote", value)}
        onDelete={() => onTextDelete("footerNote")}
        value={content.footerNote}
      />
    </>
  );

  return (
    <article
      className="flyer-document flyer-document-editor sd-document"
      aria-label="Editable scholar data flyer"
    >
      <section className="flyer-sheet flyer-sheet-front" aria-label="Front flyer page">
        <div className="flyer-flag-bar" aria-hidden="true" />

        <header className="flyer-header">
          <div className="flyer-header-accent" aria-hidden="true" />
          <div className="flyer-header-grid">
            <div className="flyer-header-copy">
              <EditableField
                ariaLabel="Front eyebrow"
                className="flyer-eyebrow"
                deleteLabel="Delete front eyebrow"
                onChange={(value) => onTextChange("frontEyebrow", value)}
                onDelete={() => onTextDelete("frontEyebrow")}
                value={content.frontEyebrow}
              />
              <EditableField
                ariaLabel="Company name"
                className="flyer-heading-main"
                deleteLabel="Clear company name"
                onChange={(value) => onTextChange("companyName", value)}
                onDelete={() => onTextDelete("companyName")}
                value={content.companyName}
              />
              <EditableField
                ariaLabel="Company tagline"
                className="flyer-tagline"
                deleteLabel="Delete company tagline"
                onChange={(value) => onTextChange("companyTagline", value)}
                onDelete={() => onTextDelete("companyTagline")}
                value={content.companyTagline}
              />
              <div className="flyer-title-rule" aria-hidden="true" />
              <EditableField
                ariaLabel="Concept one-liner"
                className="flyer-oneliner"
                deleteLabel="Delete concept one-liner"
                multiline
                onChange={(value) => onTextChange("conceptOneLiner", value)}
                onDelete={() => onTextDelete("conceptOneLiner")}
                value={content.conceptOneLiner}
              />
              <EditableField
                ariaLabel="Audience note"
                className="flyer-mission"
                deleteLabel="Delete audience note"
                multiline
                onChange={(value) => onTextChange("companyMission", value)}
                onDelete={() => onTextDelete("companyMission")}
                value={content.companyMission}
              />
            </div>

            {heroCardDeleted ? (
              <div className="flyer-hero-card flyer-edit-placeholder-card">
                <button className="flyer-edit-add" onClick={restoreHeroCard} type="button">
                  +
                </button>
              </div>
            ) : (
              <aside className="flyer-hero-card flyer-edit-card">
                <button className="flyer-edit-delete" onClick={deleteHeroCard} type="button">
                  Delete
                </button>
                <EditableField
                  ariaLabel="Hero card title"
                  className="flyer-hero-kicker"
                  deleteLabel="Delete hero card title"
                  onChange={(value) => onTextChange("heroCardTitle", value)}
                  onDelete={() => onTextDelete("heroCardTitle")}
                  value={content.heroCardTitle}
                />
                <div className="flyer-stats">
                  {content.dataPillars.map((item, index) => {
                    const isDeleted =
                      item.label.trim().length === 0 && item.detail.trim().length === 0;

                    if (isDeleted) {
                      return (
                        <div
                          className="flyer-stat flyer-edit-placeholder-card"
                          key={`pillar-${index}`}
                        >
                          <button
                            className="flyer-edit-add"
                            onClick={() => onPairRestore("dataPillars", index)}
                            type="button"
                          >
                            +
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="flyer-stat flyer-edit-card" key={`pillar-${index}`}>
                        <button
                          className="flyer-edit-delete"
                          onClick={() => onPairDelete("dataPillars", index)}
                          type="button"
                        >
                          Delete
                        </button>
                        <EditableField
                          ariaLabel={`Data pillar ${index + 1} label`}
                          className="flyer-stat-label"
                          deleteLabel={`Delete data pillar ${index + 1} label`}
                          onChange={(value) =>
                            onPairChange("dataPillars", index, "label", value)
                          }
                          onDelete={() => onPairChange("dataPillars", index, "label", "")}
                          value={item.label}
                        />
                        <EditableField
                          ariaLabel={`Data pillar ${index + 1} detail`}
                          className="flyer-stat-detail"
                          deleteLabel={`Delete data pillar ${index + 1} detail`}
                          multiline
                          onChange={(value) =>
                            onPairChange("dataPillars", index, "detail", value)
                          }
                          onDelete={() => onPairChange("dataPillars", index, "detail", "")}
                          value={item.detail}
                        />
                      </div>
                    );
                  })}
                </div>
              </aside>
            )}
          </div>
        </header>

        {scopeBandDeleted ? (
          <section className="flyer-band flyer-band-blue flyer-edit-placeholder-card">
            <button className="flyer-edit-add" onClick={restoreScopeBand} type="button">
              +
            </button>
          </section>
        ) : (
          <section className="flyer-band flyer-band-blue flyer-edit-card">
            <button className="flyer-edit-delete" onClick={deleteScopeBand} type="button">
              Delete
            </button>
            <EditableField
              ariaLabel="Scope heading"
              className="flyer-band-title"
              deleteLabel="Delete scope heading"
              onChange={(value) => onTextChange("scopeHeading", value)}
              onDelete={() => onTextDelete("scopeHeading")}
              value={content.scopeHeading}
            />
            <EditableField
              ariaLabel="Scope note"
              className="flyer-band-copy"
              deleteLabel="Delete scope note"
              multiline
              onChange={(value) => onTextChange("scopeNote", value)}
              onDelete={() => onTextDelete("scopeNote")}
              value={content.scopeNote}
            />
          </section>
        )}

        <section className="sd-pipeline">
          <div className="sd-section-head">
            <EditableField
              ariaLabel="Pipeline heading"
              className="sd-heading"
              deleteLabel="Delete pipeline heading"
              multiline
              onChange={(value) => onTextChange("pipelineHeading", value)}
              onDelete={() => onTextDelete("pipelineHeading")}
              value={content.pipelineHeading}
            />
            <EditableField
              ariaLabel="Pipeline intro"
              className="sd-intro"
              deleteLabel="Delete pipeline intro"
              multiline
              onChange={(value) => onTextChange("pipelineIntro", value)}
              onDelete={() => onTextDelete("pipelineIntro")}
              value={content.pipelineIntro}
            />
          </div>

          <div className="sd-rail" aria-hidden="true">
            <div className="sd-rail-line" />
            {content.pipelineStages.map((item, index) => (
              <div className="sd-rail-node" key={`rail-${index}`}>
                <span className="sd-rail-dot">{item.step || String(index + 1)}</span>
                <span className="sd-rail-label">{item.title}</span>
              </div>
            ))}
          </div>

          <div className="sd-stage-grid">
            {content.pipelineStages.map((item, index) => {
              const isDeleted =
                item.title.trim().length === 0 && item.detail.trim().length === 0;

              if (isDeleted) {
                return (
                  <div className="sd-stage-card flyer-edit-placeholder-card" key={`stage-${index}`}>
                    <button
                      className="flyer-edit-add"
                      onClick={() => onStageRestore(index)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                );
              }

              return (
                <div className="sd-stage-card flyer-edit-card" key={`stage-${index}`}>
                  <button
                    className="flyer-edit-delete"
                    onClick={() => onStageDelete(index)}
                    type="button"
                  >
                    Delete
                  </button>
                  <div className="sd-stage-top">
                    <span className="sd-stage-step">{item.step || String(index + 1)}</span>
                    <span className="sd-stage-icon">
                      <ScholarDataStageIcon icon={item.icon} />
                    </span>
                  </div>
                  <EditableField
                    ariaLabel={`Pipeline step ${index + 1} title`}
                    className="sd-stage-title"
                    deleteLabel={`Delete pipeline step ${index + 1} title`}
                    multiline
                    onChange={(value) => onStageChange(index, "title", value)}
                    onDelete={() => onStageChange(index, "title", "")}
                    value={item.title}
                  />
                  <EditableField
                    ariaLabel={`Pipeline step ${index + 1} detail`}
                    className="sd-stage-detail"
                    deleteLabel={`Delete pipeline step ${index + 1} detail`}
                    multiline
                    onChange={(value) => onStageChange(index, "detail", value)}
                    onDelete={() => onStageChange(index, "detail", "")}
                    value={item.detail}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="flyer-front-summary">
          {assuranceDeleted ? (
            <div className="flyer-highlights flyer-highlights-card flyer-edit-placeholder-card">
              <button className="flyer-edit-add" onClick={restoreAssuranceCard} type="button">
                +
              </button>
            </div>
          ) : (
            <div className="flyer-highlights flyer-highlights-card flyer-edit-card">
              <button className="flyer-edit-delete" onClick={deleteAssuranceCard} type="button">
                Delete
              </button>
              <EditableField
                ariaLabel="Assurance heading"
                className="flyer-panel-kicker"
                deleteLabel="Delete assurance heading"
                onChange={(value) => onTextChange("assuranceHeading", value)}
                onDelete={() => onTextDelete("assuranceHeading")}
                value={content.assuranceHeading}
              />
              <EditableField
                ariaLabel="Assurance note"
                className="flyer-callout"
                deleteLabel="Delete assurance note"
                multiline
                onChange={(value) => onTextChange("assuranceNote", value)}
                onDelete={() => onTextDelete("assuranceNote")}
                value={content.assuranceNote}
              />
            </div>
          )}

          <div className="flyer-value-strip">
            {content.audienceSummary.map((item, index) => (
              <EditablePairCard
                key={`audience-${index}`}
                detail={item.detail}
                detailLabel={`Audience ${index + 1} detail`}
                label={item.label}
                labelLabel={`Audience ${index + 1} label`}
                onDelete={() => onPairDelete("audienceSummary", index)}
                onDetailChange={(value) =>
                  onPairChange("audienceSummary", index, "detail", value)
                }
                onLabelChange={(value) => onPairChange("audienceSummary", index, "label", value)}
                onRestore={() => onPairRestore("audienceSummary", index)}
              />
            ))}
          </div>
        </section>

        <footer className="flyer-footer">{renderFooter()}</footer>

        <div className="flyer-flag-bar flyer-flag-bar-bottom" aria-hidden="true" />
      </section>

      <section className="flyer-sheet flyer-sheet-back" aria-label="Back flyer page">
        <div className="flyer-flag-bar" aria-hidden="true" />

        <header className="flyer-back-header">
          <div className="flyer-back-accent" aria-hidden="true" />
          <EditableField
            ariaLabel="Back eyebrow"
            className="flyer-eyebrow"
            deleteLabel="Delete back eyebrow"
            onChange={(value) => onTextChange("backEyebrow", value)}
            onDelete={() => onTextDelete("backEyebrow")}
            value={content.backEyebrow}
          />
          <EditableField
            ariaLabel="Hierarchy heading"
            className="flyer-back-heading"
            deleteLabel="Delete hierarchy heading"
            multiline
            onChange={(value) => onTextChange("hierarchyHeading", value)}
            onDelete={() => onTextDelete("hierarchyHeading")}
            value={content.hierarchyHeading}
          />
          <EditableField
            ariaLabel="Hierarchy intro"
            className="flyer-back-intro"
            deleteLabel="Delete hierarchy intro"
            multiline
            onChange={(value) => onTextChange("hierarchyIntro", value)}
            onDelete={() => onTextDelete("hierarchyIntro")}
            value={content.hierarchyIntro}
          />
        </header>

        <section className="sd-groups">
          <div className="sd-section-head sd-section-head-tight">
            <EditableField
              ariaLabel="Groups heading"
              className="sd-heading"
              deleteLabel="Delete groups heading"
              multiline
              onChange={(value) => onTextChange("groupsHeading", value)}
              onDelete={() => onTextDelete("groupsHeading")}
              value={content.groupsHeading}
            />
            <EditableField
              ariaLabel="Groups intro"
              className="sd-intro"
              deleteLabel="Delete groups intro"
              multiline
              onChange={(value) => onTextChange("groupsIntro", value)}
              onDelete={() => onTextDelete("groupsIntro")}
              value={content.groupsIntro}
            />
          </div>

          <div className="sd-group-grid">
            {content.scholarGroups.map((item, index) => {
              const isDeleted =
                item.name.trim().length === 0 && item.detail.trim().length === 0;

              if (isDeleted) {
                return (
                  <div
                    className={`sd-group-card sd-group-card-${item.icon} flyer-edit-placeholder-card`}
                    key={`group-${index}`}
                  >
                    <button
                      className="flyer-edit-add"
                      onClick={() => onGroupRestore(index)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                );
              }

              return (
                <div
                  className={`sd-group-card sd-group-card-${item.icon} flyer-edit-card`}
                  key={`group-${index}`}
                >
                  <button
                    className="flyer-edit-delete"
                    onClick={() => onGroupDelete(index)}
                    type="button"
                  >
                    Delete
                  </button>
                  <span className="sd-group-icon">
                    <ScholarGroupIcon icon={item.icon} />
                  </span>
                  <EditableField
                    ariaLabel={`Scholar group ${index + 1} name`}
                    className="sd-group-name"
                    deleteLabel={`Delete scholar group ${index + 1} name`}
                    onChange={(value) => onGroupChange(index, "name", value)}
                    onDelete={() => onGroupChange(index, "name", "")}
                    value={item.name}
                  />
                  <EditableField
                    ariaLabel={`Scholar group ${index + 1} dashboard label`}
                    className="sd-group-label"
                    deleteLabel={`Delete scholar group ${index + 1} dashboard label`}
                    onChange={(value) => onGroupChange(index, "dashboardLabel", value)}
                    onDelete={() => onGroupChange(index, "dashboardLabel", "")}
                    value={item.dashboardLabel}
                  />
                  <EditableField
                    ariaLabel={`Scholar group ${index + 1} description`}
                    className="sd-group-body"
                    deleteLabel={`Delete scholar group ${index + 1} description`}
                    multiline
                    onChange={(value) => onGroupChange(index, "detail", value)}
                    onDelete={() => onGroupChange(index, "detail", "")}
                    value={item.detail}
                  />
                  <div className="sd-group-criteria">
                    <EditableField
                      ariaLabel={`Scholar group ${index + 1} criteria label`}
                      className="sd-group-criteria-label"
                      deleteLabel={`Delete scholar group ${index + 1} criteria label`}
                      onChange={(value) => onGroupChange(index, "criteriaLabel", value)}
                      onDelete={() => onGroupChange(index, "criteriaLabel", "")}
                      value={item.criteriaLabel}
                    />
                    <EditableField
                      ariaLabel={`Scholar group ${index + 1} criteria`}
                      className="sd-group-criteria-text"
                      deleteLabel={`Delete scholar group ${index + 1} criteria`}
                      multiline
                      onChange={(value) => onGroupChange(index, "criteria", value)}
                      onDelete={() => onGroupChange(index, "criteria", "")}
                      value={item.criteria}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="sd-hierarchy">
          {content.hierarchyTiers.map((item, index) => {
            const isDeleted =
              item.title.trim().length === 0 && item.detail.trim().length === 0;
            const tierStyle = { width: `${100 - index * 6}%` };

            if (isDeleted) {
              return (
                <div
                  className="sd-tier flyer-edit-placeholder-card"
                  key={`tier-${index}`}
                  style={tierStyle}
                >
                  <button
                    className="flyer-edit-add"
                    onClick={() => onTierRestore(index)}
                    type="button"
                  >
                    +
                  </button>
                </div>
              );
            }

            return (
              <div className="sd-tier flyer-edit-card" key={`tier-${index}`} style={tierStyle}>
                <button
                  className="flyer-edit-delete"
                  onClick={() => onTierDelete(index)}
                  type="button"
                >
                  Delete
                </button>
                <span className="sd-tier-badge">{item.tier || `Level ${index + 1}`}</span>
                <div className="sd-tier-copy">
                  <EditableField
                    ariaLabel={`Hierarchy level ${index + 1} title`}
                    className="sd-tier-title"
                    deleteLabel={`Delete hierarchy level ${index + 1} title`}
                    onChange={(value) => onTierChange(index, "title", value)}
                    onDelete={() => onTierChange(index, "title", "")}
                    value={item.title}
                  />
                  <EditableField
                    ariaLabel={`Hierarchy level ${index + 1} detail`}
                    className="sd-tier-detail"
                    deleteLabel={`Delete hierarchy level ${index + 1} detail`}
                    multiline
                    onChange={(value) => onTierChange(index, "detail", value)}
                    onDelete={() => onTierChange(index, "detail", "")}
                    value={item.detail}
                  />
                </div>
              </div>
            );
          })}
        </section>

        {classificationDeleted ? (
          <section className="sd-classification flyer-edit-placeholder-card">
            <button className="flyer-edit-add" onClick={restoreClassification} type="button">
              +
            </button>
          </section>
        ) : (
          <section className="sd-classification flyer-edit-card">
            <button className="flyer-edit-delete" onClick={deleteClassification} type="button">
              Delete
            </button>
            <span className="sd-classification-flag">Draft</span>
            <div className="sd-classification-copy">
              <EditableField
                ariaLabel="Classification heading"
                className="sd-classification-title"
                deleteLabel="Delete classification heading"
                multiline
                onChange={(value) => onTextChange("classificationHeading", value)}
                onDelete={() => onTextDelete("classificationHeading")}
                value={content.classificationHeading}
              />
              <EditableField
                ariaLabel="Classification note"
                className="sd-classification-body"
                deleteLabel="Delete classification note"
                multiline
                onChange={(value) => onTextChange("classificationNote", value)}
                onDelete={() => onTextDelete("classificationNote")}
                value={content.classificationNote}
              />
            </div>
          </section>
        )}

        <section className="sd-safeguards">
          <div className="sd-section-head sd-section-head-tight">
            <EditableField
              ariaLabel="Safeguards heading"
              className="sd-heading"
              deleteLabel="Delete safeguards heading"
              multiline
              onChange={(value) => onTextChange("safeguardsHeading", value)}
              onDelete={() => onTextDelete("safeguardsHeading")}
              value={content.safeguardsHeading}
            />
          </div>

          <ol className="sd-safeguard-list">
            {content.safeguards.map((item, index) => (
              <li className="flyer-edit-list-item" key={`safeguard-${index}`}>
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
                {item.trim().length === 0 ? (
                  <button
                    className="flyer-edit-add"
                    onClick={() => onSafeguardRestore(index)}
                    type="button"
                  >
                    +
                  </button>
                ) : (
                  <EditableField
                    ariaLabel={`Safeguard ${index + 1}`}
                    className="sd-safeguard-text"
                    deleteLabel={`Delete safeguard ${index + 1}`}
                    multiline
                    onChange={(value) => onSafeguardChange(index, value)}
                    onDelete={() => onSafeguardDelete(index)}
                    value={item}
                  />
                )}
              </li>
            ))}
          </ol>
        </section>

        <footer className="flyer-footer flyer-footer-back">{renderFooter()}</footer>

        <div className="flyer-flag-bar flyer-flag-bar-bottom" aria-hidden="true" />
      </section>
    </article>
  );
}
