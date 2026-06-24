import { contactEmail, contactLine, ideator } from "../content/platformContent";
import { ScrollReveal } from "./ScrollReveal";

export function SiteFooter() {
  return (
    <ScrollReveal as="footer" className="site-footer" id="contact">
      <div className="container footer-inner">
        <a className="brand footer-brand" href="#top" aria-label="Project Arch home">
          <span className="brand-copy">
            <strong>Project Arch</strong>
            <span>From archives to you, accelerated by AI</span>
          </span>
        </a>

        <div className="footer-contact">
          <p>{contactLine}</p>
          <a className="footer-email" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
        </div>

        <p className="footer-credit">Ideated by {ideator}</p>
      </div>
    </ScrollReveal>
  );
}
