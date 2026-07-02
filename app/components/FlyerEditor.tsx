"use client";

import { useEffect, useRef, useState } from "react";
import {
  fetchFlyerVersions,
  publishFlyerContent,
  type FlyerVersionSummary,
} from "./flyerApi";
import { FlyerEditableDocument } from "./FlyerEditableDocument";
import { flyerEditorLoginPath } from "../lib/flyerAuth";
import {
  createDefaultFlyerContent,
  type FlyerFeatureRow,
  type FlyerPair,
  type FlyerTextField,
} from "../content/flyerContent";
import { useFlyerContent, writeStoredFlyerContent } from "./useFlyerContent";

function formatVersionTimestamp(value: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

const CSS_PX_PER_MM = 96 / 25.4;
const FLYER_PAGE_WIDTH_PX = 210 * CSS_PX_PER_MM;
const FLYER_PAGE_HEIGHT_PX = 297 * CSS_PX_PER_MM;
const FLYER_SPREAD_GAP_PX = 24;

type FlyerCanvasView = "page1" | "page2" | "spread";

export function FlyerEditor() {
  const { content, isReady, latestVersion, setContent, setLatestVersion, syncError } =
    useFlyerContent({ persist: true });
  const previewShellRef = useRef<HTMLDivElement | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [canvasView, setCanvasView] = useState<FlyerCanvasView>("spread");
  const [fitScale, setFitScale] = useState(1);
  const [versionList, setVersionList] = useState<FlyerVersionSummary[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(true);
  const [versionsError, setVersionsError] = useState<string | null>(null);
  const [latestSavedVersion, setLatestSavedVersion] = useState<FlyerVersionSummary | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);

  const updateTextField = (field: FlyerTextField, value: string) => {
    setContent((current) => ({ ...current, [field]: value }));
  };

  const deleteTextField = (field: FlyerTextField) => {
    setContent((current) => ({ ...current, [field]: "" }));
  };

  const updatePairField = (
    field: "valuePillars" | "valueSummary",
    index: number,
    key: keyof FlyerPair,
    value: string,
  ) => {
    setContent((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const deletePairField = (field: "valuePillars" | "valueSummary", index: number) => {
    setContent((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? { ...item, label: "", detail: "" } : item,
      ),
    }));
  };

  const restorePairField = (field: "valuePillars" | "valueSummary", index: number) => {
    setContent((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? { ...item, label: "New label", detail: "New detail" } : item,
      ),
    }));
  };

  const updateListField = (index: number, value: string) => {
    setContent((current) => ({
      ...current,
      platformFeatures: current.platformFeatures.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  };

  const deleteListField = (index: number) => {
    setContent((current) => ({
      ...current,
      platformFeatures: current.platformFeatures.map((item, itemIndex) =>
        itemIndex === index ? "" : item,
      ),
    }));
  };

  const restoreListField = (index: number) => {
    setContent((current) => ({
      ...current,
      platformFeatures: current.platformFeatures.map((item, itemIndex) =>
        itemIndex === index ? "New platform feature" : item,
      ),
    }));
  };

  const updateFeatureRowField = (
    index: number,
    key: keyof FlyerFeatureRow,
    value: string,
  ) => {
    setContent((current) => ({
      ...current,
      frontFeatureRows: current.frontFeatureRows.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const deleteFeatureRowField = (index: number) => {
    setContent((current) => ({
      ...current,
      frontFeatureRows: current.frontFeatureRows.map((item, itemIndex) =>
        itemIndex === index ? { ...item, title: "", detail: "" } : item,
      ),
    }));
  };

  const restoreFeatureRowField = (index: number) => {
    setContent((current) => ({
      ...current,
      frontFeatureRows: current.frontFeatureRows.map((item, itemIndex) =>
        itemIndex === index ? { ...item, title: "New title", detail: "New detail" } : item,
      ),
    }));
  };

  const resetContent = () => {
    setContent(createDefaultFlyerContent());
  };

  useEffect(() => {
    let cancelled = false;

    const loadVersions = async () => {
      setIsLoadingVersions(true);

      try {
        const versions = await fetchFlyerVersions();
        if (cancelled) {
          return;
        }

        setVersionList(versions);
        setLatestSavedVersion((current) => current ?? versions[0] ?? null);
        setVersionsError(null);
      } catch (error) {
        if (!cancelled) {
          setVersionsError(
            error instanceof Error ? error.message : "Unable to load flyer versions.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingVersions(false);
        }
      }
    };

    void loadVersions();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      await fetch("/api/auth/flyer/logout", {
        method: "POST",
      });
    } finally {
      window.location.assign(flyerEditorLoginPath);
    }
  };

  const handlePublish = async () => {
    if (isPublishing || !isReady) {
      return;
    }

    setIsPublishing(true);
    setPublishError(null);
    setPublishMessage(null);

    try {
      writeStoredFlyerContent(content);
      setPublishMessage("Generating PDF in your browser...");
      const publishedVersion = await publishFlyerContent(content);
      setContent(publishedVersion.content);
      setLatestVersion(publishedVersion.version);
      setLatestSavedVersion(publishedVersion);
      setVersionList((current) => {
        const next = [
          publishedVersion,
          ...current.filter((item) => item.version !== publishedVersion.version),
        ];
        return next.sort((left, right) => right.version - left.version);
      });
      writeStoredFlyerContent(publishedVersion.content);
      setPublishMessage(`Saved and published version v${publishedVersion.version}.`);
    } catch (error) {
      setPublishError(
        error instanceof Error ? error.message : "Unable to publish flyer changes.",
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const canvasBaseWidth =
    canvasView === "spread"
      ? FLYER_PAGE_WIDTH_PX * 2 + FLYER_SPREAD_GAP_PX
      : FLYER_PAGE_WIDTH_PX;

  useEffect(() => {
    const shell = previewShellRef.current;
    if (!shell) {
      return;
    }

    const updateFitScale = () => {
      const styles = window.getComputedStyle(shell);
      const horizontalPadding =
        Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight);
      const availableWidth = Math.max(shell.clientWidth - horizontalPadding, 1);
      const nextScale = Math.min(1, availableWidth / canvasBaseWidth);
      setFitScale(nextScale);
    };

    updateFitScale();

    const observer = new ResizeObserver(updateFitScale);
    observer.observe(shell);
    window.addEventListener("resize", updateFitScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateFitScale);
    };
  }, [canvasBaseWidth]);

  const previewFrameStyle = {
    width: `${canvasBaseWidth * fitScale}px`,
    height: `${FLYER_PAGE_HEIGHT_PX * fitScale}px`,
  };
  const previewStageStyle = {
    width: `${canvasBaseWidth}px`,
    transform: `scale(${fitScale})`,
  };

  return (
    <div className="flyer-editor-shell">
      <nav className="flyer-editor-nav" aria-label="Flyer editor controls">
        <div className="flyer-editor-nav-brand">
          <h1>Flyer Editor</h1>
        </div>

        <div className="flyer-editor-nav-status">
          {latestVersion ? (
            <span className="flyer-editor-chip">{`Live v${latestVersion}`}</span>
          ) : null}
          {latestSavedVersion?.createdAt ? (
            <span className="flyer-editor-chip">
              {`Saved ${formatVersionTimestamp(latestSavedVersion.createdAt)}`}
            </span>
          ) : null}
          {publishMessage ? <span className="flyer-editor-chip">{publishMessage}</span> : null}
        </div>

        <div className="flyer-editor-nav-actions">
          <div className="flyer-editor-actions">
            <button
              className="button button-primary button-sm"
              type="button"
              onClick={handlePublish}
              disabled={isPublishing || !isReady}
            >
              {isPublishing ? "Publishing..." : isReady ? "Publish" : "Loading..."}
            </button>
            <a
              className="button button-secondary button-sm"
              href={latestSavedVersion?.versionPdfUrl || latestSavedVersion?.latestPdfUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!latestSavedVersion}
            >
              Download Saved PDF
            </a>
            <button
              className="button button-secondary button-sm"
              type="button"
              onClick={resetContent}
            >
              Reset Text
            </button>
          </div>
          <div className="flyer-editor-nav-menu">
            <button
              className="button button-secondary button-sm"
              type="button"
              onClick={() => setIsVersionsOpen((current) => !current)}
              aria-expanded={isVersionsOpen}
            >
              Versions
            </button>
            {isVersionsOpen ? (
              <div className="flyer-editor-versions-popover">
                <div className="flyer-editor-versions-head">
                  <strong>Published PDFs</strong>
                  <button
                    className="button button-secondary button-sm"
                    type="button"
                    onClick={() => setIsVersionsOpen(false)}
                  >
                    Close
                  </button>
                </div>
                {isLoadingVersions ? (
                  <p className="flyer-editor-history-empty">Loading saved versions...</p>
                ) : versionList.length === 0 ? (
                  <p className="flyer-editor-history-empty">No saved versions yet.</p>
                ) : (
                  <div className="flyer-editor-history">
                    {versionList.map((item) => (
                      <div className="flyer-editor-history-item" key={`version-${item.version}`}>
                        <div>
                          <strong>{`v${item.version}`}</strong>
                          <span>{formatVersionTimestamp(item.createdAt)}</span>
                        </div>
                        <a
                          className="button button-secondary button-sm"
                          href={item.versionPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
          <button
            className="button button-secondary button-sm"
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </nav>

      {syncError ? <p className="flyer-editor-error">{syncError}</p> : null}
      {versionsError ? <p className="flyer-editor-error">{versionsError}</p> : null}
      {publishError ? <p className="flyer-editor-error">{publishError}</p> : null}

      <section className="flyer-editor-workspace" aria-label="Flyer editing workspace">
        <div className="flyer-editor-workspace-tools">
          <div className="flyer-editor-tool-group" role="tablist" aria-label="Flyer page view">
            <button
              aria-selected={canvasView === "page1"}
              className={`flyer-editor-tool${
                canvasView === "page1" ? " flyer-editor-tool-active" : ""
              }`}
              onClick={() => setCanvasView("page1")}
              role="tab"
              type="button"
            >
              Page 1
            </button>
            <button
              aria-selected={canvasView === "page2"}
              className={`flyer-editor-tool${
                canvasView === "page2" ? " flyer-editor-tool-active" : ""
              }`}
              onClick={() => setCanvasView("page2")}
              role="tab"
              type="button"
            >
              Page 2
            </button>
            <button
              aria-selected={canvasView === "spread"}
              className={`flyer-editor-tool${
                canvasView === "spread" ? " flyer-editor-tool-active" : ""
              }`}
              onClick={() => setCanvasView("spread")}
              role="tab"
              type="button"
            >
              Spread
            </button>
          </div>
        </div>
      </section>

      <section className="flyer-preview-panel" aria-label="Inline editable flyer">
        <div className="flyer-preview-shell flyer-preview-shell-editor" ref={previewShellRef}>
          <div className={`flyer-preview-canvas flyer-editor-view-${canvasView}`}>
            <div className="flyer-preview-frame" style={previewFrameStyle}>
              <div className="flyer-preview-stage" style={previewStageStyle}>
                <FlyerEditableDocument
                  content={content}
                  onFeatureRowChange={updateFeatureRowField}
                  onFeatureRowDelete={deleteFeatureRowField}
                  onFeatureRowRestore={restoreFeatureRowField}
                  onListChange={updateListField}
                  onListDelete={deleteListField}
                  onListRestore={restoreListField}
                  onPairChange={updatePairField}
                  onPairDelete={deletePairField}
                  onPairRestore={restorePairField}
                  onTextChange={updateTextField}
                  onTextDelete={deleteTextField}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
