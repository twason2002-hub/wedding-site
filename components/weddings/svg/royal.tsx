/**
 * Royal motifs — jharokha arch, paisley, corner flourish. Original line art,
 * currentColor strokes. No assets, no content.
 */
export function RoyalArch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" fill="none" className={className} aria-hidden="true">
      <path d="M15 125 L15 55 Q15 15 50 8 Q85 15 85 55 L85 125" stroke="currentColor" strokeWidth="1.5" />
      <path d="M25 125 L25 60 Q25 28 50 22 Q75 28 75 60 L75 125" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
      <circle cx="50" cy="8" r="2" stroke="currentColor" />
    </svg>
  );
}

export function Paisley({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <path d="M50 10 C68 22, 76 42, 66 60 C58 74, 42 78, 32 66 C24 56, 28 42, 40 38 C48 35, 56 40, 55 48 C54 54, 47 57, 42 54" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="48" cy="47" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function RoyalCorner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className} aria-hidden="true">
      <path d="M4 56 L4 16 Q4 4 16 4 L56 4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 56 L12 22 Q12 12 22 12 L56 12" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
      <circle cx="4" cy="56" r="1.6" fill="currentColor" />
      <circle cx="56" cy="4" r="1.6" fill="currentColor" />
    </svg>
  );
}
