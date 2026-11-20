import type { WeddingData } from "@/lib/weddings/types";
import Countdown from "../Countdown";
import VenueQR from "../VenueQR";
import VenueRoute from "../VenueRoute";
import Gallery from "../Gallery";
import RsvpForm from "../RsvpForm";
import TemplateOpening from "../TemplateOpening";
import FloralFrame from "../effects/FloralFrame";
import BloomEffect from "../effects/BloomEffect";
import MusicToggle from "../MusicToggle";
import FamilyBlock from "../FamilyBlock";
import ShareBar from "../ShareBar";
import Parallax from "../Parallax";
import { ScrollReveal } from "../HomeMoments";
import Timeline from "../Timeline";
import ScratchReveal from "../ScratchReveal";
import HeroKenBurns from "../HeroKenBurns";
import SignatureMotif from "../effects/SignatureMotif";
import GuestSections from "../GuestSections";
import { AnimatedCalligraphy, FiligreeCorners, OutlinedEditorialWord } from "../LuxuryOrnaments";

/**
 * TEMPLATE 2 — FLORAL ROMANCE (Couture Botanical Conservatory Edition).
 * Blush silk & champagne pearl palette, oval cameo portrait with 0.75px hairline frame,
 * self-drawing SVG floral calligraphy, and outlined rose watermarks.
 */
