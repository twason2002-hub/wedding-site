import Link from "next/link";
import SiteNav from "@/components/weddings/SiteNav";
import { WordHighlight, DevelopingPhoto, ScrollReveal } from "@/components/weddings/HomeMoments";
import {
  AnimatedCalligraphy,
  AmbientFloatingParticles,
  FiligreeCorners,
  InteractiveTiltCard,
  OutlinedEditorialWord,
} from "@/components/weddings/LuxuryOrnaments";
import PhoneCarousel from "@/components/weddings/PhoneCarousel";
import { Check } from "@/components/animate-ui/icons/check";
import { Shine } from "@animate-ui/react/primitives/effects/shine";
import { listTemplates } from "@/lib/weddings/templates";
import { SITE_CONFIG, TEMPLATE_PRICE_LABEL, isContactConfigured, whatsappLink } from "@/lib/weddings/site-config";

export const metadata = {
  title: "Inviteo — Beautiful Indian Wedding Invitation Websites",
  description:
    "Create your digital Indian wedding invitation website with Inviteo. Five royal & traditional designs with Haldi, Mehendi, Sangeet, Wedding details, Google Maps, photo gallery, RSVP, and WhatsApp sharing.",
  openGraph: {
    title: "Inviteo — Your Indian Wedding Deserves a Beautiful Digital Invitation",
    description:
      "Five handcrafted Indian wedding website designs with live previews, RSVP and WhatsApp sharing.",
    images: ["/weddings/hero-evening.jpg"],
  },
  other: { "page-type": "service", "site-kind": "other" },
};

const OFFERS: [string, string, string][] = [
  ["01", "Grand Opening Animation", "Palace curtains, falling flower petals, glowing diya, and royal entrance effects."],
  ["02", "All Wedding Functions", "Show Roka, Haldi, Mehendi, Sangeet, Baraat, Pheras, and Reception in one place."],
  ["03", "Family & Elders' Blessings", "Dedicated space for Lord Ganesha blessings, parents' names, and grandparents."],
  ["04", "Google Maps & Directions", "One-tap location button so guests can easily reach every banquet hall or lawn."],
  ["05", "Couple Photo Gallery", "Share your pre-wedding and roka photos — easy to replace anytime."],
  ["06", "Live Wedding Countdown", "A live timer counting down days, hours, and minutes to your wedding day."],
  ["07", "Online Guest RSVP", "Guests can confirm attendance, number of family members, and food preferences."],
  ["08", "Easy WhatsApp Sharing", "Share one beautiful link with your wedding hashtag across all family WhatsApp groups."],
];

const STEPS: [string, string, string][] = [
  [
    "01",
    "Pick Your Favourite Design",
    "Choose from our 5 Indian wedding designs — Palace Heritage, Floral Anand Karaj, Neelam Blue, Shubh Vivah, or Destination Wedding.",
  ],
  [
    "02",
    "Send Us Your Details",
    "Share your names, parents' names, event dates, venue addresses, and couple photos on WhatsApp.",
  ],
  [
    "03",
    "Share on WhatsApp & Celebrate",
    "We set up your personalised wedding website link so you can send it to all your family and friends.",
  ],
];

const FAQS: [string, string][] = [
  [
    "How long does it take to get our wedding website?",
    "Once you send us your names, events, venues, and photos, your wedding invitation website is ready within 2 to 3 days. You can check everything before sharing.",
  ],
  [
    "Can we change photos or timings after sharing the link?",
    "Yes! You can replace sample photos with your actual wedding shoot or update any event time or venue later. Everyone opening the same link will see the updated details immediately.",
  ],
  [
    "Which Indian wedding events can we add?",
    "You can include all your functions: Roka, Sagan, Haldi, Mehendi, Sangeet, Jaggo, Chooda, Anand Karaj, Muhurtham, Baraat, Pheras, and Reception.",
  ],
  [
    "Is it easy for elders and grandparents to read?",
    "Yes. We use clear, large fonts, simple words in English and Hindi, and big buttons for Google Maps and RSVP so elders can use it without any trouble.",
  ],
  [
    "How do guests RSVP on the website?",
    "Guests simply type their name, select which functions they are attending, and choose the number of guests. You can see all responses in one place.",
  ],
  [
    "How do we order our Inviteo wedding website?",
    "Simply click 'Chat on WhatsApp' below and tell us your wedding date and which of the 5 designs you like best.",
  ],
];

