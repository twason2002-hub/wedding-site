import type { WeddingData } from "@/lib/weddings/types";
import Countdown from "../Countdown";
import VenueQR from "../VenueQR";
import VenueRoute from "../VenueRoute";
import Gallery from "../Gallery";
import RsvpForm from "../RsvpForm";
import TemplateOpening from "../TemplateOpening";
import FloatingOrnaments from "../effects/FloatingOrnaments";
import AnimatedBorder from "../effects/AnimatedBorder";
import { Paisley } from "../svg/royal";
import FamilyBlock from "../FamilyBlock";
import ShareBar from "../ShareBar";
import Parallax from "../Parallax";
import { ScrollReveal } from "../HomeMoments";
import Timeline from "../Timeline";
import GoldShimmer from "../effects/GoldShimmer";
import HeroKenBurns from "../HeroKenBurns";
import SignatureMotif from "../effects/SignatureMotif";
import JourneyReveal from "../effects/JourneyReveal";
import GuestSections from "../GuestSections";
import { AnimatedCalligraphy, FiligreeCorners, OutlinedEditorialWord } from "../LuxuryOrnaments";
import { HeroDepthLayers } from "../effects/DepthLayers";

/**
 * TEMPLATE 1 — ROYAL HERITAGE (Imperial Rajputana Palace Edition).
 * Deep obsidian-crimson ground, gold foil shimmer, scalloped jharokha arch hero,
 * self-drawing SVG flourishes, outlined display watermarks, and 0.75px hairline frames.
 */
