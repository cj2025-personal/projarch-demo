import { FlyerDocument } from "./FlyerDocument";
import { conceptOneLiner } from "../content/platformContent";
import { ScrollReveal } from "./ScrollReveal";

export function FlyerSection() {
  return (
    <ScrollReveal as="section" className="flyer-section" id="overview-flyer">
      <div className="container">
        <ScrollReveal className="flyer-section-copy" delay={60}>
          <p className="section-kicker section-kicker-red">Overview Flyer</p>
          <h2>
            Download the Project Arch
            <span> digital overview.</span>
          </h2>
          <p>{conceptOneLiner}</p>
          <p>
            Download the full concept overview with platform features and contact
            details for collaboration and investment conversations.
          </p>
          <a className="button button-primary flyer-download" href="/project-arch-flyer.pdf" download>
            Download PDF Flyer
          </a>
        </ScrollReveal>

        <ScrollReveal className="flyer-preview-shell" delay={160}>
          <div aria-label="Flyer preview">
            <div className="flyer-preview-frame">
              <div className="flyer-preview-crop">
                <FlyerDocument />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </ScrollReveal>
  );
}
