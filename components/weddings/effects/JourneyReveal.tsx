"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { registerWeddingPlugins, prefersReducedMotion, EASE_OUT } from "./gsap-setup";

type Kind = "plane" | "car";

/**
 * JourneyReveal — a plane or car travels across once and unveils the wedding date.
 * GSAP only; still under reduced motion. Paused while offscreen.
 */
export default function JourneyReveal({
  date,
  kind = "plane",
  accent = "#0f353e",
  surface = "#f7f3eb",
  className = "",
}: {
  date: string;
  kind?: Kind;
  accent?: string;
  surface?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    registerWeddingPlugins();
    const vehicle = el.querySelector(".wi-journey-vehicle");
    const dateEl = el.querySelector(".wi-journey-date");
    const trail = el.querySelector(".wi-journey-trail");
    if (prefersReducedMotion()) {
      gsap.set(vehicle, { xPercent: 110, opacity: 0 });
      gsap.set(dateEl, { opacity: 1, y: 0 });
      gsap.set(trail, { scaleX: 1 });
      return;
    }
    gsap.set(dateEl, { opacity: 0, y: 10 });
    gsap.set(trail, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(vehicle, { xPercent: -120, opacity: 1 });
    let tl: gsap.core.Timeline | undefined;
    const ctx = gsap.context(() => {
      tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
      tl.to(vehicle, { xPercent: 118, duration: 2.4, ease: "power1.inOut" }, 0);
      tl.to(trail, { scaleX: 1, duration: 1.6, ease: EASE_OUT }, 0.2);
      tl.to(dateEl, { opacity: 1, y: 0, duration: 0.7, ease: EASE_OUT }, 1.35);
    }, el);
    const io = new IntersectionObserver(([e]) => {
      if (!tl || tl.progress() >= 1) return;
      tl.paused(!e.isIntersecting);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-[1.75rem] px-6 py-10 text-center sm:px-10 sm:py-12 ${className}`}
      style={{ background: surface, boxShadow: `inset 0 0 0 0.75px ${accent}33` }}
      aria-label="Journey to the wedding date"
    >
      <p className="text-[11px] uppercase tracking-[0.28em]" style={{ color: accent }}>
        {kind === "plane" ? "Your flight to forever" : "The baraat is on its way"}
      </p>
      <div className="relative mx-auto mt-8 h-16 max-w-lg">
        <span
          className="wi-journey-trail absolute left-0 top-1/2 h-[2px] w-full origin-left"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}55, ${accent})` }}
          aria-hidden="true"
        />
        <span className="wi-journey-vehicle absolute left-0 top-1/2 -translate-y-1/2" aria-hidden="true" style={{ color: accent }}>
          {kind === "plane" ? <PlaneIcon /> : <CarIcon />}
        </span>
      </div>
      <p
        className="wi-journey-date font-display-luxury mt-8 text-4xl italic sm:text-5xl"
        style={{ color: accent }}
      >
        {date}
      </p>
    </div>
  );
}

function PlaneIcon() {
  return (
    <svg width="56" height="28" viewBox="0 0 56 28" fill="none" aria-hidden="true">
      <path
        d="M2 16 H18 L26 6 H30 L26 16 H38 L44 10 H48 L44 16 H52 L54 18 H44 L48 24 H44 L38 18 H26 L30 26 H26 L18 18 H2 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg width="56" height="28" viewBox="0 0 56 28" fill="none" aria-hidden="true">
      <path d="M8 18 L14 10 H34 L44 18 H50 V22 H46 A5 5 0 0 1 36 22 H22 A5 5 0 0 1 12 22 H8 Z" fill="currentColor" />
      <circle cx="17" cy="22" r="3.2" fill="currentColor" opacity="0.35" stroke="currentColor" />
      <circle cx="41" cy="22" r="3.2" fill="currentColor" opacity="0.35" stroke="currentColor" />
    </svg>
  );
}
