/**
 * SideBorders — template-motif side rails. Wide desktop only, fixed,
 * pointer-events-none, aria-hidden. Hidden until the page has clear side margins.
 */
const MOTIFS: Record<string, { rail: string; trim: string; glyph: React.ReactNode }> = {
  palace: {
    rail: "linear-gradient(180deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0.28) 12%, rgba(212,175,55,0.28) 88%, rgba(212,175,55,0) 100%)",
    trim: "#d4af37",
    glyph: (
      <svg viewBox="0 0 24 40" className="h-10 w-6" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
        <path d="M12 2 C6 10, 4 16, 12 24 C20 16, 18 10, 12 2 Z" />
        <path d="M12 24 L12 34 M7 29 L17 29" />
        <circle cx="12" cy="37" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
  rose: {
    rail: "linear-gradient(180deg, rgba(200,125,138,0) 0%, rgba(200,125,138,0.3) 12%, rgba(200,125,138,0.3) 88%, rgba(200,125,138,0) 100%)",
    trim: "#c87d8a",
    glyph: (
      <svg viewBox="0 0 24 40" className="h-10 w-6" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2.4" />
        <path d="M12 18 C12 26, 8 30, 5 33 M12 18 C12 26, 16 30, 19 33" />
      </svg>
    ),
  },
  line: {
    rail: "linear-gradient(180deg, rgba(185,138,47,0) 0%, rgba(185,138,47,0.4) 15%, rgba(185,138,47,0.4) 85%, rgba(185,138,47,0) 100%)",
    trim: "#b98a2f",
    glyph: (
      <svg viewBox="0 0 24 40" className="h-10 w-6" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
        <line x1="12" y1="2" x2="12" y2="30" />
        <rect x="8" y="30" width="8" height="8" transform="rotate(45 12 34)" />
      </svg>
    ),
  },
  lotus: {
    rail: "linear-gradient(180deg, rgba(240,178,41,0) 0%, rgba(240,178,41,0.32) 12%, rgba(240,178,41,0.32) 88%, rgba(240,178,41,0) 100%)",
    trim: "#f0b429",
    glyph: (
      <svg viewBox="0 0 24 40" className="h-10 w-6" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
        <path d="M12 2 C8 10, 7 16, 12 22 C17 16, 16 10, 12 2 Z" />
        <path d="M12 22 C8 20, 4 21, 3 24 C7 25, 10 24, 12 22 Z M12 22 C16 20, 20 21, 21 24 C17 25, 14 24, 12 22 Z" />
        <path d="M6 30 H18" />
      </svg>
    ),
  },
  palm: {
    rail: "linear-gradient(180deg, rgba(184,107,67,0) 0%, rgba(184,107,67,0.35) 12%, rgba(184,107,67,0.35) 88%, rgba(184,107,67,0) 100%)",
    trim: "#b86b43",
    glyph: (
      <svg viewBox="0 0 24 40" className="h-10 w-6" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
        <path d="M12 2 C12 12, 12 22, 12 32" />
        <path d="M12 10 C8 8, 5 8, 3 10 M12 10 C16 8, 19 8, 21 10 M12 18 C8 16, 5 16, 3 18 M12 18 C16 16, 19 16, 21 18" />
      </svg>
    ),
  },
};

export default function SideBorders({ motif }: { motif: keyof typeof MOTIFS }) {
  const m = MOTIFS[motif] ?? MOTIFS.palace;
  const rail = (side: "left" | "right") => (
    <div
      aria-hidden="true"
      className={`wi-side-rail pointer-events-none fixed top-0 bottom-0 z-[4] hidden w-14 flex-col items-center justify-between py-24 opacity-100 xl:flex ${
        side === "left" ? "left-3" : "right-3"
      }`}
    >
      <span className="motif [&_svg]:h-10 [&_svg]:w-6" style={{ color: m.trim }}>{m.glyph}</span>
      <span className="w-px flex-1 rounded-full" style={{ background: m.rail }} aria-hidden="true" />
      <span className="motif [&_svg]:h-10 [&_svg]:w-6" style={{ color: m.trim }}>{m.glyph}</span>
      <span className="hidden w-px flex-1 rounded-full sm:block" style={{ background: m.rail }} aria-hidden="true" />
      <span className="motif [&_svg]:h-10 [&_svg]:w-6" style={{ color: m.trim }}>{m.glyph}</span>
    </div>
  );
  return (
    <>
      {rail("left")}
      {rail("right")}
    </>
  );
}
