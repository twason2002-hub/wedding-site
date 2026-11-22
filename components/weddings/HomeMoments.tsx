"use client";

import { useEffect, useRef } from "react";
import { watchEarlyReveal } from "./effects/early-reveal";

/**
 * Word highlight — the whole line comes forward once, early.
 * It is not tied to scroll progress, so a fast flick cannot leave words faded.
 */
export function WordHighlight({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>(".wi-w"));
    const show = () => spans.forEach((span) => span.classList.add("on"));
    return watchEarlyReveal(el, show);
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
    return watchEarlyReveal(el, () => el.classList.add("is-in"));
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
    return watchEarlyReveal(el, () => el.classList.add("is-visible"));
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

