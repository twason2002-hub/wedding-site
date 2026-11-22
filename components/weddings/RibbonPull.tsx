"use client";

import { useRef, useState, type PointerEvent } from "react";

const MAX_PULL = 148;
const OPEN_AT = 108;

/**
 * Pull-to-reveal — drag the silk ribbon (or use the button / keyboard).
 * Replaces another opening; it is not stacked on top of one.
 * Motion is a transform only, and prefers-reduced-motion skips the slide.
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
    setPullPx(MAX_PULL);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(onDone, reduce ? 0 : 680);
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

  const progress = Math.round((pull / MAX_PULL) * 100);

  return (
    <div className={`wi-ribbon relative z-10 mx-6 flex w-full max-w-[340px] flex-col items-center ${opened ? "is-open" : ""}`}>
      <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-[#f3d5c1]">
        {opened ? "Welcome" : "Pull the ribbon to open"}
      </p>

      <div className="relative w-full rounded-[1.4rem] bg-[#f7f3eb] px-6 pb-8 pt-10 text-center text-[#0f353e] shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-3 -translate-y-1/2 rounded-full bg-[#9a3d32]" aria-hidden="true" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8a4b32]">
          {blessing ?? "You are invited"}
        </p>
        <h2 className="wi-couple-heading wi-name-on-light mt-3 font-display-luxury text-[1.85rem] italic leading-tight text-[#0f353e]">
          {names}
        </h2>
        {subtitle && <p className="mt-2 text-sm text-[#3d4f55]">{subtitle}</p>}
        <p className="mt-4 text-xs leading-relaxed text-[#3d4f55]">The celebration is sealed until the ribbon gives.</p>

        <button
          type="button"
          className="wi-ribbon-handle absolute left-1/2 top-full z-10"
          style={{ transform: `translateX(-50%) translateY(${pull}px)` }}
          aria-label="Pull the ribbon down to open the invitation"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-valuetext={opened ? "Open" : `${progress} percent pulled`}
          role="slider"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              const next = pullRef.current + 36;
              setPullPx(next);
              if (next >= OPEN_AT) open();
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setPullPx(pullRef.current - 36);
            } else if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              open();
            }
          }}
        >
          <span className="mx-auto block h-16 w-5 rounded-b-md bg-gradient-to-b from-[#b94a3c] to-[#7d2a24] shadow-md" />
          <span className="mx-auto -mt-1 block h-7 w-7 rounded-full bg-[#f0d48a] shadow-[inset_0_0_0_2px_#8a6230]" />
          <span className="sr-only">Drag down, or press Enter to open</span>
        </button>
      </div>
      <div className="h-28" aria-hidden="true" />

      <button type="button" className="wi-btn min-h-12 bg-[#f7f3eb] text-[#0f353e]" onClick={open}>
        Open invitation
      </button>
    </div>
  );
}
