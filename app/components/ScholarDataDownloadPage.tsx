import { ScholarDataDownloadButtons } from "./ScholarDataDownloadButtons";

export function ScholarDataDownloadPage() {
  return (
    <section className="flyer-public-shell" aria-label="Scholar data flyer download">
      <div className="flyer-public-copy">
        <p className="flyer-editor-kicker">Scholar Data Flyer</p>
        <h1>Download the Scholar Data flyer</h1>
        <p>
          A plain-language guide to the scholar data behind Project Arch: where the
          material comes from, how it is organized, and why every answer can be traced
          back to a source. The download always uses the latest published version.
        </p>
        <div className="flyer-editor-actions">
          <ScholarDataDownloadButtons />
          <a className="button button-secondary" href="/">
            Back to site
          </a>
        </div>
      </div>
    </section>
  );
}
