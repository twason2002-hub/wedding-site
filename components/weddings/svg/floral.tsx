/**
 * Floral motifs — branch, bloom, leaf sprig. Original line art.
 */
export function FloralBranch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 60" fill="none" className={className} aria-hidden="true">
      <path d="M4 50 C60 30, 120 44, 196 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {[
        [50, 38, 12],
        [100, 36, -8],
        [150, 28, 14],
      ].map(([x, y, r], i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx="9" ry="5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx={x} cy={y} r="2.4" fill="currentColor" />
        </g>
      ))}
      <circle cx="196" cy="18" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function Bloom({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <ellipse key={k} cx="50" cy="30" rx="11" ry="20" transform={`rotate(${k * 60} 50 50)`} stroke="currentColor" strokeWidth="1.3" />
      ))}
      <circle cx="50" cy="50" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function LeafSprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 100" fill="none" className={className} aria-hidden="true">
      <path d="M30 96 C30 66, 30 36, 30 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {[80, 62, 44].map((y, i) => (
        <g key={i}>
          <path d={`M30 ${y} C20 ${y - 8}, 12 ${y - 8}, 6 ${y - 2}`} stroke="currentColor" strokeWidth="1.1" />
          <path d={`M30 ${y} C40 ${y - 8}, 48 ${y - 8}, 54 ${y - 2}`} stroke="currentColor" strokeWidth="1.1" />
        </g>
      ))}
    </svg>
  );
}
