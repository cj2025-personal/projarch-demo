import { conceptOneLiner } from "../content/platformContent";
import { FlyerDownloadButtons } from "./FlyerDownloadButtons";
import { ScrollReveal } from "./ScrollReveal";

export function FlyerSection() {
  return (
    <ScrollReveal as="section" className="flyer-section" id="overview-flyer">
      <div className="container flyer-section-download-only">
        <ScrollReveal className="flyer-section-copy" delay={60}>
          <p className="section-kicker section-kicker-red">Overview Flyer</p>
          <h2>
            Download the Project Arch flyer
            <span> as a PDF.</span>
          </h2>
          <p>{conceptOneLiner}</p>
          <p>The flyer is not shown on the site. Use the button below to download it.</p>
          <div className="flyer-download-row">
            <FlyerDownloadButtons />
          </div>
        </ScrollReveal>
      </div>
    </ScrollReveal>
  );
}
