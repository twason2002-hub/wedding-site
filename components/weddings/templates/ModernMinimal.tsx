import type { WeddingData } from "@/lib/weddings/types";
import Countdown from "../Countdown";
import VenueQR from "../VenueQR";
import VenueRoute from "../VenueRoute";
import Gallery from "../Gallery";
import RsvpForm from "../RsvpForm";
import TemplateOpening from "../TemplateOpening";
import SvgDraw from "../effects/SvgDraw";
import { ThinArc } from "../svg/minimal";
import MusicToggle from "../MusicToggle";
import FamilyBlock from "../FamilyBlock";
import ShareBar from "../ShareBar";
import Parallax from "../Parallax";
import { ScrollReveal } from "../HomeMoments";
import Timeline from "../Timeline";
import ScratchReveal from "../ScratchReveal";
import GoldShimmer from "../effects/GoldShimmer";
import HeroKenBurns from "../HeroKenBurns";
import SignatureMotif from "../effects/SignatureMotif";
import GuestSections from "../GuestSections";
import { AnimatedCalligraphy, FiligreeCorners, OutlinedEditorialWord } from "../LuxuryOrnaments";

/**
 * TEMPLATE 3 — ROYAL NEELAM BLUE (Midnight Peacock Blue & Gold Indian Wedding Card).
 * Inspired by royal Indian Sangeet nights and Jodhpuri blue palaces (#091526 & #d4af37).
 * Warm, simple Indian wedding language with arch portrait, mandala glow, and easy navigation.
 */
