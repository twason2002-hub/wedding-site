"use client";

import { useState, type CSSProperties } from "react";
import OpeningImage from "./OpeningImage";

const CARD = "/weddings/openings/floral-card.webp";

/**
 * Floral signature — petals fold away to the watercolour card.
 * Names stay hidden until the petals open. Config: motion.signature.petalUnfold
 */
export default function PetalUnfold({
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

  const open = () => {
    if (opened) {
      onDone();
      return;
    }
    setOpened(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(onDone, reduce ? 0 : 820);
  };

  const flap = (origin: string, transform: string): CSSProperties => ({
    transformOrigin: origin,
    transform: opened ? transform : "none",
    transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
    backfaceVisibility: "hidden",
  });

  return (
    <div className="relative z-10 flex w-full flex-col items-center px-6 text-center">
      <p className="mb-4 rounded-full bg-[#4a252a]/85 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#fff7f4]">
        {opened ? "Welcome" : "Tap to unfold the petals"}
      </p>
      <button
        type="button"
        onClick={open}
        aria-label={`Unfold the invitation for ${names}`}
        className="relative block h-[min(72dvh,720px)] max-w-[88vw]"
        style={{ aspectRatio: "9 / 16", perspective: "1200px" }}
      >
        <span className="absolute inset-0 overflow-hidden rounded-[1.25rem] shadow-[0_24px_60px_rgba(90,40,50,0.18)]">
          <OpeningImage
            src={CARD}
            width={720}
            height={1280}
            priority
            className="absolute inset-0 h-full w-full object-cover"
            fallback={
              <svg viewBox="0 0 90 160" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <rect width="90" height="160" fill="#fbf6f1" />
                <path d="M8 18c14 10 18 22 8 34C8 40 4 28 8 18z" fill="#e7b7c3" />
                <path d="M82 18c-14 10-18 22-8 34 8-12 12-24 8-34z" fill="#e7b7c3" />
                <path d="M10 140c12-16 22-18 36-8-16 2-26 8-36 8z" fill="#d9899c" />
                <path d="M80 140c-12-16-22-18-36-8 16 2 26 8 36 8z" fill="#d9899c" />
              </svg>
            }
          />
          <span
            className="absolute inset-x-[16%] top-1/2 flex -translate-y-1/2 flex-col items-center justify-center text-center transition-opacity duration-500"
            style={{ opacity: opened ? 1 : 0 }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#5c2a38]">
              {blessing ?? "You are invited"}
            </span>
            <span className="wi-couple-heading mt-3 font-display-luxury text-[1.65rem] italic leading-tight text-[#3d221c]">
              {names}
            </span>
            {subtitle && <span className="mt-2 text-sm text-[#5c2a38]">{subtitle}</span>}
          </span>
        </span>
        <Petal className="absolute inset-x-0 top-0 z-20 h-1/2 rounded-t-[1.25rem] bg-[#f4c9d3]" style={flap("center bottom", "rotateX(-170deg)")} />
        <Petal className="absolute inset-x-0 bottom-0 z-20 h-1/2 rounded-b-[1.25rem] bg-[#e7a8b6]" style={flap("center top", "rotateX(170deg)")} />
        <Petal className="absolute inset-y-0 left-0 z-30 w-1/2 rounded-l-[1.25rem] bg-[#f8d5de]" style={flap("right center", "rotateY(170deg)")} />
        <Petal className="absolute inset-y-0 right-0 z-30 w-1/2 rounded-r-[1.25rem] bg-[#d9899c]" style={flap("left center", "rotateY(-170deg)")} />
      </button>
      <button type="button" onClick={open} className="mt-4 min-h-11 rounded-full bg-[#4a252a] px-5 text-xs uppercase tracking-[0.2em] text-[#fff7f4]">
        Open the invitation
      </button>
    </div>
  );
}

function Petal({ className, style }: { className: string; style: CSSProperties }) {
  return <span aria-hidden="true" className={className} style={style} />;
}
