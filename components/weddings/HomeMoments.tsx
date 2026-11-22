"use client";

import { useEffect, useRef } from "react";

/**
 * Dealt moment 1 — word-highlight (statement).
 * Scroll-scrubbed: words light up from muted to ink as the statement
 * travels through the viewport, inside this section only.
 * Reduced motion / no-JS: the whole statement stands in ink.
 */
export function WordHighlight({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.querySelectorAll(".wi-w").forEach((w) => w.classList.add("on"));
      return;
    }
    const spans = Array.from(el.querySelectorAll<HTMLElement>(".wi-w"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (rect.height + vh * 0.15)));
      spans.forEach((s, i) => s.classList.toggle("on", p > ((i + 1) / spans.length) * 0.95));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p ref={ref} className={`wi-hl ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="wi-w">{w}{i < words.length - 1 ? " " : ""}</span>
      ))}
    </p>
  );
}

/**
 * Dealt moment 2 — picture-develops (film look, enter-once).
 * The photograph comes up out of a faint print: darks first, then colour.
 * Runs once via IntersectionObserver; still image under reduced motion.
 */
export function DevelopingPhoto({
  src,
  alt,
  className = "",
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`wi-dev ${className}`}>
      <div className="wi-dev-print" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className="wi-dev-img" />
    </div>
  );
}

/**
 * ScrollReveal — GPU-safe IntersectionObserver reveal wrapper.
 * Gently fades and lifts content into place once as it enters viewport.
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  from = "bottom",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Entrance direction. Chapter cards use top, then left, then right. */
  from?: "top" | "bottom" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`wi-reveal ${from === "bottom" ? "" : `wi-reveal--${from}`} ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

