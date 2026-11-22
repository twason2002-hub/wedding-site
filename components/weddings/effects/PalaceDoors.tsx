"use client";

import { useEffect, useRef, useState } from "react";
import OpeningImage, { coverPoint } from "./OpeningImage";
import { usePullReveal } from "./usePullReveal";

const LEFT = "/weddings/openings/royal-door-left.webp";
const RIGHT = "/weddings/openings/royal-door-right.webp";
const IMG_W = 360;
const IMG_H = 1280;
/** Hoop centres, measured on the generated door art (not the lotus below). */
const LEFT_RING = { x: 259, y: 555 };
const RIGHT_RING = { x: 120, y: 558 };

/**
 * Royal signature — full-height palace doors swing open from the outer hinges.
 * The hit target sits on the brass ring. Config: motion.signature.palaceDoors
 */
export default function PalaceDoors({
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
  const pull = usePullReveal(68, 120, onDone);
  const angle = pull.opened ? 108 : (pull.pull / 120) * 62;
  const ease = pull.dragging ? "none" : "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
  const reveal = pull.opened;

  return (
    <div className="wi-opening-hold absolute inset-0 text-[#f6ead4]">
      <div className="absolute inset-0 bg-[#140806]" aria-hidden="true" />
      <div
        className="absolute inset-0 flex items-center justify-center px-8 text-center transition-opacity duration-500"
        style={{ opacity: reveal ? 1 : 0 }}
        aria-hidden={reveal ? undefined : true}
      >
        <div className="max-w-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#e8cf8f]">
            {blessing ?? "You are invited"}
          </p>
          <h2 className="wi-couple-heading mt-3 font-display-luxury text-[1.85rem] italic leading-tight text-[#f6ead4]">
            {names}
          </h2>
          {subtitle && <p className="mt-2 text-sm text-[#f3e5c3]">{subtitle}</p>}
        </div>
      </div>

      <div className="absolute inset-0" style={{ perspective: "1800px" }}>
        <DoorLeaf
          side="left"
          src={LEFT}
          ring={LEFT_RING}
          angle={-angle}
          ease={ease}
          pull={pull}
        />
        <DoorLeaf
          side="right"
          src={RIGHT}
          ring={RIGHT_RING}
          angle={angle}
          ease={ease}
          pull={pull}
        />
      </div>

      <p className="pointer-events-none absolute left-1/2 top-[max(0.75rem,env(safe-area-inset-top))] z-30 -translate-x-1/2 rounded-full bg-[#1a0c08] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#f6ead4]">
        {pull.opened ? "Welcome" : "Pull a ring to open the doors"}
      </p>
      <button
        type="button"
        onClick={pull.finish}
        className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-30 min-h-11 -translate-x-1/2 rounded-full bg-[#1a0c08] px-5 text-xs uppercase tracking-[0.2em] text-[#f6ead4]"
      >
        Open the invitation
      </button>
    </div>
  );
}

function DoorLeaf({
  side,
  src,
  ring,
  angle,
  ease,
  pull,
}: {
  side: "left" | "right";
  src: string;
  ring: { x: number; y: number };
  angle: number;
  ease: string;
  pull: ReturnType<typeof usePullReveal>;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const measure = () => {
      const next = coverPoint(el.clientWidth, el.clientHeight, IMG_W, IMG_H, ring.x, ring.y);
      if (next) setPoint(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ring.x, ring.y]);

  const progress = Math.round((pull.pull / 120) * 100);

  return (
    <div
      ref={panel}
      className={`absolute inset-y-0 w-[calc(50%+2px)] ${side === "left" ? "left-0" : "right-0"}`}
    >
      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: side === "left" ? "left center" : "right center",
          transform: `rotateY(${angle}deg)`,
          transition: ease,
        }}
      >
        <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
          <OpeningImage
            src={src}
            width={IMG_W}
            height={IMG_H}
            priority
            className="h-full w-full object-cover"
            fallback={<DoorFallback side={side} />}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-[#4a1018]"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          aria-hidden="true"
        />
        <button
          type="button"
          data-pull=""
          aria-label={side === "left" ? "Pull the left palace door ring" : "Pull the right palace door ring"}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-valuetext={pull.opened ? "Open" : `${progress} percent open`}
          className="wi-pull-handle absolute z-10 h-[6.5rem] w-[5.5rem]"
          style={{
            left: point?.x ?? "50%",
            top: point?.y ?? "52%",
            transform: "translate(-50%, -50%) translateZ(12px)",
            opacity: pull.opened ? 0 : 1,
            pointerEvents: pull.opened ? "none" : "auto",
          }}
          {...pull.bind}
        >
          <span className="wi-pull-cue" style={{ top: "68%" }} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function DoorFallback({ side }: { side: "left" | "right" }) {
  return (
    <svg viewBox="0 0 180 640" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`door-${side}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6e1a2c" />
          <stop offset="1" stopColor="#2b070e" />
        </linearGradient>
      </defs>
      <rect width="180" height="640" fill={`url(#door-${side})`} />
      <rect x="14" y="18" width="152" height="604" fill="none" stroke="#d4af37" strokeWidth="2" />
      <path d="M40 70h100v120H40z" fill="none" stroke="#d4af37" strokeWidth="2" />
      <circle cx={side === "left" ? 128 : 52} cy="250" r="16" fill="none" stroke="#e8cf8f" strokeWidth="4" />
    </svg>
  );
}
