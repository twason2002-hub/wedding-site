"use client";

import OpeningImage from "./OpeningImage";
import GoldDust from "./GoldDust";
import { usePullReveal } from "./usePullReveal";
import { useDelight } from "../motion";

const BELL = "/weddings/openings/vivah-bell.webp";

/**
 * Vivah signature — pull the hanging bell down. Release past the threshold
 * swings it and opens the invite. Config: motion.signature.diyaBell
 *
 * The hanger is centred with the `translate` property (`.wi-anchor-x`), not
 * `transform`, so the pull and the swing cannot wipe the -50% offset.
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
  const delight = useDelight();
  const ease = pull.dragging ? "none" : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
  const drop = pull.opened ? 0 : pull.pull;
  const progress = Math.round((pull.pull / 110) * 100);
  const sway = delight.idleSway && !pull.opened && !pull.dragging && pull.pull === 0;
  const sweep = delight.nameSweep && pull.opened;

  return (
    <div className="absolute inset-0 text-[#fdf1d6]">
      <div className="wi-anchor-x wi-hang z-10" data-center="hanger">
        <div style={{ transform: `translate3d(0, ${drop}px, 0)`, transition: ease }}>
          <div className={pull.opened ? "wi-bell-swing" : sway ? "wi-idle-sway" : undefined} style={{ transformOrigin: "top center" }}>
            <div className="relative w-max" data-center="art">
              <OpeningImage
                src={BELL}
                width={287}
                height={1204}
                priority
                className="block h-[min(58dvh,680px)] w-auto max-w-[46vw]"
                fallback={<BellFallback />}
              />
              <button
                type="button"
                data-pull=""
                className="wi-pull-handle wi-anchor-x bottom-0 z-10 h-[48%] w-[88%] min-h-16"
                aria-label="Pull the bell tassel to open the invitation"
                role="slider"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-valuetext={pull.opened ? "Open" : `${progress} percent pulled`}
                {...pull.bind}
              >
                <span className="wi-pull-cue" data-center="cue" style={{ top: "72%" }} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {pull.opened && delight.goldDust && <GoldDust />}

      <div
        data-center="names"
        className="absolute inset-x-0 bottom-[max(5.5rem,env(safe-area-inset-bottom))] z-20 mx-auto w-[min(92vw,20rem)] rounded-3xl bg-[#3d090c] px-6 py-5 text-center shadow-[inset_0_0_0_0.75px_rgba(240,180,41,0.45)] transition-opacity duration-500"
        style={{ opacity: pull.opened ? 1 : 0, pointerEvents: pull.opened ? "auto" : "none" }}
        aria-hidden={pull.opened ? undefined : true}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#f6d98a]">
          {blessing ?? "You are invited"}
        </p>
        <h2 className={`wi-couple-heading mt-2 font-display-luxury text-[1.7rem] italic leading-tight text-[#fdf1d6] ${sweep ? "wi-name-sweep" : ""}`}>
          {names}
        </h2>
        {subtitle && <p className="mt-2 text-sm text-[#fdf1d6]">{subtitle}</p>}
      </div>

      <p
        data-center="label"
        className="wi-anchor-x pointer-events-none bottom-[max(4.5rem,calc(env(safe-area-inset-bottom)+3.25rem))] z-30 rounded-full bg-[#3d090c] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#f6d98a]"
      >
        {pull.opened ? "Shubh vivah" : "Pull the tassel"}
      </p>
      <button
        type="button"
        data-center="action"
        onClick={pull.finish}
        className="wi-anchor-x bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 min-h-11 rounded-full bg-[#3d090c] px-5 text-xs uppercase tracking-[0.2em] text-[#fdf1d6]"
      >
        Open the invitation
      </button>
    </div>
  );
}

function BellFallback() {
  return (
    <svg viewBox="0 0 120 480" className="block h-[min(58dvh,680px)] w-auto" aria-hidden="true">
      <rect x="58" y="0" width="4" height="70" fill="#d4af37" />
      <path d="M28 150c0-40 14-70 32-78 18 8 32 38 32 78 0 18-12 28-32 28s-32-10-32-28z" fill="#e0b44a" stroke="#8a6230" />
      <circle cx="60" cy="210" r="8" fill="#f0b429" />
      <path d="M48 230h24l8 70H40z" fill="#e35d2f" />
      <path d="M36 300h48l-6 90H42z" fill="#9b1c2c" />
    </svg>
  );
}
