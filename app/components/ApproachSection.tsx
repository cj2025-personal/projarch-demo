import { ScrollReveal } from "./ScrollReveal";

const steps = [
  {
    step: "01",
    title: "Scholar data for students",
    copy:
      "Students would access research and background data from R1 legacy and contemporary scholars.",
  },
  {
    step: "02",
    title: "AI-assisted learning",
    copy:
      "AI would help students understand difficult material, answer questions, and build comprehension at the right reading level.",
  },
  {
    step: "03",
    title: "Onboarded scholar content",
    copy:
      "Scholars who get onboarded from the roster would produce editorial content, podcasts, and other platform media.",
  },
];

export function ApproachSection() {
  return (
    <ScrollReveal as="section" className="approach-section" id="approach">
      <div className="container">
        <ScrollReveal className="approach-header">
          <p className="section-kicker section-kicker-red">How It Would Work</p>
          <h2>Scholar data and AI-assisted help, brought together.</h2>
        </ScrollReveal>

        <div className="approach-grid">
          {steps.map((item, index) => (
            <ScrollReveal
              key={item.step}
              className="approach-card"
              delay={index * 90}
            >
              <span className="approach-step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
