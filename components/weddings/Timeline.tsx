"use client";

import EventCard, { type EventCardVariant } from "./EventCard";
import type { WeddingData } from "@/lib/weddings/types";
import { ScrollReveal } from "./HomeMoments";

/**
 * Chapter deck — no spine. The first card deals from the top,
 * then cards alternate in from the left and the right.
 */
export default function Timeline({
  events,
  couple,
  tone,
  accent,
}: {
  events: WeddingData["events"];
  couple: WeddingData["couple"];
  tone: EventCardVariant;
  accent: string;
  surface?: string;
}) {
  if (!events.length) return null;

  const dealFrom = (i: number): "top" | "left" | "right" =>
    i === 0 ? "top" : i % 2 === 1 ? "left" : "right";

  return (
    <div className="relative mx-auto max-w-xl">
      <ScrollReveal className="mb-8 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.28em]" style={{ color: accent }}>
          {String(events.length).padStart(2, "0")} chapters
        </p>
        <p className="font-display-luxury mt-2 text-2xl italic opacity-80">
          Follow the celebration, moment by moment
        </p>
      </ScrollReveal>

      <ol className="relative">
        {events.map((e, i) => {
          const from = dealFrom(i);
          const seat = from === "left" ? "sm:mr-10" : from === "right" ? "sm:ml-10" : "";
          return (
            <li key={e.id} className={`relative ${i === 0 ? "" : "mt-5"} ${seat}`} style={{ zIndex: i + 1 }}>
              <ScrollReveal delay={Math.min(i, 5) * 90} from={from}>
                <EventCard event={e} couple={couple} tone={tone} index={i} />
              </ScrollReveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
