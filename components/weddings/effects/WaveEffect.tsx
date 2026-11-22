"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { registerWeddingPlugins, prefersReducedMotion } from "./gsap-setup";

/**
 * WaveEffect — layered waves drifting at different speeds (parallax water).
 */
export default function WaveEffect({
  colors = ["#144652", "#0f353e", "#082026"],
  className = "",
}: {
  colors?: [string, string, string] | string[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerWeddingPlugins();
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const layers = el.querySelectorAll(".wi-wave-layer");
    const tweens: gsap.core.Tween[] = [];
    const ctx = gsap.context(() => {
      layers.forEach((layer, i) => {
        tweens.push(
          gsap.to(layer, {
            x: i % 2 ? 18 : -18,
            duration: 8 + i * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            force3D: true,
          })
        );
      });
    }, el);
    const io = new IntersectionObserver(([e]) => {
      tweens.forEach((t) => t.paused(!e.isIntersecting));
    });
    io.observe(el);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  const [a, b, c] = [colors[0] ?? "#144652", colors[1] ?? "#0f353e", colors[2] ?? "#082026"];
  const wave = (fill: string, d: string, opacity: number) => (
    <svg className="wi-wave-layer absolute inset-x-[-30%] bottom-0 h-full w-[160%]" viewBox="0 0 460 140" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} fill={fill} opacity={opacity} />
    </svg>
  );

  return (
    <div ref={ref} className={`pointer-events-none relative overflow-hidden ${className}`} aria-hidden="true">
      {wave(a, "M0 70 Q60 40 120 62 T240 58 T360 70 T460 62 L460 140 L0 140 Z", 0.55)}
      {wave(b, "M0 95 Q70 75 150 92 T300 88 T460 94 L460 140 L0 140 Z", 0.75)}
      {wave(c, "M0 115 Q80 100 180 112 T360 110 T460 114 L460 140 L0 140 Z", 1)}
    </div>
  );
}