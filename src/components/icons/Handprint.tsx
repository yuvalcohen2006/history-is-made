interface HandprintProps {
  className?: string
  title?: string
}

/**
 * Stylized cave-art handprint — the site's emblem. Used in the logo and as the
 * lock glyph on gated stations.
 */
export function Handprint({ className, title }: HandprintProps) {
  return (
    <svg
      viewBox="0 0 64 80"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="currentColor"
    >
      {/* palm */}
      <path d="M14 40c0-9 4-15 18-15s18 6 18 15v12c0 12-7 22-18 22S14 64 14 52z" />
      {/* thumb */}
      <rect x="7" y="36" width="9" height="22" rx="4.5" transform="rotate(28 11 47)" />
      {/* fingers */}
      <rect x="17" y="8" width="8" height="28" rx="4" />
      <rect x="28" y="3" width="8" height="33" rx="4" />
      <rect x="39" y="8" width="8" height="28" rx="4" />
      <rect x="49" y="14" width="8" height="24" rx="4" transform="rotate(12 53 26)" />
    </svg>
  )
}
