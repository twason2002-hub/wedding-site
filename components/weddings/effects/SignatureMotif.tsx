"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { registerWeddingPlugins, prefersReducedMotion } from "./gsap-setup";

type Motif = "elephant" | "butterfly" | "peacock" | "star" | "palm";

/**
 * Small signature SVG ornaments unique to each template. Gentle drift or wing flap;
 * still under reduced motion.
 */
export default function SignatureMotif({
  motif,
  className = "",
  color = "currentColor",
}: {
  motif: Motif;
  className?: string;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    registerWeddingPlugins();
    const tweens: gsap.core.Tween[] = [];
    const ctx = gsap.context(() => {
      if (motif === "butterfly") {
        tweens.push(
          gsap.to(el.querySelectorAll(".wi-wing-l"), {
            rotate: -14,
            transformOrigin: "100% 50%",
            duration: 0.7,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          }),
          gsap.to(el.querySelectorAll(".wi-wing-r"), {
            rotate: 14,
            transformOrigin: "0% 50%",
            duration: 0.7,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          }),
          gsap.to(el, { y: -10, duration: 2.8, yoyo: true, repeat: -1, ease: "sine.inOut" })
        );
      } else if (motif === "peacock") {
        tweens.push(
          gsap.to(el, { rotate: 4, transformOrigin: "50% 90%", duration: 3.2, yoyo: true, repeat: -1, ease: "sine.inOut" })
        );
      } else {
        tweens.push(
          gsap.to(el, { y: -8, duration: 3.4, yoyo: true, repeat: -1, ease: "sine.inOut" })
        );
      }
    }, el);
    const io = new IntersectionObserver(([e]) => tweens.forEach((t) => t.paused(!e.isIntersecting)));
    io.observe(el);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, [motif]);

  return (
    <div ref={ref} className={className} style={{ color }} aria-hidden="true">
      {motif === "elephant" && <Elephant />}
      {motif === "butterfly" && <Butterfly />}
      {motif === "peacock" && <Peacock />}
      {motif === "star" && <Star />}
      {motif === "palm" && <PalmMini />}
    </div>
  );
}

function Elephant() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full" fill="none">
      <path d="M18 58 C10 48, 14 34, 28 30 C40 12, 78 10, 92 28 C108 30, 112 46, 102 56 L98 68 H84 L80 58 H44 L40 68 H28 Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M28 40 C22 48, 20 58, 24 66" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="86" cy="36" r="2" fill="currentColor" />
      <path d="M70 22 C74 8, 90 6, 96 18" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function Butterfly() {
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" fill="none">
      <path className="wi-wing-l" d="M40 30 C28 8, 6 14, 12 30 C6 42, 26 50, 40 34" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.12" />
      <path className="wi-wing-r" d="M40 30 C52 8, 74 14, 68 30 C74 42, 54 50, 40 34" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.12" />
      <path d="M40 16 L40 46" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function Peacock() {
  return (
    <svg viewBox="0 0 90 100" className="h-full w-full" fill="none">
      {[ -40, -24, -8, 8, 24, 40 ].map((a) => (
        <path
          key={a}
          d={`M45 72 Q${45 + a * 0.55} 40, ${45 + a} 18`}
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.75"
        />
      ))}
      <circle cx="45" cy="72" r="10" stroke="currentColor" strokeWidth="1.4" />
      <path d="M45 82 L45 96" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="45" cy="18" r="3" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" fill="none">
      <path d="M32 4 L36 24 L56 28 L36 32 L32 52 L28 32 L8 28 L28 24 Z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="32" cy="28" r="3" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

function PalmMini() {
  return (
    <svg viewBox="0 0 64 80" className="h-full w-full" fill="none">
      <path d="M32 76 V28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {[-28, -10, 10, 28].map((r) => (
        <path key={r} d={`M32 28 C${32 + r * 0.6} 18, ${32 + r} 16, ${32 + r * 1.15} 22`} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      ))}
    </svg>
  );
}
