import type { WeddingData } from "@/lib/weddings/types";
import Countdown from "../Countdown";
import VenueQR from "../VenueQR";
import VenueRoute from "../VenueRoute";
import Gallery from "../Gallery";
import RsvpForm from "../RsvpForm";
import TemplateOpening from "../TemplateOpening";
import LotusReveal from "../effects/LotusReveal";
import MandalaEffect from "../effects/MandalaEffect";
import MusicToggle from "../MusicToggle";
import FamilyBlock from "../FamilyBlock";
import ShareBar from "../ShareBar";
import Parallax from "../Parallax";
import { ScrollReveal } from "../HomeMoments";
import Timeline from "../Timeline";
import ScratchReveal from "../ScratchReveal";
import DiyaEffect from "../effects/DiyaEffect";
import GoldShimmer from "../effects/GoldShimmer";
import HeroKenBurns from "../HeroKenBurns";
import GuestSections from "../GuestSections";
import { AnimatedCalligraphy, FiligreeCorners, OutlinedEditorialWord } from "../LuxuryOrnaments";

/**
 * TEMPLATE 4 — TRADITIONAL VIVAH (Sacred Kanjeevaram & Temple Gold Edition).
 * Deep vermilion sindoor (#4a0b0d), marigold & brass gold (#f59e0b),
 * 0.75px hairline temple plaques, self-drawing SVG flourishes, and lotus medallion portrait.
 */
