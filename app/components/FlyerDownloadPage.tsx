import { FlyerDownloadButtons } from "./FlyerDownloadButtons";

export function FlyerDownloadPage() {
  return (
    <section className="flyer-public-shell" aria-label="Project Arch flyer download">
      <div className="flyer-public-copy">
        <p className="flyer-editor-kicker">Flyer</p>
        <h1>Download the Project Arch flyer</h1>
        <p>
          This page is read-only. The flyer is not shown on the site, and the
          download always uses the latest published version from the private editor.
        </p>
        <div className="flyer-editor-actions">
          <FlyerDownloadButtons includeFlyerPageLink={false} />
          <a className="button button-secondary" href="/">
            Back to site
          </a>
        </div>
      </div>
    </section>
  );
}
