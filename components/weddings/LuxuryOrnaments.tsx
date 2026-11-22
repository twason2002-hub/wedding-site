"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, registerWeddingPlugins } from "./effects/gsap-setup";
import { watchEarlyReveal } from "./effects/early-reveal";
import { useSignature } from "./motion";

/**
 * 1. AnimatedCalligraphy — Self-drawing SVG botanical/royal flourish.
 * Uses pathLength="1" normalization + IntersectionObserver so the gold or rose
 * stroke draws itself cleanly once when scrolled into view.
 */
export function AnimatedCalligraphy({
  color = "#d4af37",
  variant = "royal",
  className = "",
}: {
  color?: string;
  variant?: "royal" | "floral" | "minimal" | "vivah" | "waves";
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return watchEarlyReveal(el, () => el.classList.add("is-drawn"));
  }, []);

  if (variant === "waves") {
    return (
      <svg
        ref={ref}
        viewBox="0 0 360 36"
        fill="none"
        className={`mx-auto h-8 w-64 sm:w-80 ${className}`}
        aria-hidden="true"
      >
        <path
          pathLength={1}
          d="M10 20 C 65 4, 115 34, 180 18 C 245 2, 295 32, 350 16"
          stroke={color}
          strokeWidth="1.1"
          strokeLinecap="round"
          className="wi-svg-draw"
        />
        <path
          pathLength={1}
          d="M50 28 C 105 14, 155 34, 210 24 C 265 14, 295 30, 320 22"
          stroke={color}
          strokeOpacity="0.45"
          strokeWidth="0.75"
          strokeLinecap="round"
          className="wi-svg-draw"
        />
      </svg>
    );
  }

  if (variant === "floral") {
    return (
      <svg
        ref={ref}
        viewBox="0 0 360 44"
        fill="none"
        className={`mx-auto h-10 w-64 sm:w-80 ${className}`}
        aria-hidden="true"
      >
        <path
          pathLength={1}
          d="M12 22 C 70 22, 110 6, 150 22 C 168 29, 192 29, 210 22 C 250 6, 290 22, 348 22"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          className="wi-svg-draw"
        />
        <path
          pathLength={1}
          d="M180 8 C 172 16, 172 28, 180 36 C 188 28, 188 16, 180 8 Z"
          stroke={color}
          strokeWidth="0.9"
          className="wi-svg-draw"
        />
        <circle cx="140" cy="22" r="2" fill={color} />
        <circle cx="220" cy="22" r="2" fill={color} />
      </svg>
    );
  }

  // Royal / Vivah / Minimal default calligraphic scroll
  return (
    <svg
      ref={ref}
      viewBox="0 0 400 44"
      fill="none"
      className={`mx-auto h-10 w-68 sm:w-88 ${className}`}
      aria-hidden="true"
    >
      <path
        pathLength={1}
        d="M10 22 H145 C162 22 170 9 182 9 C192 9 196 35 200 35 C204 35 208 9 218 9 C230 9 238 22 255 22 H390"
        stroke={color}
        strokeWidth="0.95"
        strokeLinecap="round"
        className="wi-svg-draw"
      />
      <path
        pathLength={1}
        d="M75 16 L82 22 L75 28 M325 16 L318 22 L325 28"
        stroke={color}
        strokeOpacity="0.6"
        strokeWidth="0.8"
        strokeLinecap="round"
        className="wi-svg-draw"
      />
      <circle cx="200" cy="22" r="2.2" fill={color} />
    </svg>
  );
}

/**
 * 2. FiligreeCorners — Ultra-fine 0.75px architectural corner ornaments
 * that replace bulky box borders with high-jewelry precision.
 */
export function FiligreeCorners({ color = "rgba(212,175,55,0.55)" }: { color?: string }) {
  const corner = (pos: string, rot: string) => (
    <svg
      className={`pointer-events-none absolute ${pos} h-7 w-7 ${rot}`}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <path d="M1 27V5C1 2.79086 2.79086 1 5 1H27" stroke={color} strokeWidth="0.85" />
      <path d="M5 23V7C5 5.89543 5.89543 5 7 5H23" stroke={color} strokeWidth="0.55" strokeOpacity="0.65" />
      <circle cx="5" cy="5" r="1.2" fill={color} />
    </svg>
  );

  return (
    <>
      {corner("top-2.5 left-2.5", "")}
      {corner("top-2.5 right-2.5", "rotate-90")}
      {corner("bottom-2.5 right-2.5", "rotate-180")}
      {corner("bottom-2.5 left-2.5", "-rotate-90")}
    </>
  );
}

/**
 * 3. OutlinedEditorialWord — Huge hollow outlined serif watermark + crisp foreground title.
 * Creates the signature luxury magazine depth requested by the user.
 */
