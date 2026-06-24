import {
  conceptNote,
  conceptOneLiner,
  featureGoal,
  featurePersonalization,
  platformFeatures,
} from "../content/platformContent";
import { FeatureIcon } from "./FeatureIcon";
import { ScrollReveal } from "./ScrollReveal";

export function PlatformSection() {
  return (
    <ScrollReveal as="section" className="platform-section" id="platform">
      <div className="container feature-list-shell">
        <ScrollReveal className="platform-header">
          <p className="section-kicker">Platform Capabilities</p>
          <h2>
            Everything Project Arch is designed to deliver,
            <span> in one place.</span>
          </h2>
          <p>{conceptOneLiner}</p>
          <p>{conceptNote}</p>
        </ScrollReveal>

        <div className="feature-grid">
          {platformFeatures.map((feature, index) => (
            <ScrollReveal
              key={feature}
              className="feature-card"
              delay={index * 70}
            >
              <div className="feature-card-top">
                <FeatureIcon index={index} />
                <span className="feature-card-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <p>{feature}</p>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="feature-personalization" delay={120}>
          {featurePersonalization}
        </ScrollReveal>

        <ScrollReveal className="feature-goal" delay={180}>
          <strong>{featureGoal}</strong>
        </ScrollReveal>
      </div>
    </ScrollReveal>
  );
}
