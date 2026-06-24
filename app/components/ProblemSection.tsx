import { ScrollReveal } from "./ScrollReveal";

export function ProblemSection() {
  return (
    <ScrollReveal as="section" className="problem-section">
      <div className="container problem-grid">
        <ScrollReveal className="problem-copy" delay={60}>
          <p className="section-kicker section-kicker-red">The Challenge</p>
          <h2>Reading comprehension is the foundation of every learner&apos;s future.</h2>
          <p>
            Students struggle to engage with advanced material because scholarship
            is rarely presented at the right reading level. Without structured
            access to credible research, comprehension gaps widen and writing
            development stalls.
          </p>
        </ScrollReveal>

        <ScrollReveal className="problem-card" delay={140}>
          <h3>What this concept aims to solve</h3>
          <ul>
            <li>Give students access to scholar research and background data</li>
            <li>Provide AI-assisted help that supports comprehension and writing growth</li>
            <li>Connect classrooms to credible scholarship without replacing critical thinking</li>
          </ul>
        </ScrollReveal>
      </div>
    </ScrollReveal>
  );
}
