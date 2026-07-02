"use client";

import { useEffect, useRef, useState } from "react";
import type {
  FlyerContent,
  FlyerFeatureRow,
  FlyerPair,
  FlyerTextField,
} from "../content/flyerContent";
import "../flyer/flyer-document.css";

type FlyerEditableDocumentProps = {
  content: FlyerContent;
  onTextChange: (field: FlyerTextField, value: string) => void;
  onTextDelete: (field: FlyerTextField) => void;
  onPairChange: (
    field: "valuePillars" | "valueSummary",
    index: number,
    key: keyof FlyerPair,
    value: string,
  ) => void;
  onPairDelete: (field: "valuePillars" | "valueSummary", index: number) => void;
  onPairRestore: (field: "valuePillars" | "valueSummary", index: number) => void;
  onFeatureRowChange: (
    index: number,
    key: keyof FlyerFeatureRow,
    value: string,
  ) => void;
  onFeatureRowDelete: (index: number) => void;
  onFeatureRowRestore: (index: number) => void;
  onListChange: (index: number, value: string) => void;
  onListDelete: (index: number) => void;
  onListRestore: (index: number) => void;
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

type AutoSizeTextareaProps = {
  ariaLabel: string;
  className: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

function AutoSizeTextarea({
  ariaLabel,
  className,
  onChange,
  placeholder,
  value,
}: AutoSizeTextareaProps) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    element.style.height = "0px";
    element.style.height = `${element.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      aria-label={ariaLabel}
      className={className}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={1}
      value={value}
    />
  );
}

type EditableFieldProps = {
  ariaLabel: string;
  className: string;
  deleteLabel: string;
  emptyLabel?: string;
  multiline?: boolean;
  onChange: (value: string) => void;
  onDelete: () => void;
  placeholder?: string;
  value: string;
};

function EditableField({
  ariaLabel,
  className,
  deleteLabel,
  emptyLabel,
  multiline = false,
  onChange,
  onDelete,
  placeholder,
  value,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(value);

  useEffect(() => {
    if (!isEditing) {
      setDraftValue(value);
    }
  }, [isEditing, value]);

  const startEditing = () => {
    setDraftValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    onChange(draftValue);
    setIsEditing(false);
  };

  const isEmpty = value.trim().length === 0;

  if (!isEditing && isEmpty) {
    return (
      <button
        aria-label={emptyLabel || `Add ${ariaLabel}`}
        className="flyer-edit-add"
        onClick={startEditing}
        type="button"
      >
        +
      </button>
    );
  }

  if (!isEditing) {
    return (
      <div className="flyer-edit-block">
        <button
          aria-label={`${ariaLabel}. Click to edit.`}
          className={`flyer-edit-display ${className}`}
          onClick={startEditing}
          type="button"
        >
          {value}
        </button>
      </div>
    );
  }

  return (
    <div className="flyer-edit-block flyer-edit-block-active">
      {multiline ? (
        <AutoSizeTextarea
          ariaLabel={ariaLabel}
          className={`flyer-edit-field flyer-edit-textarea ${className}`}
          onChange={setDraftValue}
          placeholder={placeholder}
          value={draftValue}
        />
      ) : (
        <input
          aria-label={ariaLabel}
          className={`flyer-edit-field ${className}`}
          onChange={(event) => setDraftValue(event.target.value)}
          placeholder={placeholder}
          value={draftValue}
        />
      )}
      <div className="flyer-edit-inline-actions">
        <button
          aria-label={`Save ${ariaLabel}`}
          className="flyer-edit-icon flyer-edit-save"
          onClick={handleSave}
          type="button"
        >
          ✓
        </button>
        <button
          aria-label={deleteLabel}
          className="flyer-edit-icon flyer-edit-trash"
          onClick={() => {
            onDelete();
            setIsEditing(false);
          }}
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function EditablePairCard({
  detail,
  detailLabel,
  label,
  labelLabel,
  onRestore,
  onDelete,
  onDetailChange,
  onLabelChange,
}: {
  detail: string;
  detailLabel: string;
  label: string;
  labelLabel: string;
  onRestore: () => void;
  onDelete: () => void;
  onDetailChange: (value: string) => void;
  onLabelChange: (value: string) => void;
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

export function FlyerEditableDocument({
  content,
  onFeatureRowChange,
  onFeatureRowDelete,
  onFeatureRowRestore,
  onListChange,
  onListDelete,
  onListRestore,
  onPairChange,
  onPairDelete,
  onPairRestore,
  onTextChange,
  onTextDelete,
}: FlyerEditableDocumentProps) {
  const heroCardDeleted =
    content.heroCardTitle.trim().length === 0 &&
    content.valuePillars.every(
      (item) => item.label.trim().length === 0 && item.detail.trim().length === 0,
    );
  const scopeBandDeleted =
    content.scopeHeading.trim().length === 0 && content.scopeNote.trim().length === 0;
  const summaryCardDeleted =
    content.summaryHeading.trim().length === 0 &&
    content.featurePersonalization.trim().length === 0 &&
    content.featureGoal.trim().length === 0;
  const collaborationCardDeleted =
    content.collaborationHeading.trim().length === 0 &&
    content.collaborationBody.trim().length === 0;
  const backNoteCardDeleted =
    content.backNoteHeading.trim().length === 0 &&
    content.featurePersonalization.trim().length === 0;
  const footerIdeatorDeleted =
    content.ideatorLabel.trim().length === 0 && content.ideator.trim().length === 0;
  const footerContactDeleted = content.contactLine.trim().length === 0;

  const deleteHeroCard = () => {
    onTextDelete("heroCardTitle");
    content.valuePillars.forEach((_, index) => onPairDelete("valuePillars", index));
  };

  const restoreHeroCard = () => {
    onTextChange("heroCardTitle", "Platform snapshot");
    content.valuePillars.forEach((item, index) => {
      if (item.label.trim().length === 0 && item.detail.trim().length === 0) {
        onPairRestore("valuePillars", index);
      }
    });
  };

  const deleteScopeBand = () => {
    onTextDelete("scopeHeading");
    onTextDelete("scopeNote");
  };

  const restoreScopeBand = () => {
    onTextChange("scopeHeading", "Initial scope");
    onTextChange("scopeNote", "Add scope copy.");
  };

  const deleteSummaryCard = () => {
    onTextDelete("summaryHeading");
    onTextDelete("featurePersonalization");
    onTextDelete("featureGoal");
  };

  const restoreSummaryCard = () => {
    onTextChange("summaryHeading", "Why it matters");
    onTextChange("featurePersonalization", "Add personalization copy.");
    onTextChange("featureGoal", "Add goal copy.");
  };

  const deleteCollaborationCard = () => {
    onTextDelete("collaborationHeading");
    onTextDelete("collaborationBody");
  };

  const restoreCollaborationCard = () => {
    onTextChange("collaborationHeading", "Next step");
    onTextChange("collaborationBody", "Add collaboration copy.");
  };

  const deleteBackNoteCard = () => {
    onTextDelete("backNoteHeading");
    onTextDelete("featurePersonalization");
  };

  const restoreBackNoteCard = () => {
    onTextChange("backNoteHeading", "Flyer note");
    onTextChange("featurePersonalization", "Add note copy.");
  };

  const deleteFooterIdeator = () => {
    onTextDelete("ideatorLabel");
    onTextDelete("ideator");
  };

  const restoreFooterIdeator = () => {
    onTextChange("ideatorLabel", "Ideated by");
    onTextChange("ideator", "Add name");
  };

  const restoreFooterContact = () => {
    onTextChange("contactLine", "Add contact line.");
  };

  return (
    <article
      className="flyer-document flyer-document-editor"
      aria-label="Editable Project Arch overview flyer"
    >
      <section
        className="flyer-sheet flyer-sheet-front"
        data-page-label="Page 1"
        aria-label="Editable front flyer page"
      >
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
                ariaLabel="Project name"
                className="flyer-heading-main"
                deleteLabel="Delete project name"
                onChange={(value) => onTextChange("companyName", value)}
                onDelete={() => onTextDelete("companyName")}
                value={content.companyName}
              />
              <EditableField
                ariaLabel="Tagline"
                className="flyer-tagline"
                deleteLabel="Delete tagline"
                onChange={(value) => onTextChange("companyTagline", value)}
                onDelete={() => onTextDelete("companyTagline")}
                value={content.companyTagline}
              />
              <div className="flyer-title-rule" aria-hidden="true" />
              <EditableField
                ariaLabel="One-liner"
                className="flyer-oneliner"
                deleteLabel="Delete one-liner"
                multiline
                onChange={(value) => onTextChange("conceptOneLiner", value)}
                onDelete={() => onTextDelete("conceptOneLiner")}
                value={content.conceptOneLiner}
              />
              <EditableField
                ariaLabel="Mission note"
                className="flyer-mission"
                deleteLabel="Delete mission note"
                multiline
                onChange={(value) => onTextChange("companyMission", value)}
                onDelete={() => onTextDelete("companyMission")}
                value={content.companyMission}
              />
            </div>

            <aside className="flyer-hero-card flyer-edit-card" aria-label="Editable summary">
              {heroCardDeleted ? (
                <div className="flyer-edit-placeholder-card">
                  <button className="flyer-edit-add" onClick={restoreHeroCard} type="button">
                    +
                  </button>
                </div>
              ) : (
                <>
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
                  <div className="flyer-stats" aria-label="Editable platform highlights">
                    {content.valuePillars.map((item, index) => (
                      <EditablePairCard
                        detail={item.detail}
                        detailLabel={`Value pillar ${index + 1} detail`}
                        key={`value-pillar-${index + 1}`}
                        label={item.label}
                        labelLabel={`Value pillar ${index + 1} label`}
                        onDelete={() => onPairDelete("valuePillars", index)}
                        onRestore={() => onPairRestore("valuePillars", index)}
                        onDetailChange={(value) =>
                          onPairChange("valuePillars", index, "detail", value)
                        }
                        onLabelChange={(value) =>
                          onPairChange("valuePillars", index, "label", value)
                        }
                      />
                    ))}
                  </div>
                </>
              )}
            </aside>
          </div>
        </header>

        <section className="flyer-band flyer-band-blue flyer-edit-card">
          {scopeBandDeleted ? (
            <div className="flyer-edit-placeholder-card flyer-edit-placeholder-band">
              <button className="flyer-edit-add" onClick={restoreScopeBand} type="button">
                +
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </section>

        <section className="flyer-front-story" aria-label="Editable front flyer feature story">
          {content.frontFeatureRows.map((item, index) => {
            const isDeleted = item.title.trim().length === 0 && item.detail.trim().length === 0;

            return (
              <div
                className={`flyer-story-row${index % 2 === 1 ? " flyer-story-row-reverse" : ""}`}
                key={`front-row-${index + 1}`}
              >
                <div className="flyer-story-copy flyer-edit-card">
                  {isDeleted ? (
                    <button
                      className="flyer-edit-add"
                      onClick={() => onFeatureRowRestore(index)}
                      type="button"
                    >
                      +
                    </button>
                  ) : (
                    <>
                      <button
                        className="flyer-edit-delete"
                        onClick={() => onFeatureRowDelete(index)}
                        type="button"
                      >
                        Delete
                      </button>
                      <span className="flyer-story-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <EditableField
                        ariaLabel={`Front feature ${index + 1} title`}
                        className="flyer-story-title"
                        deleteLabel={`Delete front feature ${index + 1} title`}
                        onChange={(value) => onFeatureRowChange(index, "title", value)}
                        onDelete={() => onFeatureRowChange(index, "title", "")}
                        value={item.title}
                      />
                      <EditableField
                        ariaLabel={`Front feature ${index + 1} detail`}
                        className="flyer-story-detail"
                        deleteLabel={`Delete front feature ${index + 1} detail`}
                        multiline
                        onChange={(value) => onFeatureRowChange(index, "detail", value)}
                        onDelete={() => onFeatureRowChange(index, "detail", "")}
                        value={item.detail}
                      />
                    </>
                  )}
                </div>
                <div className="flyer-story-icon" aria-hidden="true">
                  <FlyerFeatureIcon icon={item.icon} />
                </div>
              </div>
            );
          })}
        </section>

        <section className="flyer-front-summary" aria-label="Editable front-page summary">
          <div className="flyer-highlights flyer-highlights-card flyer-edit-card">
            {summaryCardDeleted ? (
              <div className="flyer-edit-placeholder-card">
                <button className="flyer-edit-add" onClick={restoreSummaryCard} type="button">
                  +
                </button>
              </div>
            ) : (
              <>
                <button className="flyer-edit-delete" onClick={deleteSummaryCard} type="button">
                  Delete
                </button>
                <EditableField
                  ariaLabel="Summary heading"
                  className="flyer-panel-kicker"
                  deleteLabel="Delete summary heading"
                  onChange={(value) => onTextChange("summaryHeading", value)}
                  onDelete={() => onTextDelete("summaryHeading")}
                  value={content.summaryHeading}
                />
                <EditableField
                  ariaLabel="Personalization copy"
                  className="flyer-callout"
                  deleteLabel="Delete personalization copy"
                  multiline
                  onChange={(value) => onTextChange("featurePersonalization", value)}
                  onDelete={() => onTextDelete("featurePersonalization")}
                  value={content.featurePersonalization}
                />
                <EditableField
                  ariaLabel="Goal copy"
                  className="flyer-goal"
                  deleteLabel="Delete goal copy"
                  multiline
                  onChange={(value) => onTextChange("featureGoal", value)}
                  onDelete={() => onTextDelete("featureGoal")}
                  value={content.featureGoal}
                />
              </>
            )}
          </div>

          <div className="flyer-value-strip" aria-label="Editable value summary">
            {content.valueSummary.map((item, index) => (
              <EditablePairCard
                detail={item.detail}
                detailLabel={`Audience ${index + 1} detail`}
                key={`audience-${index + 1}`}
                label={item.label}
                labelLabel={`Audience ${index + 1} label`}
                onDelete={() => onPairDelete("valueSummary", index)}
                onRestore={() => onPairRestore("valueSummary", index)}
                onDetailChange={(value) => onPairChange("valueSummary", index, "detail", value)}
                onLabelChange={(value) => onPairChange("valueSummary", index, "label", value)}
              />
            ))}
          </div>
        </section>

        <footer className="flyer-footer">
          <div className="flyer-footer-grid">
            <div className="flyer-footer-copy">
              <div className="flyer-footer-block flyer-edit-card">
                {footerIdeatorDeleted ? (
                  <div className="flyer-edit-placeholder-card">
                    <button className="flyer-edit-add" onClick={restoreFooterIdeator} type="button">
                      +
                    </button>
                  </div>
                ) : (
                  <>
                    <button className="flyer-edit-delete" onClick={deleteFooterIdeator} type="button">
                      Delete
                    </button>
                    <EditableField
                      ariaLabel="Ideator label"
                      className="flyer-footer-label"
                      deleteLabel="Delete ideator label"
                      onChange={(value) => onTextChange("ideatorLabel", value)}
                      onDelete={() => onTextDelete("ideatorLabel")}
                      value={content.ideatorLabel}
                    />
                    <EditableField
                      ariaLabel="Ideator name"
                      className="flyer-footer-strong"
                      deleteLabel="Delete ideator name"
                      onChange={(value) => onTextChange("ideator", value)}
                      onDelete={() => onTextDelete("ideator")}
                      value={content.ideator}
                    />
                  </>
                )}
              </div>
              <div className="flyer-footer-block flyer-footer-contact flyer-edit-card">
                {footerContactDeleted ? (
                  <div className="flyer-edit-placeholder-card">
                    <button className="flyer-edit-add" onClick={restoreFooterContact} type="button">
                      +
                    </button>
                  </div>
                ) : (
                  <>
                    <button className="flyer-edit-delete" onClick={() => onTextDelete("contactLine")} type="button">
                      Delete
                    </button>
                    <EditableField
                      ariaLabel="Contact line"
                      className="flyer-footer-contact-line"
                      deleteLabel="Delete contact line"
                      multiline
                      onChange={(value) => onTextChange("contactLine", value)}
                      onDelete={() => onTextDelete("contactLine")}
                      value={content.contactLine}
                    />
                  </>
                )}
              </div>
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
        </footer>

        <div className="flyer-flag-bar flyer-flag-bar-bottom" aria-hidden="true" />
      </section>

      <section
        className="flyer-sheet flyer-sheet-back"
        data-page-label="Page 2"
        aria-label="Editable back flyer page"
      >
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
            ariaLabel="Features heading"
            className="flyer-back-heading"
            deleteLabel="Delete features heading"
            onChange={(value) => onTextChange("featuresHeading", value)}
            onDelete={() => onTextDelete("featuresHeading")}
            value={content.featuresHeading}
          />
          <EditableField
            ariaLabel="Features intro"
            className="flyer-mission"
            deleteLabel="Delete features intro"
            multiline
            onChange={(value) => onTextChange("featuresIntro", value)}
            onDelete={() => onTextDelete("featuresIntro")}
            value={content.featuresIntro}
          />
        </header>

        <section className="flyer-body">
          <div className="flyer-features-panel">
            <ol className="flyer-features">
              {content.platformFeatures.map((feature, index) => (
                <li className="flyer-edit-card flyer-edit-list-item" key={`feature-${index + 1}`}>
                  {feature.trim().length === 0 ? (
                    <button
                      className="flyer-edit-add"
                      onClick={() => onListRestore(index)}
                      type="button"
                    >
                      +
                    </button>
                  ) : (
                    <>
                      <button
                        className="flyer-edit-delete"
                        onClick={() => onListDelete(index)}
                        type="button"
                      >
                        Delete
                      </button>
                      <span className="flyer-feature-index">{index + 1}</span>
                      <EditableField
                        ariaLabel={`Platform feature ${index + 1}`}
                        className="flyer-feature-copy"
                        deleteLabel={`Delete platform feature ${index + 1}`}
                        multiline
                        onChange={(value) => onListChange(index, value)}
                        onDelete={() => onListChange(index, "")}
                        value={feature}
                      />
                    </>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="flyer-back-grid">
          <div className="flyer-back-card flyer-back-card-red flyer-edit-card">
            {collaborationCardDeleted ? (
              <div className="flyer-edit-placeholder-card">
                <button className="flyer-edit-add" onClick={restoreCollaborationCard} type="button">
                  +
                </button>
              </div>
            ) : (
              <>
                <button className="flyer-edit-delete" onClick={deleteCollaborationCard} type="button">
                  Delete
                </button>
                <EditableField
                  ariaLabel="Collaboration heading"
                  className="flyer-card-title"
                  deleteLabel="Delete collaboration heading"
                  onChange={(value) => onTextChange("collaborationHeading", value)}
                  onDelete={() => onTextDelete("collaborationHeading")}
                  value={content.collaborationHeading}
                />
                <EditableField
                  ariaLabel="Collaboration body"
                  className="flyer-card-copy"
                  deleteLabel="Delete collaboration body"
                  multiline
                  onChange={(value) => onTextChange("collaborationBody", value)}
                  onDelete={() => onTextDelete("collaborationBody")}
                  value={content.collaborationBody}
                />
              </>
            )}
          </div>

          <div className="flyer-back-card flyer-back-card-blue flyer-edit-card">
            {backNoteCardDeleted ? (
              <div className="flyer-edit-placeholder-card">
                <button className="flyer-edit-add" onClick={restoreBackNoteCard} type="button">
                  +
                </button>
              </div>
            ) : (
              <>
                <button className="flyer-edit-delete" onClick={deleteBackNoteCard} type="button">
                  Delete
                </button>
                <EditableField
                  ariaLabel="Back note heading"
                  className="flyer-card-title"
                  deleteLabel="Delete back note heading"
                  onChange={(value) => onTextChange("backNoteHeading", value)}
                  onDelete={() => onTextDelete("backNoteHeading")}
                  value={content.backNoteHeading}
                />
                <EditableField
                  ariaLabel="Back note copy"
                  className="flyer-card-copy"
                  deleteLabel="Delete back note copy"
                  multiline
                  onChange={(value) => onTextChange("featurePersonalization", value)}
                  onDelete={() => onTextDelete("featurePersonalization")}
                  value={content.featurePersonalization}
                />
              </>
            )}
          </div>
        </section>

        <footer className="flyer-footer flyer-footer-back">
          <div className="flyer-footer-grid">
            <div className="flyer-footer-copy">
              <div className="flyer-footer-block flyer-edit-card">
                {footerIdeatorDeleted ? (
                  <div className="flyer-edit-placeholder-card">
                    <button className="flyer-edit-add" onClick={restoreFooterIdeator} type="button">
                      +
                    </button>
                  </div>
                ) : (
                  <>
                    <button className="flyer-edit-delete" onClick={deleteFooterIdeator} type="button">
                      Delete
                    </button>
                    <EditableField
                      ariaLabel="Back ideator label"
                      className="flyer-footer-label"
                      deleteLabel="Delete back ideator label"
                      onChange={(value) => onTextChange("ideatorLabel", value)}
                      onDelete={() => onTextDelete("ideatorLabel")}
                      value={content.ideatorLabel}
                    />
                    <EditableField
                      ariaLabel="Back ideator name"
                      className="flyer-footer-strong"
                      deleteLabel="Delete back ideator name"
                      onChange={(value) => onTextChange("ideator", value)}
                      onDelete={() => onTextDelete("ideator")}
                      value={content.ideator}
                    />
                  </>
                )}
              </div>
              <div className="flyer-footer-block flyer-footer-contact flyer-edit-card">
                {footerContactDeleted ? (
                  <div className="flyer-edit-placeholder-card">
                    <button className="flyer-edit-add" onClick={restoreFooterContact} type="button">
                      +
                    </button>
                  </div>
                ) : (
                  <>
                    <button className="flyer-edit-delete" onClick={() => onTextDelete("contactLine")} type="button">
                      Delete
                    </button>
                    <EditableField
                      ariaLabel="Back contact line"
                      className="flyer-footer-contact-line"
                      deleteLabel="Delete back contact line"
                      multiline
                      onChange={(value) => onTextChange("contactLine", value)}
                      onDelete={() => onTextDelete("contactLine")}
                      value={content.contactLine}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          <EditableField
            ariaLabel="Back footer note"
            className="flyer-footer-note"
            deleteLabel="Delete back footer note"
            multiline
            onChange={(value) => onTextChange("footerNote", value)}
            onDelete={() => onTextDelete("footerNote")}
            value={content.footerNote}
          />
        </footer>

        <div className="flyer-flag-bar flyer-flag-bar-bottom" aria-hidden="true" />
      </section>
    </article>
  );
}