export default function FloralRomance({ wedding }: { wedding: WeddingData }) {
  const names = `${wedding.couple.bride} & ${wedding.couple.groom}`;

  return (
    <div className="font-body-luxury min-h-screen bg-[#fdf7f5] text-[#4a252a] selection:bg-[#e8a0b4] selection:text-[#4a252a]">
      <TemplateOpening wedding={wedding} />
      {wedding.music?.enabled && wedding.sections?.music !== false && (
        <MusicToggle src={wedding.music.src} />
      )}

      {/* Botanical Conservatory Hero */}
      <header className="relative overflow-hidden px-6 pt-20 pb-20 text-center md:pt-28 md:pb-28">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 18% 15%, rgba(232,160,180,0.22), transparent 45%), radial-gradient(circle at 82% 20%, rgba(212,175,55,0.12), transparent 45%), radial-gradient(circle at 50% 80%, rgba(232,160,180,0.18), transparent 55%)",
          }}
        />
        <SignatureMotif motif="butterfly" className="pointer-events-none absolute right-10 top-28 hidden h-14 w-20 text-[#c87d8a]/55 md:block" />
        <svg
          className="wi-sway pointer-events-none absolute left-6 top-6 hidden h-28 w-28 text-[#c87d8a]/35 md:block"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.85"
          aria-hidden="true"
        >
          <path d="M5 95 C5 45, 45 5, 95 5" />
          <path d="M25 60 C15 45, 25 25, 45 25 C45 45, 35 55, 25 60 Z" />
          <path d="M60 25 C45 15, 25 25, 25 45" />
          <circle cx="52" cy="18" r="2" fill="currentColor" />
          <circle cx="18" cy="52" r="2" fill="currentColor" />
        </svg>
        <svg
          className="wi-sway wi-sway--right pointer-events-none absolute right-6 top-6 hidden h-28 w-28 text-[#c87d8a]/35 md:block"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.85"
          aria-hidden="true"
        >
          <path d="M5 95 C5 45, 45 5, 95 5" />
          <path d="M25 60 C15 45, 25 25, 45 25 C45 45, 35 55, 25 60 Z" />
          <path d="M60 25 C45 15, 25 25, 25 45" />
          <circle cx="52" cy="18" r="2" fill="currentColor" />
          <circle cx="18" cy="52" r="2" fill="currentColor" />
        </svg>

        <div className="wi-hero-exit relative mx-auto max-w-4xl">
          <p className="wi-fadeup wi-fadeup--1 text-[11px] uppercase tracking-[0.34em] text-[#a65c6b]">
            {wedding.blessing ?? "Together with our beloved families"}
          </p>

          <p className="wi-fadeup wi-fadeup--1 font-script-luxury mt-3 text-4xl sm:text-5xl text-[#c87d8a]">
            Love in Full Bloom
          </p>

          {/* Oval Cameo Botanical Portrait with Delicate Hairline Frame */}
          <div className="wi-fadeup wi-fadeup--2 relative mx-auto mt-8 max-w-md rounded-[3.5rem] bg-white p-2.5 shadow-[0_32px_80px_-24px_rgba(180,95,115,0.24),inset_0_0_0_0.75px_rgba(217,138,156,0.45)]">
            <FloralFrame color="#c87d8a" leaf="#7ba05b" />
            <HeroKenBurns className="relative overflow-hidden rounded-[3rem] shadow-[inset_0_0_0_0.5px_rgba(217,138,156,0.35)]">
              <Parallax depth={10}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={wedding.couple.photo}
                  alt={names}
                  className="aspect-[4/5] w-full object-cover"
                />
              </Parallax>
            </HeroKenBurns>
          </div>

          <div className="relative mt-6 sm:mt-9">
            <BloomEffect size={280} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
            <h1
            className="relative font-display-luxury italic font-normal text-[#4a252a] leading-[1.04]"
            style={{ fontSize: "clamp(2.85rem, 6.8vw, 5.5rem)" }}
          >
            <span className="wi-mask wi-name-mask">
              <span className="wi-line wi-line--1 wi-rose-shimmer wi-couple-heading">{wedding.couple.bride}</span>
            </span>
            <span className="my-1 block font-script-luxury text-4xl text-[#c87d8a] not-italic">
              &amp;
            </span>
            <span className="wi-mask wi-name-mask">
              <span className="wi-line wi-line--2 wi-rose-shimmer wi-couple-heading">{wedding.couple.groom}</span>
            </span>
          </h1>
          </div>

          <AnimatedCalligraphy color="#c87d8a" variant="floral" className="mt-4" />

          <p className="wi-fadeup wi-fadeup--3 mt-3 font-display-luxury italic text-2xl text-[#a65c6b]">
            {wedding.couple.weddingDateDisplay}
          </p>
          {wedding.hashtag && (
            <p className="wi-fadeup wi-fadeup--4 mt-2 text-xs uppercase tracking-[0.28em] text-[#b36a7a]">
              {wedding.hashtag}
            </p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 pb-28 space-y-24">
        <ScrollReveal>
          <FamilyBlock wedding={wedding} tone="floral" />
        </ScrollReveal>

        {wedding.couple.loveStory && (
          <ScrollReveal>
            <section
              aria-label="Love story"
              className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-[#fff9fa] to-[#fceef1] p-8 sm:p-12 text-center shadow-[0_24px_60px_-24px_rgba(168,90,110,0.16),inset_0_0_0_0.75px_rgba(217,138,156,0.4)]"
            >
              <FiligreeCorners color="rgba(200,125,138,0.45)" />
              <p className="font-script-luxury text-4xl text-[#c87d8a]">How It All Began</p>
              <h2 className="font-display-luxury mt-1 text-3xl sm:text-4xl italic text-[#4a252a]">
                Our Love Story
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#6b3a3a]/90">
                {wedding.couple.loveStory}
              </p>
            </section>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <div className="mb-10">
            <ScratchReveal wedding={wedding} />
          </div>
          <section aria-label="Countdown" className="text-center">
            <OutlinedEditorialWord
              watermark="FOREVER"
              eyebrow="Counting Every Petal"
              title="Until We Say “I Do”"
              tone="rose"
            />
            <div className="mt-8">
              <Countdown target={wedding.couple.countdownDate} variant="floral" />
            </div>
          </section>
        </ScrollReveal>

        <section aria-label="Events">
          <ScrollReveal className="mb-12">
            <OutlinedEditorialWord
              watermark="EVENTS"
              eyebrow="Wedding Functions"
              title="When & Where We Celebrate"
              tone="rose"
            />
          </ScrollReveal>
          <Timeline events={wedding.events} couple={wedding.couple} tone="floral" accent="#c87d8a" surface="#fdf7f5" />
        </section>

        {wedding.sections?.gallery !== false && (
          <ScrollReveal>
            <section aria-label="Gallery">
              <div className="mb-10">
                <OutlinedEditorialWord
                  watermark="MEMORIES"
                  eyebrow="Captured in Sunlight"
                  title="Moments in Bloom"
                  tone="rose"
                />
              </div>
              <Gallery images={wedding.gallery} variant="floral" />
            </section>
          </ScrollReveal>
        )}

        {wedding.venue && wedding.sections?.venue !== false && (
          <ScrollReveal>
            <section
              aria-label="Venue"
              className="relative rounded-[2.5rem] bg-white p-8 sm:p-12 text-center shadow-[0_24px_60px_-24px_rgba(168,90,110,0.16),inset_0_0_0_0.75px_rgba(217,138,156,0.4)]"
            >
              <FiligreeCorners color="rgba(200,125,138,0.45)" />
              <p className="font-script-luxury text-3xl text-[#c87d8a]">The Sanctuary</p>
              <h2 className="font-display-luxury mt-1 text-3xl sm:text-4xl italic text-[#4a252a]">
                {wedding.venue.name}
              </h2>
              <p className="mt-2 text-sm text-[#7d5259]">{wedding.venue.address}</p>
              {wedding.venue.travel && (
                <p className="mx-auto mt-3 max-w-xl text-sm text-[#7d5259]/85">
                  {wedding.venue.travel}
                </p>
              )}
              {wedding.venue.hotels && wedding.venue.hotels.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {wedding.venue.hotels.map((h) => (
                    <span
                      key={h}
                      className="rounded-full bg-[#fdf7f5] px-4 py-1.5 text-xs text-[#6b3a3a] shadow-[inset_0_0_0_0.75px_rgba(217,138,156,0.4)]"
                    >
                      ❀ {h}
                    </span>
                  ))}
                </div>
              )}
              <a
                href={`https://maps.google.com/?q=${wedding.venue.mapQuery}`}
                target="_blank"
                rel="noreferrer"
                className="wi-action-lift mt-7 inline-flex items-center gap-2 rounded-full bg-[#4a252a] px-7 py-3 text-xs font-medium uppercase tracking-[0.22em] text-white"
              >
                <span>Open Conservatory Map</span>
                <span aria-hidden="true">↗</span>
              </a>
              <VenueQR mapQuery={wedding.venue.mapQuery} />
                    <VenueRoute mapQuery={wedding.venue.mapQuery} accent="#c87d8a" />
            </section>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <GuestSections wedding={wedding} />
        </ScrollReveal>

{wedding.sections?.rsvp !== false && (
          <ScrollReveal>
            <section
              aria-label="RSVP"
              className="relative rounded-[2.5rem] bg-white/95 p-8 sm:p-12 shadow-[0_24px_60px_-24px_rgba(168,90,110,0.18),inset_0_0_0_0.75px_rgba(217,138,156,0.4)]"
            >
              <FiligreeCorners color="rgba(200,125,138,0.45)" />
              <div className="mb-8">
                <OutlinedEditorialWord
                  watermark="RSVP"
                  eyebrow="With Warm Regards"
                  title="Will You Join Our Celebration?"
                  tone="rose"
                />
              </div>
              <RsvpForm wedding={wedding} variant="floral" />
            </section>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <ShareBar wedding={wedding} />
        </ScrollReveal>
      </main>

      <footer className="border-t border-[#ebd0d7] bg-[#faf0ed] px-6 py-14 text-center">
        <p className="font-script-luxury wi-couple-heading text-4xl text-[#c87d8a]">{names}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.28em] text-[#8f4c5a]">
          {wedding.couple.weddingDateDisplay}
        </p>
      </footer>
    </div>
  );
}
