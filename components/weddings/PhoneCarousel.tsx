"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import type { TemplateDefinition } from "@/lib/weddings/types";
import { demoWeddingFor } from "@/lib/weddings/sample-data";
import { whatsappLink } from "@/lib/weddings/site-config";
import MiniInvite from "./MiniInvite";

const AUTOPLAY_MS = 10000;
const SHOWCASE_DOWN_MS = 16000;
const SHOWCASE_HOLD_MS = 1200;
const SHOWCASE_UP_MS = 2600;
const SHOWCASE_REST_MS = 1000;
const IDLE_RESUME_MS = 8000;
const LOOP_PADDING = 2;
// Middle template (Neelam Blue) is the default focus.
const DEFAULT_INDEX = 2;

/**
 * PhoneCarousel — 5 templates in phone mockups with featherweight live-DOM
 * previews (MiniInvite: real names/events/venue/photos, template palette +
 * fonts, phone-scale type). No iframes, no intervals per slide.
 *
 * Gestures: scroll area uses touch-action:pan-y → vertical pans scroll the
 * preview natively, horizontal pans drive the carousel (axis-locked).
 * Auto-advance moves left-to-right through a padded loop; interaction pauses,
 * then resumes when idle. Active phone auto-tours vertically.
 */
export default function PhoneCarousel({ templates }: { templates: TemplateDefinition[] }) {
  const n = templates.length;
  const padding = Math.min(LOOP_PADDING, n);
  const [position, setPosition] = useState(() => (n ? padding + (DEFAULT_INDEX % n) : 0));
  const [dragPx, setDragPx] = useState(0);
  const [snapping, setSnapping] = useState(true);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
  const [idle, setIdle] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const scrolls = useRef<Array<HTMLDivElement | null>>([]);
  const touch = useRef<{ x: number; y: number; locked: "h" | "v" | null } | null>(null);
  const idleTimer = useRef<number | undefined>(undefined);
  const index = n ? ((position - padding) % n + n) % n : 0;

  const go = useCallback((i: number) => {
    setPosition(i);
    setDragPx(0);
  }, []);

  const step = useCallback((delta: number) => {
    setPosition((current) => current + delta);
    setDragPx(0);
  }, []);

  const goToTemplate = useCallback((targetIndex: number) => {
    const canonical = padding + targetIndex;
    const end = n + padding * 2;
    const candidates = [canonical - n, canonical, canonical + n].filter(
      (candidate) => candidate >= 0 && candidate < end
    );
    const closest = candidates.reduce((best, candidate) =>
      Math.abs(candidate - position) < Math.abs(best - position) ? candidate : best
    );
    go(closest);
  }, [go, n, padding, position]);

  const snapPosition = useCallback((nextPosition: number) => {
    setSnapping(true);
    setPosition(nextPosition);
    setDragPx(0);
  }, []);

  const poke = useCallback(() => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), IDLE_RESUME_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(idleTimer.current), []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const seen = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    seen.observe(el);
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      seen.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const [x, setX] = useState(0);
  const center = useCallback(() => {
    const vp = viewport.current;
    const tr = track.current;
    if (!vp || !tr) return;
    const child = tr.children[position] as HTMLElement | undefined;
    if (!child) return;
    setX(vp.clientWidth / 2 - (child.offsetLeft + child.offsetWidth / 2));
  }, [position]);
  useLayoutEffect(() => {
    center();
    if (!snapping) return;
    let firstFrame = 0;
    let secondFrame = 0;
    firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setSnapping(false));
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [center, snapping]);
  useEffect(() => {
    window.addEventListener("resize", center);
    return () => window.removeEventListener("resize", center);
  }, [center]);

  // Carousel auto-advance (pausable, never under reduced motion).
  useEffect(() => {
    if (reduced || !inView || hidden || hover || !idle) return;
    const t = window.setInterval(() => step(-1), AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [reduced, inView, hidden, hover, idle, step]);

  // Vertical showcase tour inside the ACTIVE phone only.
  useEffect(() => {
    if (reduced || !inView || hidden || !idle) return;
    let raf = 0;
    const run = () => {
      const el = scrolls.current[position];
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 40) return;
      const t0 = performance.now();
      const total = SHOWCASE_DOWN_MS + SHOWCASE_HOLD_MS + SHOWCASE_UP_MS + SHOWCASE_REST_MS;
      const step = (now: number) => {
        const t = (now - t0) % total;
        let y: number;
        if (t < SHOWCASE_DOWN_MS) y = (max * t) / SHOWCASE_DOWN_MS;
        else if (t < SHOWCASE_DOWN_MS + SHOWCASE_HOLD_MS) y = max;
        else if (t < SHOWCASE_DOWN_MS + SHOWCASE_HOLD_MS + SHOWCASE_UP_MS) {
          const u = (t - SHOWCASE_DOWN_MS - SHOWCASE_HOLD_MS) / SHOWCASE_UP_MS;
          const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
          y = max * (1 - e);
        } else y = 0;
        el.scrollTop = y;
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    run();
    return () => cancelAnimationFrame(raf);
  }, [position, inView, hidden, idle, reduced]);

  // Horizontal drag with axis lock (vertical pans stay native → preview).
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, locked: null };
  };
  const onTouchMove = (e: React.TouchEvent, i: number) => {
    const t = touch.current;
    if (!t || i !== position) return;
    const dx = e.touches[0].clientX - t.x;
    const dy = e.touches[0].clientY - t.y;
    if (!t.locked) {
      if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
      t.locked = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
      if (t.locked === "h") poke();
    }
    if (t.locked === "h") setDragPx(dx);
  };
  const onTouchEnd = (i: number) => {
    if (i !== position) return;
    if (Math.abs(dragPx) > 60) step(dragPx < 0 ? 1 : -1);
    else setDragPx(0);
    touch.current = null;
  };

  const slides = [
    ...templates.slice(-padding).map((template, i) => ({
      template,
      logicalIndex: n - padding + i,
      isClone: true,
    })),
    ...templates.map((template, logicalIndex) => ({ template, logicalIndex, isClone: false })),
    ...templates.slice(0, padding).map((template, logicalIndex) => ({ template, logicalIndex, isClone: true })),
  ];
  const active = templates[index];
  if (!active) return null;
  const sample = demoWeddingFor(active.slug);

  return (
    <section
      ref={root}
      aria-label="Template showcase"
      className="mt-10"
      role="region"
      aria-roledescription="carousel"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        ref={viewport}
        className="overflow-hidden py-4"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            step(1);
            poke();
          }
          if (e.key === "ArrowLeft") {
            step(-1);
            poke();
          }
        }}
      >
        <div
          ref={track}
          className="flex items-center gap-6 sm:gap-10"
          onTransitionEnd={(e) => {
            if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
            if (position < padding) snapPosition(position + n);
            else if (position >= padding + n) snapPosition(position - n);
          }}
          style={{
            transform: `translateX(${x + dragPx}px)`,
            transition:
              dragPx !== 0 || snapping ? "none" : "transform 550ms cubic-bezier(0.22,1,0.36,1)",
            willChange: "transform",
          }}
        >
          {slides.map(({ template: t, logicalIndex, isClone }, physicalIndex) => {
            const isActive = physicalIndex === position;
            const dist = Math.abs(physicalIndex - position);
            const wedding = demoWeddingFor(t.slug);
            return (
              <div
                key={`${t.slug}-${physicalIndex}`}
                role={isClone ? undefined : "group"}
                aria-hidden={isClone}
                aria-roledescription={isClone ? undefined : "slide"}
                aria-label={isClone ? undefined : `${logicalIndex + 1} of ${n}: ${t.name}`}
                className="shrink-0"
                style={{
                  width: "min(82vw, 300px)",
                  opacity: isActive ? 1 : dist === 1 ? 0.6 : 0.25,
                  transform: isActive ? "scale(1)" : "scale(0.88)",
                  transition:
                    "transform 550ms cubic-bezier(0.22,1,0.36,1), opacity 550ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                {/* Phone frame */}
                <div className="relative rounded-[3rem] bg-[#0b0b10] p-[10px] shadow-[0_40px_90px_-30px_rgba(11,25,44,0.55),inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                  <span aria-hidden="true" className="absolute -left-[2px] top-24 h-10 w-[3px] rounded-full bg-[#2a2a32]" />
                  <span aria-hidden="true" className="absolute -left-[2px] top-40 h-14 w-[3px] rounded-full bg-[#2a2a32]" />
                  <span aria-hidden="true" className="absolute -right-[2px] top-32 h-16 w-[3px] rounded-full bg-[#2a2a32]" />
                  <div className="relative overflow-hidden rounded-[2.4rem] bg-white" style={{ aspectRatio: "9 / 18.4" }}>
                    <span aria-hidden="true" className="absolute left-1/2 top-2.5 z-20 h-[22px] w-[92px] -translate-x-1/2 rounded-full bg-[#0b0b10]" />
                    <div
                      ref={(el) => {
                        scrolls.current[physicalIndex] = el;
                      }}
                      className="absolute inset-0 overscroll-contain overflow-y-auto"
                      style={{ touchAction: "pan-y", scrollbarWidth: "none" }}
                      onTouchStart={onTouchStart}
                      onTouchMove={(e) => onTouchMove(e, physicalIndex)}
                      onTouchEnd={() => onTouchEnd(physicalIndex)}
                      onPointerDown={isActive ? poke : undefined}
                      onWheel={isActive ? poke : undefined}
                      role={isActive ? "log" : undefined}
                      aria-label={isActive ? `${t.name} preview, scrollable` : undefined}
                    >
                      <MiniInvite template={t} wedding={wedding} />
                      {!isActive && (
                        <button
                          aria-label={`Show ${t.name}`}
                          tabIndex={isClone ? -1 : undefined}
                          onClick={() => {
                            goToTemplate(logicalIndex);
                            poke();
                          }}
                          className="absolute inset-0 z-10 min-h-[44px] w-full cursor-pointer"
                        />
                      )}
                    </div>
                  </div>
                  <span aria-hidden="true" className="mx-auto mt-2 block h-1 w-24 rounded-full bg-white/25" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info panel */}
      <div key={active.slug} className="wi-phone-info mx-auto mt-6 max-w-xl px-6 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#8a6d2b]">
          0{index + 1} · {active.category}
        </p>
        <h3 className="font-display-luxury mt-2 text-4xl font-normal italic text-[#1c1917]">{active.name}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#6b6259]">{active.description}</p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={`/wedding-invitations/${sample.slug}`}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#1c1917] px-8 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-black sm:w-auto"
          >
            View Demo <span aria-hidden="true">→</span>
          </Link>
          <a
            href={whatsappLink(`Hi Inviteo! I like the ${active.name} design. My wedding date is…`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#1c1917]/15 bg-white px-8 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#1c1917] transition hover:border-[#1c1917]/40 sm:w-auto"
          >
            Choose This Template
          </a>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-7 flex items-center justify-center gap-4">
        <button
          onClick={() => {
            step(-1);
            poke();
          }}
          aria-label="Previous template"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-lg text-[#1c1917] transition hover:border-black/30"
        >
          ←
        </button>
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose template">
          {templates.map((t, i) => (
            <button
              key={t.slug}
              role="tab"
              aria-selected={i === index}
              aria-label={`Show ${t.name}`}
              onClick={() => {
                goToTemplate(i);
                poke();
              }}
              className="flex min-h-[44px] min-w-[28px] items-center justify-center"
            >
              <span
                aria-hidden="true"
                className="block h-[8px] rounded-full transition-all duration-300"
                style={{
                  width: i === index ? 28 : 8,
                  background: i === index ? "#1c1917" : "rgba(28,25,23,0.2)",
                }}
              />
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            step(1);
            poke();
          }}
          aria-label="Next template"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1c1917] text-lg text-white transition hover:bg-black"
        >
          →
        </button>
        <span className="ml-1 text-xs tracking-[0.2em] text-[#6b6259]" aria-hidden="true">
          0{index + 1} / 0{n}
        </span>
      </div>
    </section>
  );
}