export default function ModernMinimal({ wedding }: { wedding: WeddingData }) {
  const names = `${wedding.couple.bride} & ${wedding.couple.groom}`;

  return (
    <div className="font-body-luxury min-h-screen bg-[#091526] text-[#f4efe6] antialiased selection:bg-[#d4af37] selection:text-[#091526]">
      <TemplateOpening wedding={wedding} />
      {wedding.music?.enabled && wedding.sections?.music !== false && (
        <MusicToggle src={wedding.music.src} dark />
      )}

      {/* Top Auspicious Strip */}
      <div className="border-b border-[#d4af37]/20 bg-[#060e1a] px-6 py-3 text-center text-xs tracking-[0.32em] text-[#e8cf8f]">
        {wedding.blessing ?? "॥ श्री गणेशाय नमः · शुभ विवाह ॥"}
      </div>

      {/* Royal Neelam Blue & Gold Hero */}
      <header className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 75% 30%, rgba(212,175,55,0.18), transparent 50%), radial-gradient(circle at 20% 80%, rgba(30,64,175,0.28), transparent 55%)",
          }}
        />
        <SignatureMotif motif="star" className="pointer-events-none absolute left-8 top-20 hidden h-14 w-14 text-[#d4af37]/40 md:block" />
        <svg
          className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] text-[#d4af37]/12"
          viewBox="0 0 200 200"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="94" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="76" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="100" cy="100" r="58" stroke="currentColor" strokeWidth="0.4" strokeDasharray="6 4" />
        </svg>

        <div className="wi-hero-exit relative z-10 grid gap-12 lg:grid-cols-[1.15fr_0.95fr] lg:items-center">
          <div className="text-center lg:text-left">
            <p className="wi-fadeup wi-fadeup--1 font-regal text-xs uppercase tracking-[0.34em] text-[#e8cf8f]">
              With the Blessings of Our Families
            </p>

            <SvgDraw className="mx-auto mt-6 w-56 text-[#d4af37]/80" trigger="mount">
              <ThinArc className="h-auto w-full" />
            </SvgDraw>

            <h1
              className="mt-5 font-display-luxury font-normal leading-[1.08] tracking-tight"
              style={{ fontSize: "clamp(3rem, 7.5vw, 6.2rem)" }}
            >
              <span className="wi-mask wi-name-mask">
              <GoldShimmer duration={7} from="#9b7318" via="#f7e7ad" to="#9b7318" className="wi-line wi-line--1 wi-couple-heading block text-[#f4efe6]">
                {wedding.couple.bride}
              </GoldShimmer>
            </span>
            <span className="my-1 block font-script-luxury text-3xl sm:text-4xl text-[#e8cf8f]">
              weds
            </span>
            <span className="wi-mask wi-name-mask">
              <GoldShimmer duration={7} from="#9b7318" via="#f7e7ad" to="#9b7318" className="wi-line wi-line--2 wi-couple-heading block text-[#f4efe6]">
                {wedding.couple.groom}
              </GoldShimmer>
            </span>
            </h1>

            <p className="wi-fadeup wi-fadeup--2 mt-6 max-w-lg mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed text-[#f4efe6]/85">
              {wedding.couple.intro}
            </p>

            <div className="wi-fadeup wi-fadeup--3 mt-8 inline-flex flex-wrap items-center gap-4 rounded-full bg-[#10233f] px-7 py-3.5 text-sm text-[#f4efe6] shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.45)]">
              <span className="text-[#d4af37]">✦</span>
              <span className="font-display-luxury text-xl italic">{wedding.couple.weddingDateDisplay}</span>
              <span className="text-[#d4af37]">✦</span>
            </div>

            {wedding.hashtag && (
              <p className="mt-4 text-xs uppercase tracking-[0.28em] text-[#e8cf8f]/75">
                {wedding.hashtag}
              </p>
            )}
          </div>

          <div className="wi-fadeup wi-fadeup--2 mx-auto w-full max-w-md rounded-t-full rounded-b-3xl bg-[#10233f] p-2.5 shadow-[0_30px_80px_rgba(0,0,0,0.6),inset_0_0_0_0.75px_rgba(212,175,55,0.45)]">
            <HeroKenBurns className="relative overflow-hidden rounded-t-full rounded-b-2xl shadow-[inset_0_0_0_0.5px_rgba(212,175,55,0.3)]">
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
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-28 space-y-24">
        <ScrollReveal>
          <FamilyBlock wedding={wedding} tone="dark" />
        </ScrollReveal>

        <ScrollReveal>
          <div className="mb-10">
            <ScratchReveal wedding={wedding} />
          </div>
          <section aria-label="Countdown" className="text-center">
            <OutlinedEditorialWord
              watermark="CELEBRATE"
              eyebrow="Save the Date"
              title="Days Until Our Wedding"
              tone="dark"
            />
            <div className="mt-8">
              <Countdown target={wedding.couple.countdownDate} variant="royal" dark />
            </div>
          </section>
        </ScrollReveal>

        <AnimatedCalligraphy color="#d4af37" variant="royal" />

        <section aria-label="Events">
          <ScrollReveal className="mb-12">
            <OutlinedEditorialWord
              watermark="FUNCTIONS"
              eyebrow="Shubh Karyakram"
              title="Wedding Functions & Timings"
              subtitle="We look forward to welcoming you at every celebration"
              tone="dark"
            />
          </ScrollReveal>

          <Timeline events={wedding.events} couple={wedding.couple} tone="royal" accent="#d4af37" surface="#091526" />
        </section>

        {wedding.sections?.gallery !== false && (
          <ScrollReveal>
            <section aria-label="Gallery">
              <div className="mb-10">
                <OutlinedEditorialWord
                  watermark="MEMORIES"
                  eyebrow="Happy Moments"
                  title="Couple & Family Photos"
                  tone="dark"
                />
              </div>
              <Gallery images={wedding.gallery} variant="royal" />
            </section>
          </ScrollReveal>
        )}

        {wedding.venue && wedding.sections?.venue !== false && (
          <ScrollReveal>
            <section
              aria-label="Venue"
              className="relative rounded-3xl bg-[#10233f] p-8 sm:p-12 text-center shadow-[0_28px_60px_rgba(0,0,0,0.45),inset_0_0_0_0.75px_rgba(212,175,55,0.4)]"
            >
              <FiligreeCorners color="rgba(212,175,55,0.5)" />
              <p className="font-regal text-xs uppercase tracking-[0.32em] text-[#d4af37]">
                Wedding Venue &amp; Stay
              </p>
              <h2 className="font-display-luxury mt-2 text-3xl sm:text-5xl italic text-white">
                {wedding.venue.name}
              </h2>
              <p className="mt-2 text-sm text-[#f4efe6]/80">{wedding.venue.address}</p>
              {wedding.venue.travel && (
                <p className="mt-2 text-sm text-[#f4efe6]/70">{wedding.venue.travel}</p>
              )}
              {wedding.venue.hotels && wedding.venue.hotels.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {wedding.venue.hotels.map((h) => (
                    <span
                      key={h}
                      className="rounded-full px-4 py-1.5 text-xs text-[#e8cf8f] shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.45)]"
                    >
                      ✦ {h}
                    </span>
                  ))}
                </div>
              )}
              {wedding.venue.parking && (
                <p className="mt-1 text-xs text-[#e8cf8f]">{wedding.venue.parking}</p>
              )}
              <a
                href={`https://maps.google.com/?q=${wedding.venue.mapQuery}`}
                target="_blank"
                rel="noreferrer"
                className="wi-action-lift mt-7 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#9b7318] px-7 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#091526]"
              >
                <span>Open Google Maps</span>
                <span aria-hidden="true">↗</span>
              </a>
              <VenueQR mapQuery={wedding.venue.mapQuery} dark />
                    <VenueRoute mapQuery={wedding.venue.mapQuery} accent="#d4af37" dark />
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
              className="relative rounded-3xl bg-[#10233f] p-8 sm:p-12 shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.4)]"
            >
              <FiligreeCorners color="rgba(212,175,55,0.5)" />
              <div className="mb-10">
                <OutlinedEditorialWord
                  watermark="BLESSINGS"
                  eyebrow="RSVP"
                  title="Please Confirm Your Attendance"
                  subtitle="Let us know which wedding functions you will be joining"
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

      <footer className="border-t border-[#d4af37]/20 bg-[#060e1a] px-6 py-12 text-center text-xs uppercase tracking-[0.28em] text-[#e8cf8f]/70">
        <p className="wi-couple-heading">
          {names} &nbsp;·&nbsp; {wedding.couple.weddingDateDisplay} &nbsp;·&nbsp; Crafted on Inviteo
        </p>
      </footer>
    </div>
  );
}
