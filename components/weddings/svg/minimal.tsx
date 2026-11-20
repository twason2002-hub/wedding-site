/**
 * Minimal motifs — hairline arc, orbit circle, horizon line.
 */
export function ThinArc({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 100" fill="none" className={className} aria-hidden="true">
      <path d="M10 90 A90 90 0 0 1 190 90" stroke="currentColor" strokeWidth="1" />
      <path d="M30 90 A70 70 0 0 1 170 90" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
      <circle cx="100" cy="90" r="2" fill="currentColor" />
    </svg>
  );
}

export function OrbitCircle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" />
      <circle cx="80" cy="50" r="3" fill="currentColor" />
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.7" />
    </svg>
  );
}

export function HorizonLine({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 20" fill="none" className={className} aria-hidden="true" preserveAspectRatio="none">
      <line x1="0" y1="10" x2="200" y2="10" stroke="currentColor" strokeWidth="1" />
      <circle cx="100" cy="10" r="2.5" fill="none" stroke="currentColor" />
    </svg>
  );
}
