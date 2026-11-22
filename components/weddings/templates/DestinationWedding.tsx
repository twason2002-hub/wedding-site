import type { WeddingData } from "@/lib/weddings/types";
import Countdown from "../Countdown";
import VenueQR from "../VenueQR";
import VenueRoute from "../VenueRoute";
import Gallery from "../Gallery";
import RsvpForm from "../RsvpForm";
import TemplateOpening from "../TemplateOpening";
import WaveEffect from "../effects/WaveEffect";
import FloatingOrnaments from "../effects/FloatingOrnaments";
import { Palm } from "../svg/destination";
import FamilyBlock from "../FamilyBlock";
import ShareBar from "../ShareBar";
import Parallax from "../Parallax";
import { ScrollReveal } from "../HomeMoments";
import Timeline from "../Timeline";
import HeroKenBurns from "../HeroKenBurns";
import JourneyReveal from "../effects/JourneyReveal";
import SignatureMotif from "../effects/SignatureMotif";
import GuestSections from "../GuestSections";
import { AnimatedCalligraphy, FiligreeCorners, OutlinedEditorialWord } from "../LuxuryOrnaments";
import CoastDepth from "../effects/DepthLayers";

/**
 * TEMPLATE 5 — DESTINATION WEDDING (Mediterranean-meets-Goa Coastal Resort Edition).
 * Warm linen sand (#f7f3eb), Aegean teal (#0f353e), terracotta sun (#b86b43),
 * full-bleed horizon hero with layered wave dividers, self-drawing wave calligraphy,
 * and outlined editorial watermarks.
 */
