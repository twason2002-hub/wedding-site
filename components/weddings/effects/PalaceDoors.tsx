"use client";

import { useRef, useState, type PointerEvent } from "react";

const MAX_PULL = 120;
const OPEN_AT = 72;

/**
 * Royal signature — palace doors swing open in 3D when the ring is pulled or tapped.
 * Transforms only. Reduced motion opens without the swing.
 * Config: motion.signature.palaceDoors
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
  const [pull, setPull] = useState(0);
  const [opened, setOpened] = useState(false);
  const [dragging, setDragging] = useState(false);
  const pullRef = useRef(0);
  const drag = useRef<{ y: number; base: number } | null>(null);

  const setPullPx = (next: number) => {
    const clamped = Math.max(0, Math.min(MAX_PULL, next));
    pullRef.current = clamped;
    setPull(clamped);
  };

  const open = () => {
    if (opened) return;
    setOpened(true);
    setDragging(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(onDone, reduce ? 0 : 560);
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (opened) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { y: event.clientY, base: pullRef.current };
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current || opened) return;
    setPullPx(drag.current.base + (event.clientY - drag.current.y));
  };

  const onPointerUp = () => {
    if (!drag.current || opened) return;
    drag.current = null;
    setDragging(false);
    if (pullRef.current >= OPEN_AT) open();
    else setPullPx(0);
  };

  const angle = opened ? 76 : (pull / MAX_PULL) * 28;
  const ease = dragging ? "none" : "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <div className="relative z-10 mx-6 w-full max-w-[420px] text-center text-[#f6ead4]">
      <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-[#e8cf8f]">
        {opened ? "Welcome" : "Pull the ring to open the doors"}
      </p>
      <div className="relative mx-auto h-[340px] w-full max-w-[320px]" style={{ perspective: "1200px" }}>
        <div className="absolute inset-4 flex flex-col items-center justify-center rounded-t-[140px] bg-[#2a100c] px-6 text-[#f6ead4]">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#d4af37]">{blessing ?? "You are invited"}</p>
          <h2 className="wi-couple-heading mt-3 font-display-luxury text-[1.7rem] italic leading-tight">{names}</h2>
          {subtitle && <p className="mt-2 text-sm text-[#f3e5c3]">{subtitle}</p>}
        </div>
        <div
          className="absolute inset-y-0 left-0 w-1/2 origin-left rounded-tl-[140px] border border-[#d4af37]/50 bg-gradient-to-br from-[#6e1a2c] to-[#2b070e]"
          style={{ transform: `rotateY(${-angle}deg)`, transition: ease }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 right-0 w-1/2 origin-right rounded-tr-[140px] border border-[#d4af37]/50 bg-gradient-to-bl from-[#6e1a2c] to-[#2b070e]"
          style={{ transform: `rotateY(${angle}deg)`, transition: ease }}
          aria-hidden="true"
        />
        <button
          type="button"
          aria-label="Pull the palace door ring"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={open}
          className="absolute left-1/2 top-1/2 z-10 flex min-h-14 min-w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#f6ead4]/40 bg-[#d4af37] text-[#140806] shadow-lg"
          style={{ transform: `translate(-50%, calc(-50% + ${opened ? 18 : pull * 0.35}px))`, transition: ease }}
        >
          <span className="h-6 w-6 rounded-full border-2 border-[#140806]/70" />
        </button>
      </div>
      <button type="button" onClick={open} className="mt-4 min-h-11 text-xs uppercase tracking-[0.22em] text-[#e8cf8f]">
        Open the invitation
      </button>
    </div>
  );
}
