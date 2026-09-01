import type { ScholarDataStageIcon as StageIcon } from "../content/scholarDataContent";

type ScholarDataStageIconProps = {
  icon: StageIcon;
};

export function ScholarDataStageIcon({ icon }: ScholarDataStageIconProps) {
  if (icon === "source") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M13 7h15l7 7v27H13z" fill="currentColor" opacity="0.12" />
        <path
          d="M13 7h15l7 7v27H13zM28 7v7h7"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 23h10M19 30h10"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "profile") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="9" y="9" width="30" height="30" rx="6" fill="currentColor" opacity="0.12" />
        <rect
          x="9"
          y="9"
          width="30"
          height="30"
          rx="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <circle cx="20" cy="21" r="4.5" fill="currentColor" />
        <path
          d="M13 34c1.6-4.2 4.1-6.3 7-6.3s5.4 2.1 7 6.3M30 18h5M30 25h5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "section") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="8" y="10" width="32" height="9" rx="3" fill="currentColor" opacity="0.14" />
        <rect x="8" y="22" width="32" height="7" rx="3" fill="currentColor" opacity="0.14" />
        <rect x="8" y="32" width="32" height="7" rx="3" fill="currentColor" opacity="0.14" />
        <path
          d="M8 10h32v9H8zM8 22h32v7H8zM8 32h32v7H8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path d="M13 14.5h9M13 25.5h14M13 35.5h11" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "passage") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="8" y="12" width="20" height="10" rx="3" fill="currentColor" opacity="0.16" />
        <rect x="14" y="26" width="20" height="10" rx="3" fill="currentColor" opacity="0.16" />
        <rect
          x="8"
          y="12"
          width="20"
          height="10"
          rx="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
        />
        <rect
          x="14"
          y="26"
          width="20"
          height="10"
          rx="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
        />
        <path d="M34 15h6M34 20h6M6 30h6M6 35h6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "evidence") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 6l14 5v12c0 9-6 15.5-14 19-8-3.5-14-10-14-19V11z" fill="currentColor" opacity="0.12" />
        <path
          d="M24 6l14 5v12c0 9-6 15.5-14 19-8-3.5-14-10-14-19V11z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M17 23.5l5 5 9-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M9 11h30v20H21l-9 7V11z" fill="currentColor" opacity="0.12" />
      <path
        d="M9 11h30v20H21l-9 7V11z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M16 19h16M16 25h9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="31" cy="25" r="2.4" fill="currentColor" />
    </svg>
  );
}
