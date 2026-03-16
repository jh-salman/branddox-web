/** Branddox megaphone icon – angular outline, sound waves. Use brand-mint on dark, brand-dark on light. */
export function MegaphoneIcon({
  className,
  accent = "mint",
}: {
  className?: string;
  accent?: "mint" | "dark" | "white";
}) {
  const color =
    accent === "mint"
      ? "var(--brand-mint)"
      : accent === "white"
        ? "var(--brand-white)"
        : "var(--brand-dark)";
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Bell (trapezoid) */}
      <path
        d="M12 10h16l8 10-8 10H12V10z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Handle */}
      <path
        d="M12 20H6a2 2 0 012-2h2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Sound lines */}
      <path d="M28 14v2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 18v2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M28 22v2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
