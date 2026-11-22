"use client";

import { useState } from "react";

/**
 * Floral signature — a pressed-petal card unfolds in 3D on tap.
 * Config: motion.signature.petalUnfold
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
    if (opened) return;
    setOpened(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(onDone, reduce ? 0 : 560);
  };

  const flap = (origin: string, transform: string) => ({
    transformOrigin: origin,
    transform: opened ? transform : "none",
    transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
  });

  return (
    <div className="relative z-10 mx-6 w-full max-w-[340px] text-center text-[#4a252a]">
      <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-[#a65c6b]">
        {opened ? "Welcome" : "Tap to unfold the petals"}
      </p>
      <button
        type="button"
        onClick={open}
        aria-label="Unfold the invitation"
        className="relative mx-auto block h-[300px] w-full max-w-[280px]"
        style={{ perspective: "1100px" }}
      >
        <span
          className="absolute inset-x-6 inset-y-8 flex flex-col items-center justify-center rounded-3xl bg-white px-5 shadow-lg"
        >
          <span className="text-[10px] uppercase tracking-[0.28em] text-[#c87d8a]">{blessing ?? "You are invited"}</span>
          <span className="wi-couple-heading mt-3 font-display-luxury text-[1.65rem] italic leading-tight">{names}</span>
          {subtitle && <span className="mt-2 text-sm text-[#6b3a3a]">{subtitle}</span>}
        </span>
        <span aria-hidden="true" className="absolute left-6 right-6 top-8 h-[42%] rounded-t-3xl bg-[#f4c7d1]" style={flap("center bottom", "rotateX(-150deg)")} />
        <span aria-hidden="true" className="absolute bottom-8 left-6 right-6 h-[42%] rounded-b-3xl bg-[#e7a8b6]" style={flap("center top", "rotateX(150deg)")} />
        <span aria-hidden="true" className="absolute bottom-8 left-6 top-8 w-[28%] rounded-l-3xl bg-[#f8d5dc]" style={flap("right center", "rotateY(150deg)")} />
        <span aria-hidden="true" className="absolute bottom-8 right-6 top-8 w-[28%] rounded-r-3xl bg-[#d98a9c]" style={flap("left center", "rotateY(-150deg)")} />
      </button>
      <button type="button" onClick={open} className="mt-4 min-h-11 text-xs uppercase tracking-[0.22em] text-[#a65c6b]">
        Open the invitation
      </button>
    </div>
  );
}
