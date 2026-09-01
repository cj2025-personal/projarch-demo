"use client";

import { useEffect, useRef, useState } from "react";
import {
  fetchScholarDataVersions,
  publishScholarDataContent,
  scholarDataPrintPath,
  type ScholarDataVersionSummary,
} from "./scholarDataApi";
import {
  generateFlyerPdfSet,
  triggerFlyerPdfDownload,
} from "./generateFlyerPdfClient";
import { ScholarDataEditableDocument } from "./ScholarDataEditableDocument";
import { scholarDataEditorLoginPath } from "../lib/flyerAuth";
import {
  createDefaultScholarDataContent,
  type ScholarDataPair,
  type ScholarDataStage,
  type ScholarDataTextField,
  type ScholarDataTier,
  type ScholarGroup,
} from "../content/scholarDataContent";
import {
  useScholarDataContent,
  writeStoredScholarDataContent,
} from "./useScholarDataContent";

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

/** The flyer is a two-sheet document; used when the saved version predates
 *  per-page PDFs and a page has to be generated from the canvas instead. */
const SCHOLAR_DATA_PAGE_COUNT = 2;

type FlyerCanvasView = "page1" | "page2" | "spread";
type PairField = "dataPillars" | "audienceSummary";

export function ScholarDataEditor() {
  const { content, isReady, latestVersion, setContent, setLatestVersion, syncError } =
    useScholarDataContent({ persist: true });
  const previewShellRef = useRef<HTMLDivElement | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [canvasView, setCanvasView] = useState<FlyerCanvasView>("spread");
  const [fitScale, setFitScale] = useState(1);
  const [versionList, setVersionList] = useState<ScholarDataVersionSummary[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(true);
  const [versionsError, setVersionsError] = useState<string | null>(null);
  const [latestSavedVersion, setLatestSavedVersion] =
    useState<ScholarDataVersionSummary | null>(null);
  const [preparingPage, setPreparingPage] = useState<number | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);

  const updateTextField = (field: ScholarDataTextField, value: string) => {
    setContent((current) => ({ ...current, [field]: value }));
  };

  const deleteTextField = (field: ScholarDataTextField) => {
    setContent((current) => ({ ...current, [field]: "" }));
  };

  const updatePairField = (
    field: PairField,
    index: number,
    key: keyof ScholarDataPair,
    value: string,
  ) => {
    setContent((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const deletePairField = (field: PairField, index: number) => {
    setContent((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? { ...item, label: "", detail: "" } : item,
      ),
    }));
  };

  const restorePairField = (field: PairField, index: number) => {
    setContent((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? { ...item, label: "New label", detail: "New detail" } : item,
      ),
    }));
  };

  const updateStageField = (
    index: number,
    key: keyof ScholarDataStage,
    value: string,
  ) => {
    setContent((current) => ({
      ...current,
      pipelineStages: current.pipelineStages.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const deleteStageField = (index: number) => {
    setContent((current) => ({
      ...current,
      pipelineStages: current.pipelineStages.map((item, itemIndex) =>
        itemIndex === index ? { ...item, title: "", detail: "" } : item,
      ),
    }));
  };

  const restoreStageField = (index: number) => {
    setContent((current) => ({
      ...current,
      pipelineStages: current.pipelineStages.map((item, itemIndex) =>
        itemIndex === index ? { ...item, title: "New step title", detail: "New step detail" } : item,
      ),
    }));
  };

  const updateGroupField = (index: number, key: keyof ScholarGroup, value: string) => {
    setContent((current) => ({
      ...current,
      scholarGroups: current.scholarGroups.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const deleteGroupField = (index: number) => {
    setContent((current) => ({
      ...current,
      scholarGroups: current.scholarGroups.map((item, itemIndex) =>
        itemIndex === index ? { ...item, name: "", detail: "" } : item,
      ),
    }));
  };

  const restoreGroupField = (index: number) => {
    setContent((current) => ({
      ...current,
      scholarGroups: current.scholarGroups.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, name: "New group", detail: "New group description" }
          : item,
      ),
    }));
  };

  const updateTierField = (index: number, key: keyof ScholarDataTier, value: string) => {
    setContent((current) => ({
      ...current,
      hierarchyTiers: current.hierarchyTiers.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const deleteTierField = (index: number) => {
    setContent((current) => ({
      ...current,
      hierarchyTiers: current.hierarchyTiers.map((item, itemIndex) =>
        itemIndex === index ? { ...item, title: "", detail: "" } : item,
      ),
    }));
  };

  const restoreTierField = (index: number) => {
    setContent((current) => ({
      ...current,
      hierarchyTiers: current.hierarchyTiers.map((item, itemIndex) =>
        itemIndex === index ? { ...item, title: "New level", detail: "New level detail" } : item,
      ),
    }));
  };

  const updateSafeguardField = (index: number, value: string) => {
    setContent((current) => ({
      ...current,
      safeguards: current.safeguards.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  };

  const deleteSafeguardField = (index: number) => {
    setContent((current) => ({
      ...current,
      safeguards: current.safeguards.map((item, itemIndex) =>
        itemIndex === index ? "" : item,
      ),
    }));
  };

  const restoreSafeguardField = (index: number) => {
    setContent((current) => ({
      ...current,
      safeguards: current.safeguards.map((item, itemIndex) =>
        itemIndex === index ? "New safeguard" : item,
      ),
    }));
  };

  const resetContent = () => {
    setContent(createDefaultScholarDataContent());
  };

  useEffect(() => {
    let cancelled = false;

    const loadVersions = async () => {
      setIsLoadingVersions(true);

      try {
        const versions = await fetchScholarDataVersions();
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
      window.location.assign(scholarDataEditorLoginPath);
    }
  };

  /**
   * Falls back to rendering a single page from the current content when the
   * saved version has no stored page PDF, so the per-page download is offered
   * even before the flyer has been republished.
   */
  const handleDownloadPage = async (pageNumber: number) => {
    if (preparingPage !== null || !isReady) {
      return;
    }

    setPreparingPage(pageNumber);
    setPublishError(null);

    try {
      const { pages } = await generateFlyerPdfSet(content, scholarDataPrintPath);
      const pageBytes = pages[pageNumber - 1];

      if (!pageBytes) {
        throw new Error(`Page ${pageNumber} was not rendered.`);
      }

      triggerFlyerPdfDownload(pageBytes, `scholar-data-flyer-page${pageNumber}.pdf`);
    } catch (error) {
      setPublishError(
        error instanceof Error ? error.message : `Unable to prepare page ${pageNumber}.`,
      );
    } finally {
      setPreparingPage(null);
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
      writeStoredScholarDataContent(content);
      setPublishMessage("Generating PDF in your browser...");
      const publishedVersion = await publishScholarDataContent(content);
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
      writeStoredScholarDataContent(publishedVersion.content);
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
    const media = window.matchMedia("(max-width: 900px)");

    const syncCanvasView = () => {
      if (media.matches) {
        setCanvasView((current) => (current === "spread" ? "page1" : current));
      }
    };

    syncCanvasView();
    media.addEventListener("change", syncCanvasView);

    return () => {
      media.removeEventListener("change", syncCanvasView);
    };
  }, []);

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
      setFitScale(Number(nextScale.toFixed(4)));
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
      <nav className="flyer-editor-nav" aria-label="Scholar data flyer editor controls">
        <div className="flyer-editor-nav-brand">
          <h1>Scholar Data Flyer Editor</h1>
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
              Download Both Pages
            </a>
            {Array.from(
              {
                length: Math.max(
                  latestSavedVersion?.pagePdfUrls?.length ?? 0,
                  SCHOLAR_DATA_PAGE_COUNT,
                ),
              },
              (_item, index) => {
                const pageNumber = index + 1;
                const publishedPageUrl = latestSavedVersion?.pagePdfUrls?.[index];

                if (publishedPageUrl) {
                  return (
                    <a
                      className="button button-secondary button-sm"
                      href={publishedPageUrl}
                      key={`page-${pageNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {`Page ${pageNumber}`}
                    </a>
                  );
                }

                return (
                  <button
                    className="button button-secondary button-sm"
                    disabled={preparingPage !== null || !isReady}
                    key={`page-${pageNumber}`}
                    onClick={() => handleDownloadPage(pageNumber)}
                    title="Generated from the current canvas. Publish to store this page with the version."
                    type="button"
                  >
                    {preparingPage === pageNumber
                      ? `Preparing Page ${pageNumber}...`
                      : `Page ${pageNumber}`}
                  </button>
                );
              },
            )}
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
                        <div className="flyer-editor-history-actions">
                          <a
                            className="button button-secondary button-sm"
                            href={item.versionPdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Both
                          </a>
                          {(item.pagePdfUrls ?? []).map((pageUrl, pageIndex) => (
                            <a
                              className="button button-secondary button-sm"
                              href={pageUrl}
                              key={pageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {`P${pageIndex + 1}`}
                            </a>
                          ))}
                        </div>
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
              className={`flyer-editor-tool flyer-editor-tool-spread${
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
                <ScholarDataEditableDocument
                  content={content}
                  onPairChange={updatePairField}
                  onPairDelete={deletePairField}
                  onPairRestore={restorePairField}
                  onGroupChange={updateGroupField}
                  onGroupDelete={deleteGroupField}
                  onGroupRestore={restoreGroupField}
                  onSafeguardChange={updateSafeguardField}
                  onSafeguardDelete={deleteSafeguardField}
                  onSafeguardRestore={restoreSafeguardField}
                  onStageChange={updateStageField}
                  onStageDelete={deleteStageField}
                  onStageRestore={restoreStageField}
                  onTextChange={updateTextField}
                  onTextDelete={deleteTextField}
                  onTierChange={updateTierField}
                  onTierDelete={deleteTierField}
                  onTierRestore={restoreTierField}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