export default function DestinationWedding({ wedding }: { wedding: WeddingData }) {
  const names = `${wedding.couple.bride} & ${wedding.couple.groom}`;

  return (
    <div className="font-body-luxury min-h-screen bg-[#f7f3eb] text-[#0f353e] selection:bg-[#0f353e] selection:text-[#f7f3eb]">
      <TemplateOpening wedding={wedding} />

      {/* Full-Bleed Coastal Horizon Hero */}
      <header className="relative flex min-h-[92dvh] items-end overflow-hidden bg-[#0a252c]">
        <CoastDepth />
        <HeroKenBurns className="absolute inset-0">
          <Parallax depth={12} className="h-full w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={wedding.couple.photo}
              alt={names}
              className="h-full w-full object-cover"
            />
          </Parallax>
        </HeroKenBurns>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(6,22,28,0.94) 0%, rgba(6,22,28,0.72) 38%, rgba(6,22,28,0.28) 100%)",
          }}
        />
        <SignatureMotif motif="palm" className="pointer-events-none absolute left-6 top-24 hidden h-20 w-16 text-white/30 md:block" />
        {/* Swaying palm silhouettes */}
        <FloatingOrnaments duration={6} drift={14} className="pointer-events-none absolute right-8 top-24 hidden text-white/25 sm:block">
          <Palm className="h-28 w-24" />
        </FloatingOrnaments>
        <FloatingOrnaments duration={7.5} drift={10} className="pointer-events-none absolute left-8 top-48 hidden text-white/20 lg:block">
          <Palm className="h-20 w-16" />
        </FloatingOrnaments>

        <div className="wi-hero-exit relative z-10 mx-auto w-full max-w-6xl px-6 pb-32 pt-32 text-white">
          <div className="wi-fadeup wi-fadeup--1 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.32em] text-[#f3d5c1] shadow-[inset_0_0_0_0.75px_rgba(255,255,255,0.28)] backdrop-blur-md">
            <span>Coastal Destination Celebration</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">15.2993° N, 74.1240° E</span>
          </div>

          <h1
            className="wi-name-on-dark mt-5 font-display-luxury font-normal italic leading-[0.98] text-[#f7f3eb]"
            style={{ fontSize: "clamp(3.2rem, 8vw, 6.8rem)" }}
          >
            <span className="wi-mask wi-name-mask">
              <span className="wi-line wi-line--1 wi-couple-heading">{wedding.couple.bride}</span>
            </span>
            <span className="wi-fadeup wi-fadeup--2 my-1 block font-script-luxury text-3xl sm:text-4xl text-[#f3d5c1] not-italic">
              &amp;
            </span>
            <span className="wi-mask wi-name-mask">
              <span className="wi-line wi-line--2 wi-couple-heading">{wedding.couple.groom}</span>
            </span>
          </h1>

          <AnimatedCalligraphy color="#e6b89c" variant="waves" className="mt-4" />

          <div className="wi-fadeup wi-fadeup--3 mt-6 flex flex-wrap items-center gap-4 text-sm sm:text-base text-white/85">
            <span className="font-medium tracking-wide">{wedding.couple.weddingDateDisplay}</span>
            {wedding.hashtag && (
              <>
                <span className="opacity-40">·</span>
                <span className="text-[#f3d5c1]">{wedding.hashtag}</span>
              </>
            )}
          </div>
        </div>

        <WaveEffect
          colors={["#c8dce8", "#8eb6c9", "#5a8fa6"]}
          className="absolute bottom-0 left-0 h-24 w-full"
        />
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-28 pt-8 space-y-24">
        <ScrollReveal>
          <FamilyBlock wedding={wedding} tone="light" />
        </ScrollReveal>

        <ScrollReveal>
          <div className="mb-10">
            <JourneyReveal
              date={wedding.couple.weddingDateDisplay}
              kind="plane"
              accent="#0f353e"
              surface="#ffffff"
            />
          </div>
          <section aria-label="Countdown" className="text-center">
            <OutlinedEditorialWord
              watermark="HORIZON"
              eyebrow="Pack Your Resort Linen"
              title="Countdown to Takeoff"
              tone="ink"
            />
            <div className="mt-8">
              <Countdown target={wedding.couple.countdownDate} variant="coastal" />
            </div>
          </section>
        </ScrollReveal>

        <AnimatedCalligraphy color="#b86b43" variant="waves" />

        <section aria-label="Itinerary">
          <ScrollReveal className="mb-12">
            <OutlinedEditorialWord
              watermark="VOYAGE"
              eyebrow="Three Days by the Sea"
              title="The Coastal Itinerary"
              tone="ink"
            />
          </ScrollReveal>

          <Timeline events={wedding.events} couple={wedding.couple} tone="coastal" accent="#0f353e" surface="#f7f3eb" />
        </section>

        {wedding.venue && (
          <ScrollReveal>
            <section aria-label="Travel and stay">
              <div className="mb-10">
                <OutlinedEditorialWord
                  watermark="CONCIERGE"
                  eyebrow="Guest Logistics"
                  title="Travel, Villas & Transfers"
                  tone="ink"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="wi-bezel">
                  <div className="wi-bezel-inner relative p-7">
                    <FiligreeCorners color="rgba(184,107,67,0.35)" />
                    <p className="text-[11px] uppercase tracking-[0.32em] text-[#0f353e]">
                      01 · Resort Block
                    </p>
                    <h3 className="font-display-luxury mt-2 text-2xl italic text-[#0f353e]">
                      Where to Stay
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-[#0f353e]/80">
                      {(wedding.venue.hotels ?? []).map((h) => (
                        <li key={h}>✦ {h}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="wi-bezel">
                  <div className="wi-bezel-inner relative p-7">
                    <FiligreeCorners color="rgba(184,107,67,0.35)" />
                    <p className="text-[11px] uppercase tracking-[0.32em] text-[#0f353e]">
                      02 · Arrival
                    </p>
                    <h3 className="font-display-luxury mt-2 text-2xl italic text-[#0f353e]">
                      Flights &amp; Transfers
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#0f353e]/80">
                      {wedding.venue.travel}
                    </p>
                  </div>
                </div>

                <div className="wi-bezel">
                  <div className="wi-bezel-inner relative p-7 flex flex-col justify-between">
                    <FiligreeCorners color="rgba(184,107,67,0.35)" />
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.32em] text-[#0f353e]">
                        03 · On Property
                      </p>
                      <h3 className="font-display-luxury mt-2 text-2xl italic text-[#0f353e]">
                        Shuttles &amp; Map
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#0f353e]/80">
                        {wedding.venue.parking}
                      </p>
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${wedding.venue.mapQuery}`}
                      target="_blank"
                      rel="noreferrer"
                      className="wi-action-lift mt-5 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#0f353e] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.22em] text-white"
                    >
                      Open Resort Map ↗
                    </a>
                    <VenueQR mapQuery={wedding.venue.mapQuery} />
                    <VenueRoute mapQuery={wedding.venue.mapQuery} accent="#0f353e" />
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}

        {wedding.sections?.gallery !== false && (
          <ScrollReveal>
            <section aria-label="Gallery">
              <div className="mb-10">
                <OutlinedEditorialWord
                  watermark="POSTCARDS"
                  eyebrow="Sun, Salt & Silk"
                  title="Postcards from the Coast"
                  tone="ink"
                />
              </div>
              <Gallery images={wedding.gallery} variant="coastal" />
            </section>
          </ScrollReveal>
        )}

        <AnimatedCalligraphy color="#b86b43" variant="waves" />

        <ScrollReveal>
          <GuestSections wedding={wedding} />
        </ScrollReveal>

{wedding.sections?.rsvp !== false && (
          <ScrollReveal>
            <section aria-label="RSVP" className="wi-bezel">
              <div className="wi-bezel-inner relative p-8 sm:p-12">
                <FiligreeCorners color="rgba(184,107,67,0.4)" />
                <div className="mb-8">
                  <OutlinedEditorialWord
                    watermark="BOARDING"
                    eyebrow="Attendance Confirmation"
                    title="Will You Join Us on the Shore?"
                    tone="ink"
                  />
                </div>
                <RsvpForm wedding={wedding} variant="coastal" />
              </div>
            </section>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <ShareBar wedding={wedding} />
        </ScrollReveal>
      </main>

      <footer className="bg-[#0a252c] px-6 py-14 text-center text-sm text-[#f7f3eb]/75">
        <p className="font-display-luxury wi-couple-heading text-3xl italic text-white">{names}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.32em] text-[#f3d5c1]">
          {wedding.couple.weddingDateDisplay}
        </p>
      </footer>
    </div>
  );
}
