import { conceptNote, conceptOneLiner } from "../content/platformContent";
import { ScrollReveal } from "./ScrollReveal";

export function ImpactSection() {
  return (
    <ScrollReveal as="section" className="impact-section" id="impact">
      <div className="container impact-grid">
        <ScrollReveal className="impact-copy" delay={60}>
          <p className="section-kicker">Our Mission</p>
          <h2>Build a new American model for reading comprehension.</h2>
          <p>
            {conceptOneLiner} {conceptNote}
          </p>
        </ScrollReveal>

        <ScrollReveal className="impact-panel" delay={160}>
          <blockquote>
            &ldquo;Everything in Project Arch is designed around a student&apos;s
            reading level—with AI used for good to support healthier, more
            effective comprehension and writing growth.&rdquo;
          </blockquote>
          <div className="impact-stats">
            <div>
              <strong>Scholar data</strong>
              <span>Research and background students would explore</span>
            </div>
            <div>
              <strong>AI-assisted help</strong>
              <span>Support for comprehension, questions, and writing growth</span>
            </div>
            <div>
              <strong>Concept stage</strong>
              <span>An idea announced—not a live product release</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </ScrollReveal>
  );
}