export default function WeddingInvitationsHome() {
  const templates = listTemplates();

  return (
    <div
      id="top"
      style={{ background: "var(--wi-bg)", color: "var(--wi-ink)" }}
      className="font-body-luxury min-h-screen antialiased selection:bg-[#1e3a8a] selection:text-white"
    >
      {/* 1 — Inviteo Royal Blue Navigation */}
      <SiteNav />
      <a
        href={whatsappLink("Hi Inviteo! I want a wedding invitation website.")}
        className="fixed bottom-4 right-4 z-[70] inline-flex min-h-12 items-center gap-2 rounded-full bg-[#1faa53] px-4 text-sm font-semibold text-white shadow-lg"
      >
        <WhatsAppGlyph />
        <span>WhatsApp</span>
      </a>

      {/* 2 — Inviteque-style hero: copy + WhatsApp chat mock */}
      <header className="relative overflow-hidden bg-[#fbf9f5] text-[#1c1917]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 85% 10%, rgba(212,175,55,0.14), transparent 45%), radial-gradient(circle at 8% 90%, rgba(29,78,216,0.07), transparent 45%)",
          }}
        />
        <div className="wi-wrap relative pb-16 pt-14 md:pb-24 md:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="wi-fadeup wi-fadeup--1 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-white px-4 py-1.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.22em] sm:tracking-[0.28em] text-[#8a6d2b] shadow-sm">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                Recently launched · Digital wedding websites
              </div>

              <h1
                className="mt-6 font-display-luxury font-normal leading-[1.04] tracking-tight"
                style={{ fontSize: "clamp(2.6rem, 6vw, 4.9rem)" }}
              >
                <span className="wi-mask">
                  <span className="wi-line wi-line--1">Beautiful wedding</span>
                </span>
                <span className="wi-mask">
                  <span className="wi-line wi-line--2">
                    websites, shared on{" "}
                    <em className="italic font-normal" style={{ color: "#1faa53" }}>
                      WhatsApp.
                    </em>
                  </span>
                </span>
              </h1>

              <p className="wi-fadeup wi-fadeup--2 mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#57534e]">
                Create and share your professional Indian wedding invitation website in minutes.
                Haldi to Reception timings, Google Maps venue navigation, couple story, countdown
                and live RSVP — one link guests love to open.
              </p>

              <div className="wi-fadeup wi-fadeup--3 mt-8 flex flex-wrap gap-3.5">
                <Shine enableOnHover asChild>
                  <Link href="/wedding-invitations/templates" className="wi-btn wi-btn--gold">
                    <span>Explore Templates</span>
                    <span className="wi-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </Shine>
                <Shine enableOnHover asChild>
                  <a
                    href={whatsappLink("Hi Inviteo! I want a wedding invitation website.")}
                    className="wi-btn"
                    style={{ background: "#1faa53", color: "#fff" }}
                  >
                    <WhatsAppGlyph />
                    <span>Chat on WhatsApp</span>
                  </a>
                </Shine>
              </div>

              <div className="wi-fadeup wi-fadeup--4 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-[#6b6259]">
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true" className="text-[#d4af37]">★★★★★</span>
                  4.9 · loved by 1,280+ couples
                </span>
                <span aria-hidden="true" className="hidden h-4 w-px bg-black/10 sm:block" />
                <span>Live in minutes · No printing delays</span>
              </div>
            </div>

            {/* WhatsApp chat mock + invite preview */}
            <div className="wi-fadeup wi-fadeup--3 mx-auto w-full max-w-sm">
              <InteractiveTiltCard intensity={3}>
                <div className="overflow-hidden rounded-[1.8rem] border border-black/10 bg-[#ece5dd] shadow-[0_35px_80px_-30px_rgba(28,25,23,0.45)]">
                  <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37] font-display-luxury text-lg italic text-[#3a2a00]">
                      A
                    </span>
                    <div className="leading-tight">
                      <p className="text-[15px] font-medium">Abhishek &amp; Meera ❤️</p>
                      <p className="text-[11px] text-white/75">online · wedding website</p>
                    </div>
                  </div>
                  <div className="space-y-2.5 px-4 py-5 text-[13.5px] leading-snug">
                    <p className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 shadow-sm">
                      Congrats! Did you hire a designer? It feels so premium 😍
                    </p>
                    <p className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-[#d9fdd3] px-3.5 py-2.5 shadow-sm">
                      No — made it ourselves in minutes on Inviteo ✨
                    </p>
                    <div className="ml-auto max-w-[92%] overflow-hidden rounded-2xl rounded-tr-md bg-white shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/weddings/minimal-couple.jpg"
                        alt="Couple invitation link preview"
                        className="aspect-[16/9] w-full object-cover"
                      />
                      <div className="px-3.5 py-3">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a6d2b]">
                          inviteo · wedding website
                        </p>
                        <p className="mt-0.5 font-medium text-[#1c1917]">
                          You are cordially invited! Tap for venue map &amp; photos
                        </p>
                        <span className="mt-2 inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#1c1917] px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                          Open invitation →
                        </span>
                      </div>
                    </div>
                    <p className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 shadow-sm">
                      Wow — I am trying it too 🚀
                    </p>
                  </div>
                </div>
              </InteractiveTiltCard>
              <p className="mt-4 text-center text-[12px] uppercase tracking-[0.22em] text-[#8a6d2b]">
                ॥ शुभ विवाह ॥ · Tap a design below for live preview
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 3 — Five Indian Wedding Templates Showcase */}
      <section id="designs" aria-label="Wedding invitation designs" className="wi-wrap wi-section scroll-mt-24">
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <OutlinedEditorialWord
              watermark="DESIGNS"
              eyebrow="Our 5 Wedding Invitation Designs"
              title={
                <>
                  Five Signature Styles for{" "}
                  <em className="italic font-normal" style={{ color: "var(--wi-accent)" }}>
                    Your Shaadi
                  </em>
                </>
              }
              subtitle={`Swipe through the five designs. Any one of them is ${TEMPLATE_PRICE_LABEL}, once.`}
              tone="ink"
              align="left"
            />
            <Link
              href="/wedding-invitations/templates"
              className="wi-btn"
              style={{ background: "var(--wi-royal-blue)", color: "#fff" }}
            >
              <span>View All 5 Designs</span>
              <span className="wi-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-8 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:mx-0 sm:px-0">
          {templates.map((t, i) => (
            <Link
              key={t.slug}
              href={`/wedding-invitations/templates/${t.slug}`}
              className="group relative w-[78vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-[1.6rem]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.thumbnail} alt="" className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <span className="text-[11px] uppercase tracking-[0.22em] text-white/75">0{i + 1}</span>
                <span className="mt-1 block font-display-luxury text-3xl italic leading-tight">{t.name}</span>
              </span>
            </Link>
          ))}
        </div>

        <ScrollReveal delay={100}>
          <PhoneCarousel templates={templates} />
        </ScrollReveal>
      </section>

      {/* 4 — What We Offer (Royal Blue & Gold Cards) */}
      <section
        id="offer"
        aria-label="What we offer"
        className="border-y border-[#d4af37]/20 bg-[#0b192c] text-[#f8f5ee] scroll-mt-24"
      >
        <div className="wi-wrap wi-section">
          <ScrollReveal>
            <OutlinedEditorialWord
              watermark="FEATURES"
              eyebrow="Everything Included"
              title={
                <>
                  Everything your Indian wedding invitation{" "}
                  <em className="wi-gold-shimmer italic font-normal">needs</em>
                </>
              }
              subtitle="Simple for elders to read, exciting for friends to open, and easy to share on WhatsApp."
              tone="dark"
              align="left"
            />
            <AnimatedCalligraphy color="#d4af37" variant="royal" className="mx-0 mt-4" />
          </ScrollReveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {OFFERS.map(([n, title, body], idx) => (
              <ScrollReveal key={n} delay={idx * 55}>
                <InteractiveTiltCard intensity={4} className="h-full">
                  <div className="wi-bezel-dark h-full">
                    <div className="wi-bezel-dark-inner relative p-7 flex flex-col justify-between bg-[#132a4a]/90">
                      <FiligreeCorners color="rgba(212,175,55,0.45)" />
                      <div>
                        <span className="font-regal wi-text-outline-gold block text-4xl leading-none">
                          {n}
                        </span>
                        <h3 className="font-display-luxury mt-3 text-2xl font-medium text-white leading-snug">
                          {title}
                        </h3>
                        <p className="mt-2.5 text-sm leading-relaxed text-[#cbd5e1]">
                          {body}
                        </p>
                      </div>
                      <div className="mt-6 h-[0.75px] w-10 bg-[#d4af37]/50" />
                    </div>
                  </div>
                </InteractiveTiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Made for Indian Traditions */}
      <section id="features" aria-label="Wedding invitation features" className="wi-wrap wi-section">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <ScrollReveal>
            <div className="wi-bezel">
              <div className="wi-bezel-inner p-2">
                <DevelopingPhoto
                  src="/weddings/craft-flatlay.jpg"
                  alt="Gold-foil Indian wedding invitation suite with marigold petals"
                  className="aspect-[4/5]"
                />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <p className="wi-eyebrow">Made for Indian Families</p>
            <h2 className="wi-h2">
              Designed for every ritual, from{" "}
              <em className="italic font-normal" style={{ color: "var(--wi-accent)" }}>
                Roka to Vidaai
              </em>
            </h2>
            <ul className="mt-9 space-y-6">
              {[
                [
                  "Grand Opening Animations",
                  "Guests tap to open velvet palace curtains, falling flower petals, or a sacred glowing diya before seeing your invite.",
                ],
                [
                  "Swap Sample Photos Anytime",
                  "All templates come with sample Indian wedding photos right now — simply send us your own photos whenever they are ready.",
                ],
                [
                  "Instant Changes After Sharing",
                  "Need to update a venue hall or timing? We update it right away on the same link without resending.",
                ],
                [
                  "Blessings, Mantras & Wedding Music",
                  "Includes Ganesh Vandana, Sanskrit mantras, parents' names, and background shehnai or wedding music.",
                ],
              ].map(([t, b]) => (
                <li key={t} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#1e3a8a]/10 text-xs shadow-[inset_0_0_0_0.75px_rgba(30,58,138,0.35)]"
                    style={{ color: "var(--wi-accent)" }}
                  >
                    ✦
                  </span>
                  <div>
                    <h3 className="font-display-luxury text-2xl font-medium">{t}</h3>
                    <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--wi-muted)" }}>
                      {b}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* 7 — How It Works */}
      <section id="how" aria-label="How it works" style={{ background: "var(--wi-surface)" }} className="border-b border-[#0b192c]/10">
        <div className="wi-wrap wi-section scroll-mt-24">
          <ScrollReveal>
            <OutlinedEditorialWord
              watermark="STEPS"
              eyebrow="Simple 3-Step Process"
              title="How to get your Inviteo website"
              tone="ink"
              align="left"
            />
          </ScrollReveal>

          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            {STEPS.map(([n, title, body], i) => (
              <ScrollReveal key={n} delay={i * 100}>
                <li className="wi-bezel h-full">
                  <div className="wi-bezel-inner relative p-8 bg-[#f4f7fb]">
                    <FiligreeCorners color="rgba(30,58,138,0.35)" />
                    <p className="font-display-luxury wi-text-outline-ink text-6xl italic leading-none">
                      {n}
                    </p>
                    <h3 className="font-display-luxury mt-4 text-3xl font-medium">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--wi-muted)" }}>
                      {body}
                    </p>
                  </div>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 8 — Why Choose Inviteo */}
      <section id="why" aria-label="Why choose us" className="wi-wrap wi-section scroll-mt-24">
        <p className="wi-eyebrow">Why Families Love Inviteo</p>
        <WordHighlight
          className="mt-6 max-w-5xl font-display-luxury text-3xl sm:text-5xl italic leading-[1.22]"
          text="A paper card is seen once and kept in a drawer. Your Inviteo wedding website is opened by every relative and friend — on the way to the banquet hall, for the venue map, and to see your wedding photos."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {[
            [
              "Classic Indian Look",
              "Traditional motifs, diyas, marigold colours, and peacock blue & gold frames made specially for Indian weddings.",
            ],
            [
              "Always Up to Date",
              "Replace sample photos with your real pre-wedding pictures or update timings anytime.",
            ],
            [
              "Easy for All Ages",
              "Clear text, Google Maps buttons, and one-tap WhatsApp sharing that parents and grandparents love.",
            ],
          ].map(([t, b], i) => (
            <ScrollReveal key={t} delay={i * 90}>
              <div className="wi-bezel h-full">
                <div className="wi-bezel-inner relative p-7">
                  <FiligreeCorners color="rgba(212,175,55,0.4)" />
                  <div className="wi-divider" aria-hidden="true">
                    <span>✦</span>
                  </div>
                  <h3 className="font-display-luxury mt-5 text-2xl font-medium">{t}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--wi-muted)" }}>
                    {b}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 9 — About Inviteo */}
      <section id="about" aria-label="About us" style={{ background: "var(--wi-surface)" }} className="border-y border-[#0b192c]/10">
        <div className="wi-wrap wi-section grid scroll-mt-24 items-center gap-12 md:grid-cols-2">
          <ScrollReveal>
            <p className="wi-eyebrow">About Inviteo</p>
            <h2 className="wi-h2">Made with love for Indian weddings</h2>
            <p className="mt-6 leading-relaxed" style={{ color: "var(--wi-muted)" }}>
              At <strong>Inviteo</strong>, we believe a wedding invitation should feel like the celebration
              itself — full of family warmth, sacred blessings, music, and colour.
            </p>
            <p className="mt-4 leading-relaxed" style={{ color: "var(--wi-muted)" }}>
              Every website is personalised with your names, parents&apos; and grandparents&apos; blessings,
              all your wedding functions from Haldi to Reception, Google Maps directions, and your favourite
              couple photos.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="wi-bezel">
              <div className="wi-bezel-inner wi-zoom p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/weddings/atelier-portrait.jpg"
                  alt="Hands arranging gold-foil Indian wedding invitation cards"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full rounded-[1.4rem] object-cover"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 9b — Better than paper: comparison table (Inviteque-style proof) */}
      <section aria-label="Why digital beats paper" className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
        <ScrollReveal>
          <p className="wi-eyebrow">Better Than Paper</p>
          <h2 className="wi-h2">
            An elevated{" "}
            <em className="italic font-normal" style={{ color: "var(--wi-accent)" }}>
              guest experience
            </em>
          </h2>
          <p className="wi-lead">
            No printing delays, no reprint costs, no update hassle. One link, live instantly.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div className="mt-10 overflow-x-auto rounded-3xl border border-[#0b192c]/10 bg-white shadow-[0_24px_60px_-30px_rgba(11,25,44,0.35)]">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 text-[11px] uppercase tracking-[0.22em] text-[#5b708c]">
                  <th className="px-6 py-4 font-medium">Feature</th>
                  <th className="px-6 py-4 font-medium">Paper card</th>
                  <th className="px-6 py-4 font-medium">PDF on WhatsApp</th>
                  <th className="px-6 py-4 font-medium text-[#0b192c]">Inviteo website ✓</th>
                </tr>
              </thead>
              <tbody className="text-[#1c1917]">
                {[
                  ["Google Maps navigation", "—", "—", "✓ 1-tap directions"],
                  ["Live countdown", "—", "—", "✓"],
                  ["Cinematic opening", "—", "—", "✓ curtains · petals · diya"],
                  ["Instant live updates", "✕ reprint", "✕ resend", "✓ same link"],
                  ["RSVP tracking", "—", "—", "✓ per-event"],
                  ["Cost", "Reprint each change", "Free image", "One payment"],
                ].map(([f, a, b, c]) => (
                  <tr key={f} className="border-b border-black/5 last:border-0">
                    <td className="px-6 py-3.5 font-medium">{f}</td>
                    <td className="px-6 py-3.5 text-[#8a8a8a]">{a}</td>
                    <td className="px-6 py-3.5 text-[#8a8a8a]">{b}</td>
                    <td className="px-6 py-3.5 font-semibold text-[#0b7a3e]">
                      <span className="inline-flex items-center gap-1.5">
                        <Check size={15} animateOnView aria-hidden="true" />
                        {c.replace(/^✓\s*/, "")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <figure className="rounded-3xl border border-black/10 bg-[#ece5dd] p-5 text-sm leading-relaxed">
              <blockquote>
                “Guests kept asking who designed it. We made it ourselves in minutes — maps, countdown,
                everything just worked.”
              </blockquote>
              <figcaption className="mt-3 text-[12px] uppercase tracking-[0.2em] text-[#6b6259]">
                Meera · shared on 40+ family groups
              </figcaption>
            </figure>
            <figure className="rounded-3xl border border-black/10 bg-white p-5 text-sm leading-relaxed">
              <blockquote>
                “Elders opened the link and tapped the map button. No calls asking for the address this
                time.”
              </blockquote>
              <figcaption className="mt-3 text-[12px] uppercase tracking-[0.2em] text-[#6b6259]">
                Abhishek · Haldi to Reception in one link
              </figcaption>
            </figure>
          </div>
        </ScrollReveal>
      </section>

      {/* 10 — WhatsApp Contact Section (Royal Blue & Gold) */}
      <section
        id="contact"
        aria-label="Contact on WhatsApp"
        className="scroll-mt-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #06101e 0%, #0b192c 50%, #16325c 100%)" }}
      >
        <AmbientFloatingParticles variant="gold" />
        <div className="wi-wrap wi-section relative z-10 text-center text-white">
          <ScrollReveal>
            <OutlinedEditorialWord
              watermark="INVITEO"
              eyebrow="Get Your Wedding Website"
              title="Let's create your wedding invitation"
              subtitle="Send us your wedding date and favourite design on WhatsApp — we will reply personally and get started."
              tone="dark"
            />
            <p className="mt-6 text-base text-white/80">
              {TEMPLATE_PRICE_LABEL} once, for any design. No monthly fee.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3.5">
              <a
                href={whatsappLink("Hi Inviteo! I want a wedding invitation website. My wedding date is…")}
                className="wi-btn"
                style={{ background: "#1faa53", color: "#fff" }}
              >
                <WhatsAppGlyph />
                <span>Chat on WhatsApp</span>
              </a>
              <Link href="/wedding-invitations/templates" className="wi-btn wi-btn--ghost">
                See All 5 Designs First
              </Link>
            </div>
            {!isContactConfigured() && (
              <p className="mt-6 text-sm text-white/70">
                The green button jumps to this section until the WhatsApp number is connected.
              </p>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* 11 — FAQ */}
      <section aria-label="Frequently asked questions" className="wi-wrap wi-section">
        <ScrollReveal>
          <p className="wi-eyebrow">Common Questions</p>
          <h2 className="wi-h2">Frequently Asked Questions</h2>
          <div className="wi-faq mt-10">
            {FAQS.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span className="wi-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="wi-a">{a}</p>
              </details>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 12 — Footer (Royal Blue & Gold) */}
      <footer style={{ background: "#06101e" }} className="text-white/75 border-t border-[#d4af37]/20">
        <div className="wi-wrap grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display-luxury text-3xl text-white">
              {SITE_CONFIG.brandName.slice(0, 6)}
              <span className="italic text-[#d4af37]">
                {SITE_CONFIG.brandName.slice(6)}
              </span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
              {SITE_CONFIG.tagline}. Five handcrafted Indian wedding website designs with live previews,
              Google Maps, RSVP, and WhatsApp sharing.
            </p>
            <Link href="/wedding-invitations/templates" className="wi-btn wi-btn--gold mt-6">
              <span>See All 5 Designs</span>
              <span className="wi-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
          <nav aria-label="Wedding Designs">
            <p className="font-regal text-xs uppercase tracking-[0.28em] text-[#f3df9d]">5 Wedding Designs</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ["/wedding-invitations/templates/royal-heritage", "01 · Palace Heritage"],
                ["/wedding-invitations/templates/floral-romance", "02 · Floral Anand Karaj"],
                ["/wedding-invitations/templates/modern-minimal", "03 · Neelam Blue"],
                ["/wedding-invitations/templates/traditional-vivah", "04 · Shubh Vivah"],
                ["/wedding-invitations/templates/destination-wedding", "05 · Destination Wedding"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="wi-link inline-flex min-h-[38px] items-center">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="font-regal text-xs uppercase tracking-[0.28em] text-[#f3df9d]">Contact Inviteo</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  className="wi-link inline-flex min-h-[38px] items-center"
                  href={whatsappLink("Hi Inviteo! I'd like to know more.")}
                >
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="wi-wrap flex flex-col gap-2 py-6 text-xs text-white/50 md:flex-row md:justify-between">
            <p>© {new Date().getFullYear()} {SITE_CONFIG.brandName} · Indian Wedding Invitation Websites</p>
            <p>
              <Link href="/tushar-babitta" className="wi-link">
                Main Wedding Invitation →
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function WhatsAppGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.5-.6c.1-.2.1-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.2-.7.5-.9.9-1.1 2.2-.2 4a11.6 11.6 0 0 0 4.5 4.2c1.7.8 2.4.9 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.1-.5-.3Z" />
    </svg>
  );
}
