/**
 * Traditional motifs — mandala ring, lotus, toran leaf.
 */
export function MandalaRing({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
      <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.8" />
      <rect x="52" y="52" width="96" height="96" stroke="currentColor" strokeWidth="0.8" transform="rotate(45 100 100)" />
      <circle cx="100" cy="100" r="26" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

export function Lotus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <path d="M50 10 C44 26, 42 44, 50 64 C58 44, 56 26, 50 10 Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M50 64 C60 57, 74 57, 82 64 C72 68, 60 68, 50 64 Z M50 64 C40 57, 26 57, 18 64 C28 68, 40 68, 50 64 Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M38 76 H62" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ToranLeaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 60" fill="none" className={className} aria-hidden="true">
      <path d="M20 4 L20 52" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="20" cy="34" rx="9" ry="16" fill="currentColor" opacity="0.85" />
      <path d="M20 22 L20 48" stroke="#4a0b0d" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
