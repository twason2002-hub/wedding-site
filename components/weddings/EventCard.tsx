"use client";

import { useState } from "react";
import type { WeddingEvent, WeddingData } from "@/lib/weddings/types";
import { downloadICS, googleCalendarUrl, mapsUrl } from "@/lib/weddings/helpers";
import { FiligreeCorners, InteractiveTiltCard } from "./LuxuryOrnaments";
import { CalendarIcon, CheckIcon, MapPinIcon, ShirtIcon } from "./WeddingIcons";

export type EventCardVariant = "light" | "dark" | "royal" | "floral" | "minimal" | "vivah" | "coastal";

export default function EventCard({
  event,
  couple,
  tone = "light",
  index = 0,
}: {
  event: WeddingEvent;
  couple: WeddingData["couple"];
  tone?: EventCardVariant;
  index?: number;
}) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    downloadICS(event, couple);
    setSaved(true);
    setTimeout(() => setSaved(false), 2600);
  };

  const numStr = `0${index + 1}`;

  if (tone === "royal" || tone === "dark") {
    return (
      <InteractiveTiltCard intensity={3}>
        <article className="wi-bezel-dark group relative overflow-hidden">
          <div className="wi-bezel-dark-inner relative bg-gradient-to-b from-[#200e09] to-[#150805] p-7 sm:p-10 text-left">
            <FiligreeCorners color="rgba(212,175,55,0.45)" />
            <span
              aria-hidden="true"
              className="font-regal wi-text-outline-gold pointer-events-none absolute right-6 top-4 text-6xl sm:text-8xl leading-none opacity-30"
            >
              {numStr}
            </span>
            <div className="relative z-10 grid gap-7 md:grid-cols-[1.25fr_1fr] md:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-regal text-[11px] tracking-[0.34em] text-[#d4af37]">
                    ROYAL CHAPTER {numStr}
                  </span>
                  <span className="h-[0.5px] flex-1 bg-gradient-to-r from-[#d4af37]/35 to-transparent" />
                </div>
                <h3 className="font-display-luxury mt-3 text-3xl sm:text-4xl font-normal italic text-[#f9ebd2] text-balance">
                  {event.name}
                </h3>
                <p className="mt-2 font-regal text-xs uppercase tracking-[0.25em] text-[#d4af37]">
                  {event.date} &nbsp;·&nbsp; {event.time}
                </p>
                <div className="mt-4 space-y-1 text-sm text-[#f3e5c3]/85">
                  <p className="font-medium text-[#f9ebd2]">{event.venue}</p>
                  <p className="text-xs text-[#f3e5c3]/60">{event.address}</p>
                </div>
                {event.description && (
                  <p className="mt-3 text-sm leading-relaxed text-[#f3e5c3]/75">{event.description}</p>
                )}
                {event.dressCode && (
                  <div className="mt-4 inline-flex max-w-full items-start gap-2 rounded-2xl bg-[#d4af37]/[0.08] px-4 py-2 text-left text-xs text-[#e8cf8f] shadow-[inset_0_0_0_0.5px_rgba(212,175,55,0.35)]">
                    <ShirtIcon size={13} className="mt-0.5 shrink-0" />
                    <span className="shrink-0">Attire:</span>
                    <span className="font-medium">{event.dressCode}</span>
                  </div>
                )}
                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  <button
                    onClick={handleSave}
                    className="wi-action-lift inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#9b7318] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#170906] sm:w-auto"
                  >
                    {saved ? <CheckIcon size={14} /> : <CalendarIcon size={14} />}
                    <span>{saved ? "Saved to Calendar" : "Save the Date"}</span>
                  </button>
                  <a
                    href={googleCalendarUrl(event, couple)}
                    target="_blank"
                    rel="noreferrer"
                    className="wi-action-lift inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#f3e5c3] shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.35)] sm:w-auto"
                  >
                    <CalendarIcon size={14} />
                    <span>Google Calendar</span>
                  </a>
                  <a
                    href={mapsUrl(event.mapQuery)}
                    target="_blank"
                    rel="noreferrer"
                    className="wi-action-lift inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#f3e5c3] shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.35)] sm:w-auto"
                  >
                    <MapPinIcon size={14} />
                    <span>Location</span>
                  </a>
                </div>
              </div>
              {event.image && (
                <div className="wi-zoom overflow-hidden rounded-2xl shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.35)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.image}
                    alt={event.name}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </article>
      </InteractiveTiltCard>
    );
  }

  if (tone === "floral") {
    return (
      <InteractiveTiltCard intensity={3}>
        <article className="group relative overflow-hidden rounded-[2.25rem] bg-white/95 p-7 sm:p-10 shadow-[0_24px_60px_-24px_rgba(168,90,110,0.16),inset_0_0_0_0.75px_rgba(217,138,156,0.4)]">
          <FiligreeCorners color="rgba(200,125,138,0.45)" />
          <span
            aria-hidden="true"
            className="font-display-luxury wi-text-outline-rose pointer-events-none absolute right-7 top-4 text-6xl sm:text-8xl italic leading-none opacity-45"
          >
            {numStr}
          </span>
          <div className="relative z-10 grid gap-7 md:grid-cols-[1fr_1.35fr] md:items-center">
            {event.image && (
              <div className="wi-zoom overflow-hidden rounded-[1.5rem] shadow-[inset_0_0_0_0.75px_rgba(217,138,156,0.35)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.image}
                  alt={event.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            )}
            <div className="text-left">
              <p className="font-script-luxury text-2xl text-[#c87d8a]">Celebration {numStr}</p>
              <h3 className="font-display-luxury mt-1 text-3xl sm:text-4xl font-normal italic text-[#4a252a] text-balance">
                {event.name}
              </h3>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.22em] text-[#a65c6b]">
                {event.date} &nbsp;·&nbsp; {event.time}
              </p>
              <p className="mt-3 font-medium text-[#4a252a]">{event.venue}</p>
              <p className="text-xs text-[#7d5259]">{event.address}</p>
              {event.description && (
                <p className="mt-3 text-sm leading-relaxed text-[#6b3a3a]/85">{event.description}</p>
              )}
              {event.dressCode && (
                <p className="mt-3 inline-flex max-w-full items-start gap-1.5 rounded-2xl bg-[#fdf1f4] px-4 py-2 text-left text-xs italic text-[#9e5262] shadow-[inset_0_0_0_0.75px_rgba(217,138,156,0.4)]">
                  <ShirtIcon size={13} className="mt-0.5 shrink-0" />
                  <span>Palette &amp; Attire: {event.dressCode}</span>
                </p>
              )}
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button
                  onClick={handleSave}
                  className="wi-action-lift inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#4a252a] px-5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white sm:w-auto"
                >
                  {saved ? <CheckIcon size={14} /> : <CalendarIcon size={14} />}
                  <span>{saved ? "Saved" : "Save the Date"}</span>
                </button>
                <div className="flex gap-2">
                  <a
                    href={googleCalendarUrl(event, couple)}
                    target="_blank"
                    rel="noreferrer"
                    className="wi-action-lift inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#4a252a] shadow-[inset_0_0_0_0.75px_rgba(200,125,138,0.45)] sm:flex-none"
                  >
                    <CalendarIcon size={14} />
                    <span>Calendar</span>
                  </a>
                  <a
                    href={mapsUrl(event.mapQuery)}
                    target="_blank"
                    rel="noreferrer"
                    className="wi-action-lift inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#4a252a] shadow-[inset_0_0_0_0.75px_rgba(200,125,138,0.45)] sm:flex-none"
                  >
                    <MapPinIcon size={14} />
                    <span>Map</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </article>
      </InteractiveTiltCard>
    );
  }

  if (tone === "minimal") {
    return (
      <article className="group relative border-t border-[#171513]/12 py-10 px-2 sm:px-4">
        <div className="grid gap-6 sm:grid-cols-[0.6fr_1.4fr] sm:items-start">
          <div>
            <span className="font-display-luxury wi-text-outline-ink block text-5xl leading-none mb-2">
              {numStr}
            </span>
            <p className="font-body-luxury text-xs uppercase tracking-[0.28em] text-[#7c7267]">
              {event.date}
            </p>
            <p className="mt-1 font-display-luxury text-2xl italic text-[#171513]">{event.time}</p>
          </div>
          <div>
            <h3 className="font-display-luxury text-3xl sm:text-4xl font-light tracking-tight text-[#171513] text-balance">
              {event.name}
            </h3>
            <p className="mt-2 text-sm font-medium text-[#171513]">{event.venue}</p>
            <p className="text-xs text-[#7c7267]">{event.address}</p>
            {event.description && (
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#4a453f]">{event.description}</p>
            )}
            {event.dressCode && (
              <p className="mt-3 text-[11px] uppercase leading-relaxed tracking-[0.25em] text-[#7c7267]">
                Dress Code — {event.dressCode}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2.5 sm:col-span-2 sm:flex-row sm:flex-wrap">
            <button
              onClick={handleSave}
              className="wi-action-lift inline-flex min-h-[44px] w-full items-center justify-center gap-2 bg-[#171513] px-5 py-2 text-[11px] uppercase tracking-[0.25em] text-white sm:w-auto"
            >
              {saved ? <CheckIcon size={13} /> : <CalendarIcon size={13} />}
              <span>{saved ? "Saved" : "ICS"}</span>
            </button>
            <a
              href={googleCalendarUrl(event, couple)}
              target="_blank"
              rel="noreferrer"
              className="wi-action-lift inline-flex min-h-[44px] w-full items-center justify-center gap-2 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-[#171513] shadow-[inset_0_0_0_0.75px_rgba(23,21,19,0.28)] sm:w-auto"
            >
              <CalendarIcon size={13} />
              <span>Google</span>
            </a>
            <a
              href={mapsUrl(event.mapQuery)}
              target="_blank"
              rel="noreferrer"
              className="wi-action-lift inline-flex min-h-[44px] w-full items-center justify-center gap-2 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-[#171513] shadow-[inset_0_0_0_0.75px_rgba(23,21,19,0.28)] sm:w-auto"
            >
              <MapPinIcon size={13} />
              <span>Map</span>
            </a>
          </div>
        </div>
      </article>
    );
  }

  if (tone === "vivah") {
    return (
      <InteractiveTiltCard intensity={3}>
        <article className="wi-frame-fine relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#590e11] via-[#45090b] to-[#300507] p-7 sm:p-9 shadow-2xl">
          <FiligreeCorners color="rgba(251,191,36,0.55)" />
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f59e0b]/20 pb-3">
            <span className="font-regal text-[11px] uppercase tracking-[0.28em] text-[#fbbf24]">
              ॥ शुभ मुहूर्त {numStr} ॥
            </span>
            <span className="text-xs text-[#fde68a]/80">{event.date}</span>
          </div>
          <h3 className="font-regal mt-4 text-2xl sm:text-3xl text-[#fef3c7] text-balance">{event.name}</h3>
          <p className="mt-1 text-sm font-medium text-[#fbbf24]">{event.time}</p>
          <p className="mt-3 text-sm font-semibold text-[#fef3c7]">{event.venue}</p>
          <p className="text-xs text-[#fef3c7]/70">{event.address}</p>
          {event.description && (
            <p className="mt-3 text-sm leading-relaxed text-[#fef3c7]/80">{event.description}</p>
          )}
          {event.dressCode && (
            <p className="mt-3 inline-flex max-w-full items-start gap-2 rounded-xl bg-[#f59e0b]/10 px-3.5 py-2 text-left text-xs text-[#fde68a] shadow-[inset_0_0_0_0.5px_rgba(245,158,11,0.35)]">
              <ShirtIcon size={13} className="mt-0.5 shrink-0" />
              <span>Attire: {event.dressCode}</span>
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              onClick={handleSave}
              className="wi-action-lift inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#fbbf24] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#380709] sm:w-auto"
            >
              {saved ? <CheckIcon size={14} /> : <CalendarIcon size={14} />}
              <span>{saved ? "Saved" : "Save Muhurtham"}</span>
            </button>
            <a
              href={googleCalendarUrl(event, couple)}
              target="_blank"
              rel="noreferrer"
              className="wi-action-lift inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#fef3c7] shadow-[inset_0_0_0_0.75px_rgba(251,191,36,0.45)] sm:w-auto"
            >
              <CalendarIcon size={14} />
              <span>Calendar</span>
            </a>
            <a
              href={mapsUrl(event.mapQuery)}
              target="_blank"
              rel="noreferrer"
              className="wi-action-lift inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#fef3c7] shadow-[inset_0_0_0_0.75px_rgba(251,191,36,0.45)] sm:w-auto"
            >
              <MapPinIcon size={14} />
              <span>Mandapam Map</span>
            </a>
          </div>
        </article>
      </InteractiveTiltCard>
    );
  }

  // Coastal / Default light luxury
  return (
    <InteractiveTiltCard intensity={3}>
      <article className="wi-bezel">
        <div className="wi-bezel-inner relative p-7 sm:p-9 text-left">
          <FiligreeCorners color="rgba(184,107,67,0.4)" />
          <span
            aria-hidden="true"
            className="font-display-luxury wi-text-outline-ink pointer-events-none absolute right-6 top-4 text-6xl sm:text-7xl italic leading-none opacity-40"
          >
            {numStr}
          </span>
          <div className="relative z-10 grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#0f353e]/[0.06] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#0f353e]">
                <span>Day {numStr}</span>
                <span>·</span>
                <span>{event.date}</span>
              </div>
              <h3 className="font-display-luxury mt-3 text-3xl sm:text-4xl font-normal italic text-[#0f353e] text-balance">
                {event.name}
              </h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#0f353e]/70">
                {event.time}
              </p>
              <p className="mt-3 font-medium text-[#0f353e]">{event.venue}</p>
              <p className="text-xs text-[#0f353e]/65">{event.address}</p>
              {event.description && (
                <p className="mt-3 text-sm leading-relaxed text-[#0f353e]/80">{event.description}</p>
              )}
              {event.dressCode && (
                <p className="mt-3 inline-flex max-w-full items-start gap-1.5 text-left text-xs italic text-[#0f353e]/70">
                  <ShirtIcon size={13} className="mt-0.5 shrink-0" />
                  <span>Resort Dress Code: {event.dressCode}</span>
                </p>
              )}
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button
                  onClick={handleSave}
                  className="wi-action-lift inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#0f353e] px-5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white sm:w-auto"
                >
                  {saved ? <CheckIcon size={14} /> : <CalendarIcon size={14} />}
                  <span>{saved ? "Saved" : "Add to Itinerary"}</span>
                </button>
                <a
                  href={googleCalendarUrl(event, couple)}
                  target="_blank"
                  rel="noreferrer"
                  className="wi-action-lift inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#0f353e] shadow-[inset_0_0_0_0.75px_rgba(15,53,62,0.28)] sm:w-auto"
                >
                  <CalendarIcon size={14} />
                  <span>Google</span>
                </a>
                <a
                  href={mapsUrl(event.mapQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="wi-action-lift inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#0f353e] shadow-[inset_0_0_0_0.75px_rgba(15,53,62,0.28)] sm:w-auto"
                >
                  <MapPinIcon size={14} />
                  <span>Location</span>
                </a>
              </div>
            </div>
            {event.image && (
              <div className="wi-zoom overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.image}
                  alt={event.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </article>
    </InteractiveTiltCard>
  );
}
