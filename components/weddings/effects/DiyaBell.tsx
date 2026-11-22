"use client";

import OpeningImage from "./OpeningImage";
import { usePullReveal } from "./usePullReveal";

const BELL = "/weddings/openings/vivah-bell.webp";

/**
 * Vivah signature — pull the hanging bell down. Release past the threshold
 * swings it and opens the invite. Config: motion.signature.diyaBell
 */
export default function DiyaBell({
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
  const pull = usePullReveal(64, 110, onDone);
  const swing = pull.opened ? 0 : Math.sin(pull.pull / 18) * 8;
  const drop = pull.opened ? 0 : pull.pull;
  const ease = pull.dragging ? "none" : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
  const progress = Math.round((pull.pull / 110) * 100);

  return (
    <div className="absolute inset-0 text-[#fdf1d6]">
      <div
        className="absolute left-1/2 top-0 z-10 -translate-x-1/2"
        style={{ transform: `translateX(-50%) translateY(${drop}px)`, transition: ease }}
      >
        <div className={pull.opened ? "wi-bell-swing" : undefined} style={{ transformOrigin: "top center" }}>
          <div className="relative" style={{ transform: `rotate(${swing}deg)`, transformOrigin: "top center", transition: ease }}>
            <OpeningImage
              src={BELL}
              width={287}
              height={1204}
              priority
              className="h-[min(58dvh,680px)] w-auto max-w-[46vw]"
              fallback={<BellFallback />}
            />
            <button
              type="button"
              data-pull=""
              className="absolute bottom-[2%] left-1/2 z-10 h-[22%] min-h-11 w-[70%] min-w-11 -translate-x-1/2 bg-transparent"
              style={{ touchAction: "none" }}
              aria-label="Pull the bell tassel to open the invitation"
              role="slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-valuetext={pull.opened ? "Open" : `${progress} percent pulled`}
              {...pull.bind}
            />
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-[max(5.5rem,env(safe-area-inset-bottom))] z-20 mx-auto w-[min(92vw,20rem)] rounded-3xl bg-[#3d090c] px-6 py-5 text-center shadow-[inset_0_0_0_0.75px_rgba(240,180,41,0.45)] transition-opacity duration-500"
        style={{ opacity: pull.opened ? 1 : 0, pointerEvents: pull.opened ? "auto" : "none" }}
        aria-hidden={pull.opened ? undefined : true}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#f6d98a]">
          {blessing ?? "You are invited"}
        </p>
        <h2 className="wi-couple-heading mt-2 font-display-luxury text-[1.7rem] italic leading-tight text-[#fdf1d6]">
          {names}
        </h2>
        {subtitle && <p className="mt-2 text-sm text-[#fdf1d6]">{subtitle}</p>}
      </div>

      <p className="pointer-events-none absolute bottom-[max(4.5rem,calc(env(safe-area-inset-bottom)+3.25rem))] left-1/2 z-30 -translate-x-1/2 rounded-full bg-[#3d090c] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#f6d98a]">
        {pull.opened ? "Shubh vivah" : "Pull the tassel"}
      </p>
      <button
        type="button"
        onClick={pull.finish}
        className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-30 min-h-11 -translate-x-1/2 rounded-full bg-[#3d090c] px-5 text-xs uppercase tracking-[0.2em] text-[#fdf1d6]"
      >
        Open the invitation
      </button>
    </div>
  );
}

function BellFallback() {
  return (
    <svg viewBox="0 0 120 480" className="h-[min(58dvh,680px)] w-auto" aria-hidden="true">
      <rect x="58" y="0" width="4" height="70" fill="#d4af37" />
      <path d="M28 150c0-40 14-70 32-78 18 8 32 38 32 78 0 18-12 28-32 28s-32-10-32-28z" fill="#e0b44a" stroke="#8a6230" />
      <circle cx="60" cy="210" r="8" fill="#f0b429" />
      <path d="M48 230h24l8 70H40z" fill="#e35d2f" />
      <path d="M36 300h48l-6 90H42z" fill="#9b1c2c" />
    </svg>
  );
}
