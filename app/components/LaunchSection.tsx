import { conceptScopeNote } from "../content/platformContent";
import { ScrollReveal } from "./ScrollReveal";

const bigTenUniversities = [
  "University of Illinois",
  "Indiana University",
  "University of Iowa",
  "University of Maryland",
  "University of Michigan",
  "Michigan State University",
  "University of Minnesota",
  "University of Nebraska",
  "Northwestern University",
  "Ohio State University",
  "University of Oregon",
  "Pennsylvania State University",
  "Purdue University",
  "Rutgers University",
  "UCLA",
  "University of Southern California",
  "University of Washington",
  "University of Wisconsin",
];

function TickerItems({ suffix }: { suffix: string }) {
  return (
    <>
      {bigTenUniversities.map((university) => (
        <span className="launch-ticker-item" key={`${university}-${suffix}`}>
          {university}
        </span>
      ))}
    </>
  );
}

export function LaunchSection() {
  return (
    <section className="launch-section" id="launch">
      <ScrollReveal className="container launch-copy">
        <h2>
          A concept focused on scholars from
          <span> Big Ten universities.</span>
        </h2>
        <p>
          The concept brings together scholar research, background data, and
          AI-assisted comprehension support for students at leading research
          universities.
        </p>
      </ScrollReveal>

      <div className="launch-ticker" aria-label="Big Ten universities in the concept">
        <div className="launch-ticker-track">
          <div className="launch-ticker-content">
            <span className="launch-ticker-tag">Big Ten</span>
            <TickerItems suffix="a" />
          </div>
          <div className="launch-ticker-content" aria-hidden="true">
            <span className="launch-ticker-tag">Big Ten</span>
            <TickerItems suffix="b" />
          </div>
        </div>
      </div>

      <ScrollReveal className="container" delay={100}>
        <p className="launch-disclaimer">{conceptScopeNote}</p>
      </ScrollReveal>
    </section>
  );
}
