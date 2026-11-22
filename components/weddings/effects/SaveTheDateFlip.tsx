"use client";

import { useState, type ReactNode } from "react";
import { useSignature } from "../motion";
import OpeningImage from "./OpeningImage";

const PAPER = "/weddings/openings/minimal-paper.webp";

/**
 * Minimal signature — save-the-date face flips to the celebration details.
 * Both faces use the ivory paper. Config: motion.signature.cardFlip
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
        <PaperFace>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-[#4a3724]">Save the date</span>
          <span className="mt-2 block font-display-luxury text-2xl italic text-[#24180f]">{date}</span>
          <span className="mt-3 block text-[11px] uppercase tracking-[0.18em] text-[#4a3724]">Tap for details</span>
        </PaperFace>
        <PaperFace turned>
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#4a3724]">The celebrations</span>
          {details.slice(0, 3).map((line) => (
            <span key={line} className="mt-1 block text-sm text-[#24180f]">
              {line}
            </span>
          ))}
        </PaperFace>
      </span>
    </button>
  );
}

function PaperFace({ children, turned = false }: { children: ReactNode; turned?: boolean }) {
  return (
    <span
      className="absolute inset-0 overflow-hidden rounded-3xl shadow-[inset_0_0_0_0.75px_rgba(196,161,90,0.55)]"
      style={{ backfaceVisibility: "hidden", transform: turned ? "rotateY(180deg)" : undefined }}
    >
      <OpeningImage
        src={PAPER}
        width={720}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
        fallback={<span className="absolute inset-0 bg-[#f4efe6]" />}
      />
      <span className="absolute inset-0 flex flex-col justify-center px-6">{children}</span>
    </span>
  );
}
