"use client";

import { useEffect, useRef, useState } from "react";
import EventCard, { type EventCardVariant } from "./EventCard";
import type { WeddingData } from "@/lib/weddings/types";
import { ScrollReveal } from "./HomeMoments";
import { prefersReducedMotion } from "./effects/gsap-setup";

/**
 * Timeline — centered column with scroll-drawn spine and stacked chapters (sm+).
 */
const STACK_TOP = 76;
const STACK_PEEK = 28;

export default function Timeline({
  events,
  couple,
  tone,
  accent,
  surface,
}: {
  events: WeddingData["events"];
  couple: WeddingData["couple"];
  tone: EventCardVariant;
  accent: string;
  surface: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const listWrap = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (line.current) line.current.style.transform = "scaleY(1)";
      return;
    }
    let raf = 0;
    let visible = true;

    const tick = () => {
      if (!visible || document.hidden) {
        raf = 0;
        return;
      }
      const el = listWrap.current;
      const bar = line.current;
      if (el && bar) {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.min(1, Math.max(0, (vh * 0.72 - r.top) / r.height));
        bar.style.transform = `scaleY(${p})`;
      }
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      setOn(visible);
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    if (root.current) io.observe(root.current);

    raf = requestAnimationFrame(tick);
    const onVis = () => {
      if (!document.hidden && visible && !raf) raf = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  if (!events.length) return null;

  const n = String(events.length).padStart(2, "0");

  return (
    <div ref={root} className="relative mx-auto max-w-2xl">
      <ScrollReveal className="mb-12 text-center">
        <p
          className="text-[11px] font-medium uppercase tracking-[0.34em]"
          style={{ color: accent }}
        >
          {n} chapters
        </p>
        <p className="font-display-luxury mt-2 text-2xl italic opacity-80">
          Follow the celebration, moment by moment
        </p>
      </ScrollReveal>

      <div ref={listWrap} className="relative">
        <div aria-hidden="true" className="absolute left-1/2 top-2 bottom-2 hidden w-[2px] -translate-x-1/2 rounded-full bg-current opacity-15 sm:block" style={{ color: accent }} />
        <div aria-hidden="true" className="absolute left-4 top-2 bottom-2 w-[2px] rounded-full bg-current opacity-15 sm:hidden" style={{ color: accent }} />
        <div
          ref={line}
          aria-hidden="true"
          className="absolute top-2 bottom-2 w-[2px] origin-top rounded-full max-sm:left-4 sm:left-1/2 sm:-translate-x-1/2"
          style={{ background: accent, transform: "scaleY(0)", opacity: on ? 1 : 0, transition: "opacity 400ms" }}
        />

        <ol className="space-y-12 sm:space-y-16">
          {events.map((e, i) => (
            <li
              key={e.id}
              className="chap-stack relative pl-12 sm:pl-0 sm:pt-6 sm:text-center"
              style={{ top: STACK_TOP + i * STACK_PEEK }}
            >
              <span
                aria-hidden="true"
                className="absolute left-[3px] top-1 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold sm:left-1/2 sm:top-2 sm:-translate-x-1/2 sm:translate-y-0"
                style={{
                  background: surface,
                  color: accent,
                  boxShadow: `inset 0 0 0 1.5px ${accent}, 0 6px 18px -6px rgba(0,0,0,0.3)`,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <ScrollReveal delay={Math.min(i, 4) * 110} from="top">
                <div className="text-left">
                  <EventCard event={e} couple={couple} tone={tone} index={i} />
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ol>
      </div>

      <ScrollReveal className="mt-12 text-center">
        <div className="mx-auto h-[0.75px] w-24 bg-gradient-to-r from-transparent via-current to-transparent opacity-40" style={{ color: accent }} aria-hidden="true" />
        <p className="mt-4 text-xs uppercase tracking-[0.28em] opacity-60">
          …and happily ever after
        </p>
      </ScrollReveal>
    </div>
  );
}