export default function TraditionalVivah({ wedding }: { wedding: WeddingData }) {
  const names = `${wedding.couple.bride} & ${wedding.couple.groom}`;

  return (
    <div className="font-body-luxury min-h-screen bg-[#4a0b0d] text-[#fef3c7] selection:bg-[#f59e0b] selection:text-[#4a0b0d]">
      <TemplateOpening wedding={wedding} />
      {wedding.music?.enabled && wedding.sections?.music !== false && (
        <MusicToggle src={wedding.music.src} dark />
      )}

      {/* Sacred Marigold & Mango-Leaf SVG Toran Frieze */}
      <div className="overflow-hidden border-b border-[#f59e0b]/25 bg-[#2d0507] py-2.5">
        <div className="mx-auto flex max-w-6xl items-center justify-around text-xs tracking-[0.32em] text-[#fbbf24]">
          <span>✦ शुभ विवाह ✦</span>
          <span className="hidden sm:inline">✦ श्री गणेशाय नमः ✦</span>
          <span>✦ माङ्गल्यं तन्तुनानेन ✦</span>
          <span className="hidden md:inline">✦ शुभ मुहूर्त ✦</span>
        </div>
      </div>

      {/* Temple Mandapam Hero */}
      <header className="relative overflow-hidden px-6 pt-16 pb-20 text-center md:pt-24 md:pb-28">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 25%, rgba(245,158,11,0.22) 0%, rgba(153,27,27,0.25) 45%, transparent 75%)",
          }}
        />
        <DiyaEffect size={72} className="pointer-events-none fixed right-5 top-24 z-20 hidden sm:block" />

        <div className="wi-hero-exit relative mx-auto max-w-4xl">
          {/* Sacred Ganesha / Kalash Emblem */}
          <div className="wi-fadeup wi-fadeup--1 relative mx-auto h-40 w-40">
            <MandalaEffect color="#f0b429" size={160} spinSeconds={50} className="absolute inset-0 opacity-40" />
            <div className="wi-ember absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#360608] text-[#fbbf24] shadow-[0_0_40px_rgba(245,158,11,0.3),inset_0_0_0_0.75px_rgba(251,191,36,0.65)]">
              <span className="font-regal text-2xl">ॐ</span>
            </div>
          </div>

          <p className="wi-fadeup wi-fadeup--1 mt-4 font-regal text-sm uppercase tracking-[0.32em] text-[#fde68a]">
            {wedding.blessing ?? "॥ शुभ विवाह ॥"}
          </p>

          {wedding.mantra && (
            <div className="wi-fadeup wi-fadeup--2 relative mx-auto mt-5 max-w-2xl rounded-2xl bg-[#360608]/85 px-7 py-5 shadow-[inset_0_0_0_0.75px_rgba(251,191,36,0.38)]">
              <FiligreeCorners color="rgba(251,191,36,0.5)" />
              <p className="font-display-luxury text-lg sm:text-xl italic leading-relaxed text-[#fef3c7]">
                {wedding.mantra}
              </p>
            </div>
          )}

          {/* Lotus Medallion Portrait Frame with Ultra-Fine Double Ring */}
          <div className="wi-fadeup wi-fadeup--2 relative mx-auto mt-10 h-72 w-72 sm:h-88 sm:w-88">
            <svg
              className="pointer-events-none absolute -inset-5 z-0 h-[calc(100%+2.5rem)] w-[calc(100%+2.5rem)] text-[#fbbf24]/40"
              viewBox="0 0 100 100"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="50" cy="50" r="48" className="wi-arch-draw" stroke="currentColor" strokeWidth="0.6" pathLength={1} />
              <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="0.35" strokeDasharray="2 2" />
            </svg>
            <svg
              className="pointer-events-none absolute -inset-5 h-full w-full text-[#fbbf24]/35"
              viewBox="0 0 200 200"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="100" cy="100" r="96" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.8" />
            </svg>
            <div className="relative h-full w-full overflow-hidden rounded-full p-2 bg-[#2d0507] shadow-[0_25px_70px_rgba(0,0,0,0.65),inset_0_0_0_1px_rgba(251,191,36,0.65)]">
              <HeroKenBurns className="relative h-full w-full overflow-hidden rounded-full">
                <Parallax depth={10}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={wedding.couple.photo}
                    alt={names}
                    className="h-full w-full object-cover"
                  />
                </Parallax>
              </HeroKenBurns>
            </div>
          </div>

          <LotusReveal color="#f0b429" size={220} className="mx-auto -mb-2 mt-8" />

          <p className="wi-fadeup wi-fadeup--3 mt-10 font-regal text-[11px] uppercase tracking-[0.34em] text-[#fbbf24]">
            Sacred Vedic Kalyana Muhurtham
          </p>

          <h1
            className="mt-3 font-regal leading-[1.08]"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.8rem)" }}
          >
            <span className="wi-mask wi-name-mask">
              <GoldShimmer duration={7} from="#d97706" via="#fef3c7" to="#d97706" className="wi-line wi-line--1 wi-couple-heading block text-[#fef3c7]">
                {wedding.couple.bride}
              </GoldShimmer>
            </span>
            <span className="my-1 block font-display-luxury italic text-2xl text-[#fde68a]">
              weds
            </span>
            <span className="wi-mask wi-name-mask">
              <GoldShimmer duration={7} from="#d97706" via="#fef3c7" to="#d97706" className="wi-line wi-line--2 wi-couple-heading block text-[#fef3c7]">
                {wedding.couple.groom}
              </GoldShimmer>
            </span>
          </h1>

          <AnimatedCalligraphy color="#fbbf24" variant="vivah" className="mt-4" />

          <p className="wi-fadeup wi-fadeup--4 mt-3 font-display-luxury text-2xl italic text-[#fde68a]">
            {wedding.couple.weddingDateDisplay}
          </p>
          {wedding.hashtag && (
            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-[#fde68a]/70">
              {wedding.hashtag}
            </p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-28 space-y-24">
        <ScrollReveal>
          <FamilyBlock wedding={wedding} tone="vivah" />
        </ScrollReveal>

        <ScrollReveal>
          <div className="mb-10">
            <ScratchReveal wedding={wedding} />
          </div>
          <section
            aria-label="Countdown"
            className="wi-frame-fine relative rounded-3xl bg-[#360608]/90 p-8 sm:p-12 text-center shadow-2xl"
          >
            <FiligreeCorners color="rgba(251,191,36,0.55)" />
            <OutlinedEditorialWord
              watermark="KALYANAM"
              eyebrow="॥ शुभ मुहूर्त की प्रतीक्षा ॥"
              title="Countdown to the Sacred Muhurtham"
              tone="dark"
            />
            <div className="mt-8">
              <Countdown target={wedding.couple.countdownDate} variant="vivah" dark />
            </div>
          </section>
        </ScrollReveal>

        <AnimatedCalligraphy color="#fbbf24" variant="vivah" />

        <section aria-label="Events">
          <ScrollReveal className="mb-12">
            <OutlinedEditorialWord
              watermark="UTSAV"
              eyebrow="॥ मांगलिक कार्यक्रम ॥"
              title="Vivah Utsav & Rituals"
              tone="dark"
            />
          </ScrollReveal>
          <Timeline events={wedding.events} couple={wedding.couple} tone="vivah" accent="#f0b429" surface="#4a0b0d" />
        </section>

        {wedding.sections?.gallery !== false && (
          <ScrollReveal>
            <section aria-label="Gallery">
              <div className="mb-10">
                <OutlinedEditorialWord
                  watermark="DARSHAN"
                  eyebrow="॥ मधुर स्मृतियाँ ॥"
                  title="Sacred Moments & Portraits"
                  tone="dark"
                />
              </div>
              <Gallery images={wedding.gallery} variant="vivah" />
            </section>
          </ScrollReveal>
        )}

        {wedding.venue && wedding.sections?.venue !== false && (
          <ScrollReveal>
            <section
              aria-label="Venue"
              className="wi-frame-fine relative rounded-3xl bg-[#360608] p-8 sm:p-12 text-center"
            >
              <FiligreeCorners color="rgba(251,191,36,0.55)" />
              <p className="font-regal text-xs uppercase tracking-[0.32em] text-[#fbbf24]">
                ॥ विवाह मंडपम ॥
              </p>
              <h2 className="font-regal mt-2 text-3xl sm:text-4xl text-[#fef3c7]">
                {wedding.venue.name}
              </h2>
              <p className="mt-2 text-sm text-[#fde68a]/85">{wedding.venue.address}</p>
              {wedding.venue.travel && (
                <p className="mt-2 text-xs text-[#fde68a]/70">{wedding.venue.travel}</p>
              )}
              {wedding.venue.hotels && wedding.venue.hotels.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {wedding.venue.hotels.map((h) => (
                    <span
                      key={h}
                      className="rounded-full px-4 py-1.5 text-xs text-[#fde68a] shadow-[inset_0_0_0_0.75px_rgba(251,191,36,0.5)]"
                    >
                      ✦ {h}
                    </span>
                  ))}
                </div>
              )}
              <a
                href={`https://maps.google.com/?q=${wedding.venue.mapQuery}`}
                target="_blank"
                rel="noreferrer"
                className="wi-action-lift mt-6 inline-flex items-center gap-2 rounded-full bg-[#fbbf24] px-7 py-3 text-xs font-bold uppercase tracking-[0.22em] text-[#360608]"
              >
                <span>View Mandapam Directions</span>
                <span aria-hidden="true">↗</span>
              </a>
              <VenueQR mapQuery={wedding.venue.mapQuery} dark />
                    <VenueRoute mapQuery={wedding.venue.mapQuery} accent="#fbbf24" dark />
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
              className="wi-frame-fine relative rounded-3xl bg-[#360608] p-8 sm:p-12"
            >
              <FiligreeCorners color="rgba(251,191,36,0.55)" />
              <div className="mb-8">
                <OutlinedEditorialWord
                  watermark="ASHIRWAD"
                  eyebrow="॥ सादर आमंत्रण ॥"
                  title="Your Presence Is Our Greatest Blessing"
                  tone="dark"
                />
              </div>
              <RsvpForm wedding={wedding} dark variant="royal" />
            </section>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <ShareBar wedding={wedding} dark />
        </ScrollReveal>
      </main>

      <footer className="border-t border-[#fbbf24]/20 bg-[#2d0507] px-6 py-12 text-center text-xs uppercase tracking-[0.28em] text-[#fde68a]/70">
        <p className="wi-couple-heading">॥ {names} &nbsp;·&nbsp; {wedding.couple.weddingDateDisplay} ॥</p>
      </footer>
    </div>
  );
}