export default function RoyalHeritage({ wedding }: { wedding: WeddingData }) {
  const names = `${wedding.couple.bride} & ${wedding.couple.groom}`;

  return (
    <div className="font-body-luxury min-h-screen bg-[#140806] text-[#f6ead4] selection:bg-[#d4af37] selection:text-[#140806]">
      <TemplateOpening wedding={wedding} />

      {/* Ornate Imperial Frame Hero */}
      <header className="relative overflow-hidden px-6 pt-20 pb-24 text-center md:pt-28 md:pb-32">
        <HeroDepthLayers tone="royal" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 18%, rgba(212,175,55,0.22) 0%, rgba(120,28,28,0.16) 38%, transparent 72%)",
          }}
        />
        {/* Royal paisley ornaments drifting in the hero corners */}
        <SignatureMotif motif="elephant" className="pointer-events-none absolute right-8 top-28 hidden h-16 w-24 text-[#d4af37]/35 md:block" />
        <FloatingOrnaments duration={7} drift={12} className="pointer-events-none absolute left-6 top-24 hidden text-[#d4af37]/50 md:block">
          <Paisley className="h-20 w-20" />
        </FloatingOrnaments>
        <FloatingOrnaments duration={8.5} drift={16} className="pointer-events-none absolute bottom-16 right-6 hidden text-[#d4af37]/40 md:block">
          <span className="block -scale-x-100">
            <Paisley className="h-24 w-24" />
          </span>
        </FloatingOrnaments>

        <svg
          className="pointer-events-none absolute left-1/2 top-24 -translate-x-1/2 h-[420px] w-[420px] text-[#d4af37]/[0.07] sm:h-[640px] sm:w-[640px]"
          viewBox="0 0 200 200"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 3" />
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="64" stroke="currentColor" strokeWidth="0.4" strokeDasharray="5 3" />
          <polygon
            points="100,8 122,72 188,72 134,112 154,178 100,138 46,178 66,112 12,72 78,72"
            stroke="currentColor"
            strokeWidth="0.35"
          />
        </svg>

        <div className="wi-hero-exit relative mx-auto max-w-4xl">
          <p className="wi-fadeup wi-fadeup--1 font-regal text-xs uppercase tracking-[0.34em] text-[#e8cf8f]">
            {wedding.blessing ?? "॥ श्री गणेशाय नमः ॥"}
          </p>
          {wedding.mantra && (
            <p className="wi-fadeup wi-fadeup--1 mx-auto mt-3 max-w-xl font-display-luxury text-base italic text-[#d4af37]/80">
              {wedding.mantra}
            </p>
          )}

          {/* Hairline Filigree Mughal Arch Portrait */}
          <div className="wi-fadeup wi-fadeup--2 relative mx-auto mt-6 max-w-[13.5rem] sm:mt-10 sm:max-w-md rounded-t-full rounded-b-3xl bg-gradient-to-b from-[#d4af37]/35 via-[#d4af37]/10 to-[#d4af37]/25 p-[4px] shadow-[0_35px_90px_-15px_rgba(0,0,0,0.85)]">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute -inset-5 z-0 text-[#d4af37]/30"
              viewBox="0 0 100 140"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                className="wi-arch-draw"
                d="M6 134 L6 50 Q6 6 50 6 Q94 6 94 50 L94 134"
                stroke="currentColor"
                strokeWidth="0.8"
                pathLength={1}
              />
            </svg>
            <div className="relative overflow-hidden rounded-t-full rounded-b-[calc(1.5rem-3px)] bg-[#140806] p-1.5 shadow-[inset_0_0_0_0.5px_rgba(212,175,55,0.4)]">
              <HeroKenBurns className="relative overflow-hidden rounded-t-full rounded-b-2xl">
                <Parallax depth={10}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={wedding.couple.photo}
                    alt={names}
                    className="aspect-[3/4] w-full object-cover"
                  />
                </Parallax>
              </HeroKenBurns>
            </div>
          </div>

          <p className="wi-fadeup wi-fadeup--3 mt-10 font-regal text-[11px] uppercase tracking-[0.34em] text-[#d4af37]">
            A Union of Two Families
          </p>

          <h1 className="wi-name-on-dark mt-4 font-regal leading-[1.02]" style={{ fontSize: "clamp(2.05rem, 8vw, 5.25rem)" }}>
            <span className="wi-mask wi-name-mask">
              <GoldShimmer duration={7} from="#e6c56a" via="#fff6d4" to="#e6c56a" className="wi-line wi-line--1 wi-couple-heading block text-[#f6ead4]">
                {wedding.couple.bride}
              </GoldShimmer>
            </span>
            <span className="my-1 block font-script-luxury text-3xl sm:text-4xl text-[#d4af37]/85">
              &amp;
            </span>
            <span className="wi-mask wi-name-mask">
              <GoldShimmer duration={7} from="#e6c56a" via="#fff6d4" to="#e6c56a" className="wi-line wi-line--2 wi-couple-heading block text-[#f6ead4]">
                {wedding.couple.groom}
              </GoldShimmer>
            </span>
          </h1>

          <AnimatedCalligraphy color="#d4af37" variant="royal" className="mt-4" />

          <p className="wi-fadeup wi-fadeup--3 mt-4 font-regal text-xs uppercase tracking-[0.32em] text-[#f3e5c3]/75">
            Cordially Request the Honour of Your Presence
          </p>

          <div className="wi-fadeup wi-fadeup--4 mt-6 inline-flex items-center gap-4 rounded-full bg-[#24100c]/90 px-7 py-3 shadow-[0_14px_34px_rgba(0,0,0,0.5),inset_0_0_0_0.75px_rgba(212,175,55,0.45)]">
            <span className="text-[#d4af37]">✦</span>
            <span className="font-display-luxury text-xl sm:text-2xl italic text-[#f9ebd2]">
              {wedding.couple.weddingDateDisplay}
            </span>
            <span className="text-[#d4af37]">✦</span>
          </div>

          {wedding.hashtag && (
            <p className="mt-4 font-regal text-xs tracking-[0.28em] text-[#d4af37]/75">
              {wedding.hashtag}
            </p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-28 space-y-28">
        <ScrollReveal>
          <FamilyBlock wedding={wedding} tone="dark" />
        </ScrollReveal>

        <ScrollReveal>
          <div className="mb-10">
            <JourneyReveal
              date={wedding.couple.weddingDateDisplay}
              kind="elephant"
              accent="#d4af37"
              surface="#1a0a0c"
            />
          </div>
          <section aria-label="Countdown" className="relative rounded-3xl p-6 text-center sm:p-10">
            <AnimatedBorder color="#d4af37" />
            <OutlinedEditorialWord
              watermark="MUHURTHAM"
              eyebrow="The Auspicious Hour Approaches"
              title="Counting Down to the Baraat"
              tone="dark"
            />
            <div className="mt-10">
              <Countdown target={wedding.couple.countdownDate} variant="royal" dark />
            </div>
          </section>
        </ScrollReveal>

        <AnimatedCalligraphy color="#d4af37" variant="royal" />

        <section aria-label="Events">
          <ScrollReveal className="mb-14">
            <OutlinedEditorialWord
              watermark="ITINERARY"
              eyebrow="Wedding Itinerary"
              title="The Celebrations"
              subtitle="Each ceremony hosted with warmth and tradition"
              tone="dark"
            />
          </ScrollReveal>

          <Timeline events={wedding.events} couple={wedding.couple} tone="royal" accent="#d4af37" surface="#140806" />
        </section>

        {wedding.sections?.gallery !== false && (
          <ScrollReveal>
            <section aria-label="Gallery">
              <div className="mb-12">
                <OutlinedEditorialWord
                  watermark="PORTRAITS"
                  eyebrow="The Portrait Gallery"
                  title="Moments Framed in Gold"
                  tone="dark"
                />
              </div>
              <Gallery images={wedding.gallery} variant="royal" />
            </section>
          </ScrollReveal>
        )}

        {wedding.venue && wedding.sections?.venue !== false && (
          <ScrollReveal>
            <section aria-label="Venue" className="wi-bezel-dark">
              <div className="wi-bezel-dark-inner relative bg-gradient-to-br from-[#23100b] via-[#190a07] to-[#110604] p-8 sm:p-12 text-center">
                <FiligreeCorners color="rgba(212,175,55,0.5)" />
                <p className="font-regal text-[11px] uppercase tracking-[0.34em] text-[#d4af37]">
                  The Palace Grounds &amp; Hospitality
                </p>
                <h2 className="font-display-luxury mt-3 text-4xl sm:text-5xl italic text-[#f9ebd2]">
                  {wedding.venue.name}
                </h2>
                <p className="mt-2 text-base text-[#f3e5c3]/80">{wedding.venue.address}</p>

                <div className="mt-8 grid gap-6 text-left sm:grid-cols-3 border-y border-[#d4af37]/15 py-7">
                  {wedding.venue.hotels && wedding.venue.hotels.length > 0 && (
                    <div>
                      <p className="font-regal text-[11px] uppercase tracking-[0.32em] text-[#d4af37]">
                        Guest Residences
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-[#f3e5c3]/80">
                        {wedding.venue.hotels.map((h) => (
                          <li key={h}>✦ {h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {wedding.venue.travel && (
                    <div>
                      <p className="font-regal text-[11px] uppercase tracking-[0.32em] text-[#d4af37]">
                        Chauffeured Arrival
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[#f3e5c3]/80">
                        {wedding.venue.travel}
                      </p>
                    </div>
                  )}
                  {wedding.venue.parking && (
                    <div>
                      <p className="font-regal text-[11px] uppercase tracking-[0.32em] text-[#d4af37]">
                        Valet &amp; Carriages
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[#f3e5c3]/80">
                        {wedding.venue.parking}
                      </p>
                    </div>
                  )}
                </div>

                <a
                  href={`https://maps.google.com/?q=${wedding.venue.mapQuery}`}
                  target="_blank"
                  rel="noreferrer"
                  className="wi-action-lift mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#9b7318] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#140806] shadow-lg"
                >
                  <span>Navigate to Palace Gates</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <VenueQR mapQuery={wedding.venue.mapQuery} dark />
                    <VenueRoute mapQuery={wedding.venue.mapQuery} accent="#d4af37" dark />
              </div>
            </section>
          </ScrollReveal>
        )}

        <AnimatedCalligraphy color="#d4af37" variant="royal" />

        <ScrollReveal>
          <GuestSections wedding={wedding} />
        </ScrollReveal>

{wedding.sections?.rsvp !== false && (
          <ScrollReveal>
            <section aria-label="RSVP" className="wi-bezel-dark">
              <div className="wi-bezel-dark-inner relative bg-[#190a07] p-8 sm:p-12">
                <FiligreeCorners color="rgba(212,175,55,0.5)" />
                <div className="mb-10">
                  <OutlinedEditorialWord
                    watermark="REGISTRY"
                    eyebrow="Attendance"
                    title="Will You Grace the Durbar?"
                    subtitle="Kindly respond so our hospitality desk may prepare your welcome"
                    tone="dark"
                  />
                </div>
                <RsvpForm wedding={wedding} dark variant="royal" />
              </div>
            </section>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <ShareBar wedding={wedding} dark />
        </ScrollReveal>
      </main>

      <footer className="border-t border-[#d4af37]/15 bg-[#0d0403] px-6 py-14 text-center">
        <p className="font-regal wi-couple-heading wi-gold-shimmer text-2xl">{names}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.32em] text-[#f3e5c3]/70">
          {wedding.couple.weddingDateDisplay}
        </p>
          <p className="mt-4 text-xs text-[#f3e5c3]/55">
          Palace Heritage Design · Made with love on Inviteo
        </p>
      </footer>
    </div>
  );
}
