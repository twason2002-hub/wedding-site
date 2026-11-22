"use client";

import { useState, type ReactNode } from "react";
import OpeningImage from "./OpeningImage";
import { useDelight } from "../motion";

const PAPER = "/weddings/openings/minimal-paper.webp";

/**
 * Minimal signature opening — an ivory card flips in 3D, then the invite opens.
 * Config: motion.signature.cardFlip (replaces the unfold opening).
 */
export default function CardFlip({
  names,
  blessing,
  subtitle,
  onDone,
}: {
  names: string;
  blessing?: string;
  subtitle?: string;
  onDone: () => void;
}) {
  const [opened, setOpened] = useState(false);
  const sweep = useDelight().nameSweep;

  const open = () => {
    if (opened) {
      onDone();
      return;
    }
    setOpened(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(onDone, reduce ? 0 : 820);
  };

  return (
    <div className="relative z-10 flex w-full flex-col items-center px-6 text-center">
      <p data-center="label" className="mb-4 rounded-full bg-[#1c1917]/80 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#f4efe6]">
        {opened ? "Welcome" : "Tap the card to turn it"}
      </p>
      <button
        type="button"
        data-center="card"
        onClick={open}
        aria-label={`Turn the invitation card for ${names}`}
        className="relative mx-auto block aspect-[9/16] w-[min(88vw,22.5rem)] max-w-full"
        style={{ perspective: "1400px" }}
      >
        <span
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: opened ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <PaperFace>
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#4a3724]">
              {blessing ?? "You are invited"}
            </span>
            <span data-center="names" className={`wi-couple-heading mt-3 font-display-luxury text-[1.65rem] italic leading-tight text-[#24180f] ${sweep ? "wi-name-sweep" : ""}`}>
              {names}
            </span>
            <span className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#4a3724]">Turn the card</span>
          </PaperFace>
          <PaperFace turned>
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#4a3724]">Save the date</span>
            {subtitle && (
              <span className="wi-couple-heading mt-3 font-display-luxury text-[1.45rem] italic leading-tight text-[#24180f]">
                {subtitle}
              </span>
            )}
            <span className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#4a3724]">The celebration is open</span>
          </PaperFace>
        </span>
      </button>
      <button type="button" data-center="action" onClick={open} className="mt-4 min-h-11 rounded-full bg-[#1c1917] px-5 text-xs uppercase tracking-[0.2em] text-[#f4efe6]">
        Open the invitation
      </button>
    </div>
  );
}

function PaperFace({ children, turned = false }: { children: ReactNode; turned?: boolean }) {
  return (
    <span
      className="absolute inset-0 overflow-hidden rounded-[1.25rem] shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
      style={{ backfaceVisibility: "hidden", transform: turned ? "rotateY(180deg)" : undefined }}
    >
      <OpeningImage
        src={PAPER}
        width={720}
        height={1280}
        priority
        className="absolute inset-0 h-full w-full object-cover"
        fallback={
          <svg viewBox="0 0 90 160" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <rect x="1" y="1" width="88" height="158" rx="6" fill="#f4efe6" stroke="#c4a15a" strokeWidth="1.5" />
          </svg>
        }
      />
      <span className="absolute inset-[18%] flex flex-col items-center justify-center text-center">{children}</span>
    </span>
  );
}
