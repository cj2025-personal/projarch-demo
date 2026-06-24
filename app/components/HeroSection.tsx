import { companyTagline, conceptOneLiner } from "../content/platformContent";

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container hero-grid" id="top">
        <div className="hero-copy">
          <a className="brand hero-brand" href="#top" aria-label="Project Arch home">
            <span className="brand-copy">
              <strong>Project Arch</strong>
              <span>{companyTagline}</span>
            </span>
          </a>

          <h1>
            Build a stronger
            <span> AI-driven American education model.</span>
          </h1>

          <p className="hero-text">{conceptOneLiner}</p>
        </div>

        <div className="hero-media">
          <div className="hero-player-frame" id="hero-video">
            <div className="hero-video-label">Featured concept reel</div>
            <video className="hero-video" controls preload="metadata" playsInline>
              <source src="/concept.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
