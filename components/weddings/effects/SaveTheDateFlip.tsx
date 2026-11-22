"use client";

import { useState, type ReactNode } from "react";
import { useSignature } from "../motion";

/**
 * Minimal signature — save-the-date face flips to the celebration details.
 * Config: motion.signature.cardFlip
 */
export default function SaveTheDateFlip({
  date,
  details,
  children,
}: {
  date: string;
  details: string[];
  children: ReactNode;
}) {
  const signature = useSignature();
  const [flipped, setFlipped] = useState(false);
  if (!signature?.cardFlip) return <>{children}</>;

  return (
    <button
      type="button"
      onClick={() => setFlipped((value) => !value)}
      aria-pressed={flipped}
      aria-label={flipped ? "Show the date" : "Show the celebration details"}
      className="wi-fadeup wi-fadeup--3 relative mt-8 h-44 w-full max-w-md text-left"
      style={{ perspective: "1200px" }}
    >
      <span
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <span
          className="absolute inset-0 flex items-center justify-center rounded-3xl bg-[#10233f] px-6 text-[#f4efe6] shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.45)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span>
            <span className="block text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Save the date</span>
            <span className="mt-2 block font-display-luxury text-2xl italic">{date}</span>
            <span className="mt-3 block text-[11px] uppercase tracking-[0.18em] text-[#e8cf8f]/80">Tap for details</span>
          </span>
        </span>
        <span
          className="absolute inset-0 flex flex-col justify-center rounded-3xl bg-[#f4efe6] px-6 text-[#10233f] shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.45)]"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#8a6d2b]">The celebrations</span>
          {details.slice(0, 3).map((line) => (
            <span key={line} className="mt-1 block text-sm">
              {line}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}
