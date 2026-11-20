"use client";

import { useEffect, useState } from "react";

/**
 * FloatingEffects — ambient template motifs (petals / gold dust / diya embers
 * / confetti / palm). CSS-only loops, capped count, paused offscreen + hidden
 * tab, off under reduced-motion. Admin toggles via sections.effects.
 */
const KINDS = {
  marigold: { color: "#e8a020", shape: "petal" },
  rose: { color: "#d98a9c", shape: "petal" },
  gold: { color: "#d4af37", shape: "dot" },
  diya: { color: "#f59e0b", shape: "ember" },
  confetti: { color: "#c87d8a", shape: "confetti" },
  palm: { color: "#7ba05b", shape: "leaf" },
} as const;

export type EffectKind = keyof typeof KINDS;

const COUNT: Record<string, number> = { calm: 8, normal: 12, lively: 18 };
const DENSITY: Record<string, number> = { low: 0.5, medium: 1, high: 1.6 };

export default function FloatingEffects({
  kind,
  speed = "normal",
  density = "medium",
}: {
  kind: EffectKind;
  speed?: "calm" | "normal" | "lively";
  density?: "low" | "medium" | "high";
}) {
  const [go, setGo] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let live = true;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !document.hidden) setGo(true);
      else setGo(false);
    });
    io.observe(document.body);
    const onVis = () => setGo(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      live = false;
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      void live;
    };
  }, []);

  if (!go) return null;
  const k = KINDS[kind] ?? KINDS.gold;
  const n = Math.max(4, Math.round((COUNT[speed] ?? 12) * (DENSITY[density] ?? 1)));
  const dur = speed === "calm" ? 11 : speed === "lively" ? 6.5 : 8.5;

  return (
    <div aria-hidden="true" className="wi-fx pointer-events-none fixed inset-0 z-[4] overflow-hidden">
      {Array.from({ length: n }).map((_, i) => {
        // Even spread across the full width (old (i*97)%100 clustered right).
        const left = `${(((i + 0.5) * 100) / n) % 100}%`;
        const delay = `${-((i * 1.7) % dur).toFixed(1)}s`;
        const duration = `${(dur + ((i * 37) % 40) / 10).toFixed(1)}s`;
        const size = 6 + ((i * 13) % 10);
        return (
          <span
            key={i}
            className={`wi-fx-bit wi-fx-${k.shape}`}
            style={
              {
                left,
                color: i % 5 === 4 ? "#ffffff" : k.color,
                width: size,
                height: k.shape === "petal" || k.shape === "leaf" ? size * 1.3 : size,
                ["--fx-dur" as string]: duration,
                ["--fx-delay" as string]: delay,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
