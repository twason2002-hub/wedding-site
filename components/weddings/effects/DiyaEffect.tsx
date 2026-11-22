"use client";

import { useId, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { registerWeddingPlugins, prefersReducedMotion } from "./gsap-setup";

/**
 * DiyaEffect — earthen lamp with gently flickering flame + breathing glow.
 */
export default function DiyaEffect({
  flame = "#F59E0B",
  bowl = "#D4AF37",
  size = 120,
  className = "",
}: {
  flame?: string;
  bowl?: string;
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");
  const glowId = `wiDiyaGlow-${uid}`;
  const flameGradId = `wiDiyaFlame-${uid}`;

  useLayoutEffect(() => {
    registerWeddingPlugins();
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const tweens: gsap.core.Tween[] = [];
    const ctx = gsap.context(() => {
      tweens.push(
        gsap.to(el.querySelectorAll(".wi-diya-flame"), {
          scaleY: 1.12,
          scaleX: 0.94,
          transformOrigin: "50% 100%",
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }),
        gsap.to(el.querySelectorAll(".wi-diya-glow"), {
          opacity: 0.55,
          scale: 1.12,
          transformOrigin: "center",
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      );
    }, el);
    const io = new IntersectionObserver(([e]) => tweens.forEach((t) => t.paused(!e.isIntersecting)));
    io.observe(el);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={ref} className={className} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%" }}>
        <defs>
          <radialGradient id={glowId} cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor={flame} stopOpacity="0.5" />
            <stop offset="100%" stopColor={flame} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={flameGradId} x1="60" y1="18" x2="60" y2="62" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="60%" stopColor={flame} />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>
        <circle className="wi-diya-glow" cx="60" cy="62" r="38" fill={`url(#${glowId})`} />
        <path
          className="wi-diya-flame"
          d="M60 18 C60 18, 48 34, 48 44 C48 51, 53 56, 60 56 C67 56, 72 51, 72 44 C72 34, 60 18, 60 18 Z"
          fill={`url(#${flameGradId})`}
        />
        <path d="M28 66 C28 80, 42 88, 60 88 C78 88, 92 80, 92 66 Z" fill={bowl} stroke="#FDE68A" strokeWidth="1" />
        <ellipse cx="60" cy="88" rx="16" ry="3" fill={bowl} opacity="0.7" />
      </svg>
    </div>
  );
}