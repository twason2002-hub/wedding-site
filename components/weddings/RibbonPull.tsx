"use client";

import OpeningImage from "./effects/OpeningImage";
import { usePullReveal } from "./effects/usePullReveal";

const RIBBON = "/weddings/openings/destination-ribbon.webp";
const MAX_PULL = 148;

/**
 * Destination signature — an ivory ribbon hangs from the top. The tassel is
 * the drag handle. Replaces the postcard opening. Pull past the threshold
 * to reveal the invite.
 */
export default function RibbonPull({
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
  const pull = usePullReveal(72, MAX_PULL, onDone);
  const ease = pull.dragging ? "none" : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
  const drop = pull.opened ? MAX_PULL : pull.pull;
  const progress = Math.round((pull.pull / MAX_PULL) * 100);

  return (
    <div className="absolute inset-0">
      <div
        className="absolute left-1/2 top-1/2 z-10 w-[min(86vw,22rem)] -translate-x-1/2 -translate-y-1/2 rounded-[1.4rem] bg-[#f7f3eb] px-6 py-8 text-center text-[#0f353e] shadow-[0_24px_60px_rgba(0,0,0,0.35)] transition-opacity duration-500"
        style={{ opacity: pull.opened ? 1 : 0, pointerEvents: pull.opened ? "auto" : "none" }}
        aria-hidden={pull.opened ? undefined : true}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#6b3d2e]">
          {blessing ?? "You are invited"}
        </p>
        <h2 className="wi-couple-heading mt-3 font-display-luxury text-[1.85rem] italic leading-tight text-[#0f353e]">
          {names}
        </h2>
        {subtitle && <p className="mt-2 text-sm text-[#24383d]">{subtitle}</p>}
      </div>

      <div
        className="absolute left-1/2 top-0 z-20 -translate-x-1/2"
        style={{
          transform: `translateX(-50%) translateY(${drop}px)`,
          transition: ease,
          opacity: pull.opened ? 0.15 : 1,
        }}
      >
        <div className="relative">
          <OpeningImage
            src={RIBBON}
            width={130}
            height={1175}
            priority
            className="h-[min(64dvh,760px)] w-auto max-w-[30vw]"
            fallback={<RibbonFallback />}
          />
          <button
            type="button"
            data-pull=""
            className="wi-pull-handle absolute bottom-0 left-1/2 z-10 h-[38%] w-24 min-h-24 -translate-x-1/2"
            aria-label="Pull the ribbon tassel down to open the invitation"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-valuetext={pull.opened ? "Open" : `${progress} percent pulled`}
            role="slider"
            {...pull.bind}
          >
            <span className="wi-pull-cue" style={{ top: "18%" }} aria-hidden="true" />
            <span className="sr-only">Drag down, or press Enter to open</span>
          </button>
        </div>
      </div>

      <p className="pointer-events-none absolute bottom-[max(4.75rem,calc(env(safe-area-inset-bottom)+3.5rem))] left-1/2 z-30 -translate-x-1/2 rounded-full bg-[#082026] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#f7f3eb]">
        {pull.opened ? "Welcome" : "Pull the tassel"}
      </p>
      <button
        type="button"
        onClick={pull.finish}
        className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-30 min-h-11 -translate-x-1/2 rounded-full bg-[#f7f3eb] px-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f353e]"
      >
        Open invitation
      </button>
    </div>
  );
}

function RibbonFallback() {
  return (
    <svg viewBox="0 0 80 640" className="h-[min(64dvh,760px)] w-auto" aria-hidden="true">
      <path d="M30 0h20v460c0 10-6 16-10 16s-10-6-10-16V0z" fill="#f3efe4" />
      <circle cx="40" cy="490" r="16" fill="#e7d7a2" stroke="#b08948" />
      <path d="M22 504h36l-6 120H28z" fill="#d4b56a" />
    </svg>
  );
}
