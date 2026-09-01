import type { ScholarGroupIcon as GroupIcon } from "../content/scholarDataContent";

type ScholarGroupIconProps = {
  icon: GroupIcon;
};

export function ScholarGroupIcon({ icon }: ScholarGroupIconProps) {
  if (icon === "contemporary") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="17" r="7" fill="currentColor" opacity="0.16" />
        <circle cx="24" cy="17" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
        <path
          d="M11 39c2.6-7.4 7-11.1 13-11.1S34.4 31.6 37 39"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "legacy") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="8" y="10" width="32" height="9" rx="3" fill="currentColor" opacity="0.16" />
        <rect
          x="8"
          y="10"
          width="32"
          height="9"
          rx="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          d="M11 19v16a3 3 0 0 0 3 3h20a3 3 0 0 0 3-3V19"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M20 27h8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M24 6l5.2 10.9 11.8 1.6-8.6 8.3 2.1 11.9L24 33.1l-10.5 5.6 2.1-11.9-8.6-8.3 11.8-1.6z"
        fill="currentColor"
        opacity="0.16"
      />
      <path
        d="M24 6l5.2 10.9 11.8 1.6-8.6 8.3 2.1 11.9L24 33.1l-10.5 5.6 2.1-11.9-8.6-8.3 11.8-1.6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
