"use client";

import { useRef, useState, type PointerEvent } from "react";

const MAX_PULL = 110;
const OPEN_AT = 64;

/**
 * Vivah signature — a hanging diya bell swings as it is pulled, then opens the invite.
 * Transform only. Config: motion.signature.diyaBell
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
  const [pull, setPull] = useState(0);
  const [opened, setOpened] = useState(false);
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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(onDone, reduce ? 0 : 560);
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (opened) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { y: event.clientY, base: pullRef.current };
  };
  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current || opened) return;
    setPullPx(drag.current.base + (event.clientY - drag.current.y));
  };
  const onPointerUp = () => {
    if (!drag.current || opened) return;
    drag.current = null;
    if (pullRef.current >= OPEN_AT) open();
    else setPullPx(0);
  };

  const swing = opened ? 0 : Math.sin(pull / 18) * 16;

  return (
    <div className="relative z-10 mx-6 flex w-full max-w-[340px] flex-col items-center text-center text-[#fdf1d6]">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[#f0b429]">
        {opened ? "Shubh vivah" : "Pull the diya bell"}
      </p>
      <div className="relative h-44 w-full" style={{ perspective: "800px" }}>
        <div className="absolute left-1/2 top-0 h-16 w-px -translate-x-1/2 bg-[#f0b429]/80" aria-hidden="true" />
        <button
          type="button"
          aria-label="Pull the diya bell to open the invitation"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={open}
          className={`absolute left-1/2 top-14 min-h-16 min-w-16 -translate-x-1/2 rounded-full border border-[#f0b429] bg-[#631215] text-[#f0b429] ${opened ? "wi-bell-swing" : ""}`}
          style={{
            transform: `translateX(-50%) translateY(${pull * 0.25}px) rotate(${swing}deg)`,
            transformOrigin: "top center",
          }}
        >
          <span className="block text-2xl leading-none" aria-hidden="true">
            ✦
          </span>
        </button>
      </div>
      <div className="mt-2 rounded-3xl bg-[#4a0b0d] px-6 py-6 shadow-[inset_0_0_0_0.75px_rgba(240,180,41,0.4)]">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#f0b429]">{blessing ?? "You are invited"}</p>
        <h2 className="wi-couple-heading mt-2 font-display-luxury text-[1.7rem] italic leading-tight">{names}</h2>
        {subtitle && <p className="mt-2 text-sm text-[#fdf1d6]/80">{subtitle}</p>}
      </div>
      <button type="button" onClick={open} className="mt-4 min-h-11 text-xs uppercase tracking-[0.22em] text-[#f0b429]">
        Open the invitation
      </button>
    </div>
  );
}
