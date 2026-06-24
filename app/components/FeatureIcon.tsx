type FeatureIconProps = {
  index: number;
};

export function FeatureIcon({ index }: FeatureIconProps) {
  const icons = [
    // Legacy scholar archives
    <svg key="archive" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 5h16v3H4V5Zm0 5h10v3H4v-3Zm0 5h14v3H4v-3Z"
        fill="currentColor"
      />
      <path
        d="M18 10h2v8h-2v-8Z"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>,
    // Contemporary research
    <svg key="research" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 3h6v2h4v16H5V5h4V3Zm2 2h2V5h-2v2ZM7 7v12h10V7H7Zm2 3h6v2H9v-2Zm0 4h4v2H9v-2Z"
        fill="currentColor"
      />
    </svg>,
    // Reading comprehension
    <svg key="book" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 4h11a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H6V4Zm0 0v14h12a2 2 0 0 1 2 2V7a3 3 0 0 0-3-3H6Z"
        fill="currentColor"
      />
      <path d="M4 6h2v14H4V6Z" fill="currentColor" opacity="0.55" />
    </svg>,
    // Veri AI Q&A
    <svg key="ai-chat" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-6l-4 3v-3H7a3 3 0 0 1-3-3V5Z"
        fill="currentColor"
      />
      <circle cx="9" cy="10" r="1.2" fill="var(--white)" />
      <circle cx="12" cy="10" r="1.2" fill="var(--white)" />
      <circle cx="15" cy="10" r="1.2" fill="var(--white)" />
    </svg>,
    // Grade-level customization
    <svg key="levels" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 18h16v2H4v-2Z" fill="currentColor" opacity="0.45" />
      <path d="M6 14h12v2H6v-2Z" fill="currentColor" opacity="0.7" />
      <path d="M8 10h8v2H8v-2Z" fill="currentColor" />
      <path d="M10 6h4v2h-4V6Z" fill="currentColor" />
    </svg>,
    // AI-generated podcasts
    <svg key="podcast" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M8 10a4 4 0 0 1 8 0v4a4 4 0 0 1-8 0v-4Zm4-6a6 6 0 0 1 6 6v4a6 6 0 0 1-5 5.92V22h-2v-2.08A6 6 0 0 1 6 14v-4a6 6 0 0 1 6-6Z"
        fill="currentColor"
      />
    </svg>,
    // Live scholar podcasts
    <svg key="live" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path
        d="M12 3a9 9 0 0 1 9 9h-2a7 7 0 0 0-7-7V3ZM12 21a9 9 0 0 1-9-9h2a7 7 0 0 0 7 7v2Z"
        fill="currentColor"
        opacity="0.65"
      />
    </svg>,
    // Editorial content
    <svg key="editorial" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 3h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Zm2 5h8v2H8V8Zm0 4h6v2H8v-2Z"
        fill="currentColor"
      />
    </svg>,
    // Perspective articles
    <svg key="articles" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 4h14v16H5V4Zm2 2v12h10V6H7Zm2 2h6v2H9V8Zm0 4h6v2H9v-2Z"
        fill="currentColor"
      />
    </svg>,
    // Reading-level design
    <svg key="growth" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 18h16v2H4v-2Zm3-4 3-3 3 2 5-6 3 4v3H7v-3Z"
        fill="currentColor"
      />
    </svg>,
  ];

  return <span className="feature-card-icon">{icons[index] ?? icons[0]}</span>;
}
