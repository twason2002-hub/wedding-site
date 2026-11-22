"use client";

import OpeningImage from "./effects/OpeningImage";
import GoldDust from "./effects/GoldDust";
import { usePullReveal } from "./effects/usePullReveal";
import { useDelight } from "./motion";

const RIBBON = "/weddings/openings/destination-ribbon.webp";
const MAX_PULL = 148;

/**
 * Destination signature — an ivory ribbon hangs from the top. The tassel is
 * the drag handle. Replaces the postcard opening. Pull past the threshold
 * to reveal the invite.
 *
 * Centering uses `.wi-anchor-x` (`translate`, not `transform`) so the pull
 * cannot wipe the -50% offset.
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
  const delight = useDelight();
  const ease = pull.dragging ? "none" : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
  const drop = pull.opened ? MAX_PULL : pull.pull;
  const progress = Math.round((pull.pull / MAX_PULL) * 100);
  const flutter = delight.ribbonFlutter && !pull.dragging && !pull.opened && pull.pull === 0;
  const sweep = delight.nameSweep && pull.opened;

  return (
    <div className="absolute inset-0">
      <div
        data-center="names"
        className="absolute top-1/2 z-10 w-[min(86vw,22rem)] rounded-[1.4rem] bg-[#f7f3eb] px-6 py-8 text-center text-[#0f353e] shadow-[0_24px_60px_rgba(0,0,0,0.35)] transition-opacity duration-500"
        style={{
          left: "50%",
          translate: "-50% -50%",
          opacity: pull.opened ? 1 : 0,
          pointerEvents: pull.opened ? "auto" : "none",
        }}
        aria-hidden={pull.opened ? undefined : true}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#6b3d2e]">
          {blessing ?? "You are invited"}
        </p>
        <h2 className={`wi-couple-heading mt-3 font-display-luxury text-[1.85rem] italic leading-tight text-[#0f353e] ${sweep ? "wi-name-sweep" : ""}`}>
          {names}
        </h2>
        {subtitle && <p className="mt-2 text-sm text-[#24383d]">{subtitle}</p>}
      </div>

      <div className="wi-anchor-x wi-hang z-20" data-center="hanger" style={{ opacity: pull.opened ? 0.15 : 1 }}>
        <div style={{ transform: `translate3d(0, ${drop}px, 0)`, transition: ease }}>
          <div className={flutter ? "wi-ribbon-flutter" : undefined} style={{ transformOrigin: "top center" }}>
            <div className="relative w-max" data-center="art">
              <OpeningImage
                src={RIBBON}
                width={130}
                height={1175}
                priority
                className="block h-[min(64dvh,760px)] w-auto max-w-[30vw]"
                fallback={<RibbonFallback />}
              />
              <button
                type="button"
                data-pull=""
                className="wi-pull-handle wi-anchor-x bottom-0 z-10 h-[38%] w-24 min-h-24"
                aria-label="Pull the ribbon tassel down to open the invitation"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-valuetext={pull.opened ? "Open" : `${progress} percent pulled`}
                role="slider"
                {...pull.bind}
              >
                <span className="wi-pull-cue" data-center="cue" style={{ top: "18%" }} aria-hidden="true" />
                <span className="sr-only">Drag down, or press Enter to open</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {pull.opened && delight.goldDust && <GoldDust />}

      <p
        data-center="label"
        className="wi-anchor-x pointer-events-none bottom-[max(4.75rem,calc(env(safe-area-inset-bottom)+3.5rem))] z-30 rounded-full bg-[#082026] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#f7f3eb]"
      >
        {pull.opened ? "Welcome" : "Pull the tassel"}
      </p>
      <button
        type="button"
        data-center="action"
        onClick={pull.finish}
        className="wi-anchor-x bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 min-h-11 rounded-full bg-[#f7f3eb] px-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f353e]"
      >
        Open invitation
      </button>
    </div>
  );
}

function RibbonFallback() {
  return (
    <svg viewBox="0 0 80 640" className="block h-[min(64dvh,760px)] w-auto" aria-hidden="true">
      <path d="M30 0h20v460c0 10-6 16-10 16s-10-6-10-16V0z" fill="#f3efe4" />
      <circle cx="40" cy="490" r="16" fill="#e7d7a2" stroke="#b08948" />
      <path d="M22 504h36l-6 120H28z" fill="#d4b56a" />
    </svg>
  );
}
