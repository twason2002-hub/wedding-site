"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Particles, ParticlesEffect } from "@animate-ui/react/primitives/effects/particles";
import type { WeddingData } from "@/lib/weddings/types";
import { experienceFor } from "@/lib/weddings/template-experience";

/**
 * ScratchReveal — gold-foil scratch card hiding the wedding date.
 * Theme (foil/card colors) comes from the template's experience config.
 * Canvas destination-out erase, % cleared sampling, 45% threshold.
 * Reduced-motion / no-canvas → date shown + button fallback.
 * Animate UI Particles burst on reveal (subtle, once).
 */
export default function ScratchReveal({ wedding }: { wedding: WeddingData }) {
  const exp = experienceFor(wedding.templateSlug);
  const enabled = wedding.sections?.scratch ?? exp.features.scratch.enabled;
  const foilHi = exp.features.scratch.foilHi;
  const foilLo = exp.features.scratch.foilLo;
  const cardBg = exp.features.scratch.cardBg;
  const ink = exp.palette.ink;
  const accent = exp.palette.accent;
  const dateDisplay = wedding.couple.weddingDateDisplay;
  const names = `${wedding.couple.bride} & ${wedding.couple.groom}`;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [foilDismissed, setFoilDismissed] = useState(false);
  const [burst, setBurst] = useState(false);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const done = useRef(false);
  const reveal = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setRevealed(true);
    setBurst(true);
  }, []);

  useEffect(() => {
    if (reduced || revealed) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      reveal();
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = wrap.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    g.addColorStop(0, foilHi);
    g.addColorStop(0.5, foilLo);
    g.addColorStop(1, foilHi);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.font = `${Math.floor(canvas.height * 0.09)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SCRATCH TO REVEAL", canvas.width / 2, canvas.height / 2);

    let drawing = false;
    let moves = 0;
    const erase = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect();
      const x = ((clientX - r.left) / r.width) * canvas.width;
      const y = ((clientY - r.top) / r.height) * canvas.height;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, Math.max(18, canvas.width * 0.05), 0, Math.PI * 2);
      ctx.fill();
    };
    const check = () => {
      try {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let clear = 0;
        const step = 37 * 4;
        for (let i = 3; i < data.length; i += step) if (data[i] === 0) clear++;
        const pct = clear / (data.length / step);
        if (pct > 0.45 && !done.current) {
          reveal();
        }
      } catch {
        /* tainted — reveal anyway on heavy scratching */
        if (++moves > 40 && !done.current) {
          reveal();
        }
      }
    };
    const down = (e: PointerEvent) => {
      drawing = true;
      canvas.setPointerCapture?.(e.pointerId);
      erase(e.clientX, e.clientY);
    };
    const move = (e: PointerEvent) => {
      if (!drawing) return;
      erase(e.clientX, e.clientY);
      if (++moves % 15 === 0) check();
    };
    const up = () => {
      drawing = false;
      check();
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, [reduced, revealed, foilHi, foilLo, reveal]);

  if (!enabled) return null;

  return (
    <Particles animate={burst}>
      <ParticlesEffect
        side="top"
        align="center"
        count={16}
        radius={80}
        spread={360}
        duration={1}
        aria-hidden="true"
      />
      <div
        ref={wrapRef}
        className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl text-center"
        style={{ background: cardBg, boxShadow: `inset 0 0 0 0.75px ${accent}66, 0 24px 60px -24px rgba(0,0,0,0.4)` }}
      >
        <div className={`wi-scratch-date px-8 py-10${revealed ? " is-revealed" : ""}`}>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em]" style={{ color: accent }}>
            Save the Date
          </p>
          <p className="font-display-luxury wi-couple-heading mt-2 text-2xl italic" style={{ color: ink }}>
            {names}
          </p>
          <p className="font-display-luxury mt-3 text-4xl font-medium tabular-nums sm:text-5xl" style={{ color: ink }}>
            {dateDisplay}
          </p>
        </div>
        {!foilDismissed && !reduced && (
          <canvas
            ref={canvasRef}
            className={`wi-scratch-foil absolute inset-0 h-full w-full cursor-pointer touch-none${
              revealed ? " wi-scratch-foil--revealing" : ""
            }`}
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget) setFoilDismissed(true);
            }}
            aria-label="Scratch card: scratch to reveal the wedding date"
            role="img"
          />
        )}
        {!revealed && !reduced && (
          <button
            onClick={reveal}
            className="wi-action-lift absolute bottom-3 right-3 rounded-full bg-black/55 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm"
            aria-label="Tap to reveal the wedding date"
          >
            Tap to reveal
          </button>
        )}
      </div>
    </Particles>
  );
}
