"use client";

import { useEffect, useRef, useState } from "react";
import EventCard, { type EventCardVariant } from "./EventCard";
import type { WeddingData } from "@/lib/weddings/types";
import { ScrollReveal } from "./HomeMoments";

/**
 * Timeline — one elegant centered column. A hairline draws with scroll,
 * event chapters fade-rise in with stagger, then stack like playing cards:
 * each chapter sticks below the previous one while the next slides over it.
 * Reuses EventCard (all tones). transform/opacity only; still frame under
 * reduced-motion.
 */
const STACK_TOP = 76;
const STACK_PEEK = 14;
/** How far (px) before its stuck point a card starts dealing/tilting in. */
const DEAL_RANGE = 460;
const COVER_RANGE = 520;
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
  /** Page background behind the timeline — chapter pills + dots sit on it. */
  surface: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const listWrap = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (line.current) line.current.style.transform = "scaleY(1)";
      return;
    }
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      setOn(visible);
      if (visible) tick();
    });
    if (root.current) io.observe(root.current);
    const tick = () => {
      if (!visible || document.hidden) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const el = listWrap.current;
      const bar = line.current;
      if (el && bar) {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.min(1, Math.max(0, (vh * 0.72 - r.top) / r.height));
        bar.style.transform = `scaleY(${p})`;
        // Deck effect: cards deal in with a slight tilt that settles as they
        // stick, then fan-tilt + shrink a touch as the next slides over.
        const items = el.querySelectorAll(":scope > ol > li");
        const smooth = (t: number) => {
          const c = Math.min(1, Math.max(0, t));
          return c * c * (3 - 2 * c);
        };
        items.forEach((li, i) => {
          const card = li.querySelector("article");
          if (!card) return;
          const dir = i % 2 === 0 ? -1 : 1;
          const stick = STACK_TOP + i * STACK_PEEK;
          const top = (li as HTMLElement).getBoundingClientRect().top;
          // 0 far below → 1 stuck.
          const arrived = smooth(1 - (top - stick) / DEAL_RANGE);
          // 0 next far → 1 next covering this card.
          let cover = 0;
          if (i < items.length - 1) {
            const nextTop = items[i + 1].getBoundingClientRect().top;
            cover = smooth(1 - (nextTop - (STACK_TOP + (i + 1) * STACK_PEEK)) / COVER_RANGE);
          }
          const rotate = dir * (2.5 * (1 - arrived) + 1.4 * cover);
          const scale = 1 - 0.045 * cover;
          card.style.transform =
            arrived >= 1 && cover <= 0 ? "" : `rotate(${rotate.toFixed(3)}deg) scale(${scale.toFixed(4)})`;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onVis = () => {
      if (!document.hidden && visible) tick();
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
      {/* Spine — scoped to the chapter list so it never crosses the header */}
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
