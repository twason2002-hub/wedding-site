/**
 * Destination motifs — wave trio, palm, sun-over-sea.
 */
export function WaveTrio({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 60" fill="none" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path d="M0 20 Q25 10 50 20 T100 20 T150 20 T200 20" stroke="currentColor" strokeWidth="1.4" />
      <path d="M0 34 Q25 24 50 34 T100 34 T150 34 T200 34" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
      <path d="M0 48 Q25 38 50 48 T100 48 T150 48 T200 48" stroke="currentColor" strokeWidth="0.9" opacity="0.45" />
    </svg>
  );
}

export function Palm({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" fill="none" className={className} aria-hidden="true">
      <path d="M50 116 C50 84, 50 60, 50 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {[-38, -14, 14, 38].map((r) => (
        <path key={r} d={`M50 38 C${50 + r * 0.7} 26, ${50 + r} 24, ${50 + r * 1.2} 30`} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      ))}
    </svg>
  );
}

export function SunSea({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 70" fill="none" className={className} aria-hidden="true">
      <circle cx="50" cy="30" r="14" stroke="currentColor" strokeWidth="1.4" />
      {[8, 22, 36, 50, 64].map((y, i) => (
        <line key={i} x1={30 + (i % 2) * 8} y1={y + 12} x2={70 - (i % 2) * 8} y2={y + 12} stroke="currentColor" strokeWidth="1" opacity={0.9 - i * 0.12} />
      ))}
    </svg>
  );
}