export function OutlinedEditorialWord({
  watermark,
  eyebrow,
  title,
  subtitle,
  tone = "light",
  align = "center",
}: {
  watermark: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  tone?: "light" | "dark" | "rose" | "ink";
  align?: "center" | "left";
}) {
  const depthOn = Boolean(useSignature()?.headingDepth);
  const headRef = useRef<HTMLDivElement>(null);
  const strokeCls =
    tone === "dark"
      ? "wi-text-outline-gold"
      : tone === "rose"
      ? "wi-text-outline-rose"
      : tone === "ink"
      ? "wi-text-outline-ink"
      : "wi-text-outline-ink";

  useEffect(() => {
    const el = headRef.current;
    if (!el || !depthOn) return;
    return watchEarlyReveal(el, () => el.classList.add("is-visible"));
  }, [depthOn]);

  return (
    <div
      ref={headRef}
      className={`relative ${depthOn ? "wi-heading-depth" : ""} ${align === "center" ? "text-center" : "text-left"}`}
    >
      <span
        aria-hidden="true"
        // Flex centering crops long words evenly on both sides instead of widening the page on phones.
        className={`font-regal pointer-events-none flex select-none overflow-hidden whitespace-nowrap uppercase leading-none ${
          align === "center" ? "justify-center" : "justify-start"
        } ${strokeCls}`}
        style={{
          fontSize: "clamp(2.75rem, 11vw, 8.5rem)",
          marginBottom: "-0.42em",
          opacity: 0.55,
        }}
      >
        {watermark}
      </span>
      <div className="relative z-10">
        {eyebrow && (
          <p className="text-[11px] uppercase tracking-[0.34em] opacity-80">{eyebrow}</p>
        )}
        <h2 className="font-display-luxury mt-1 text-4xl sm:text-5xl md:text-6xl font-normal italic leading-[1.06]">
          {title}
        </h2>
        {subtitle && <p className="mt-2.5 text-sm opacity-70 max-w-xl mx-auto">{subtitle}</p>}
      </div>
    </div>
  );
}

/**
 * 4. InteractiveTiltCard — 60fps compositor-only 3D perspective tilt on pointer move.
 * Automatically disabled on touch devices and under prefers-reduced-motion.
 */
export function InteractiveTiltCard({
  children,
  className = "",
  intensity = 5,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollTilt = Boolean(useSignature()?.scrollTilt);

  useEffect(() => {
    if (!scrollTilt || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    registerWeddingPlugins();
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set(el, { transformPerspective: 900, force3D: true });
      gsap.fromTo(
        el,
        { rotateX: 6 },
        {
          rotateX: -5,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            end: "bottom 15%",
            scrub: 0.35,
          },
        },
      );
    });
    return () => mm.revert();
  }, [scrollTilt]);

  function tiltDisabled() {
    if (scrollTilt || typeof window === "undefined") return true;
    return (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    );
  }

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (tiltDisabled() || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1100px) rotateX(${(-py * intensity).toFixed(2)}deg) rotateY(${(
      px * intensity
    ).toFixed(2)}deg) translate3d(0, -3px, 0)`;
  }

  function handleLeave() {
    if (tiltDisabled()) return;
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)";
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`${scrollTilt ? "" : "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * 5. AmbientFloatingParticles — Subtle compositor-only floating gold dust,
 * rose petals, diya sparks, or sea mist particles across hero sections.
 */
export function AmbientFloatingParticles({
  variant = "gold",
}: {
  variant?: "gold" | "petals" | "sparks" | "sea";
}) {
  const items = [
    { left: "8%", delay: "0s", dur: "9s", size: 6 },
    { left: "21%", delay: "1.4s", dur: "11s", size: 8 },
    { left: "37%", delay: "0.7s", dur: "8.5s", size: 5 },
    { left: "54%", delay: "2.1s", dur: "10.5s", size: 7 },
    { left: "71%", delay: "0.4s", dur: "9.5s", size: 6 },
    { left: "88%", delay: "1.8s", dur: "11.5s", size: 8 },
  ];

  const color =
    variant === "gold"
      ? "text-[#d4af37]/40"
      : variant === "petals"
      ? "text-[#d98a9c]/45"
      : variant === "sparks"
      ? "text-[#fbbf24]/50"
      : "text-white/35";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((p, i) => (
        <svg
          key={i}
          className={`wi-petal absolute top-0 ${color}`}
          style={
            {
              left: p.left,
              width: p.size * 2.2,
              height: p.size * 2.2,
              "--delay": p.delay,
              "--dur": p.dur,
            } as React.CSSProperties
          }
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          {variant === "petals" ? (
            <path d="M12 2C7 7 4 12 8 18C10.5 22 13.5 22 16 18C20 12 17 7 12 2Z" />
          ) : (
            <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
          )}
        </svg>
      ))}
    </div>
  );
}
