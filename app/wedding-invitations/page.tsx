import Link from "next/link";
import SiteNav from "@/components/weddings/SiteNav";
import { ScrollReveal } from "@/components/weddings/HomeMoments";
import {
  AmbientFloatingParticles,
  InteractiveTiltCard,
  OutlinedEditorialWord,
} from "@/components/weddings/LuxuryOrnaments";
import PhoneCarousel from "@/components/weddings/PhoneCarousel";
import { Shine } from "@animate-ui/react/primitives/effects/shine";
import { listTemplates } from "@/lib/weddings/templates";
import {
  GENERIC_WHATSAPP_MESSAGE,
  PRICING_NOTE,
  SITE_CONFIG,
  isEmailSet,
  isInstagramSet,
  whatsappLink,
} from "@/lib/weddings/site-config";
import { getSiteContact } from "@/lib/weddings/db";
import WhatsAppDock from "@/components/weddings/WhatsAppDock";
import { marketingMetadata } from "@/lib/weddings/og";

export const metadata = {
  ...marketingMetadata(
    "Indian Wedding Invitations | Inviteo",
    "Create an Indian wedding invitation website with Inviteo. Share one link for Haldi, Mehendi, Sangeet, maps, and RSVP with every family group.",
    "/wedding-invitations",
  ),
  other: { "page-type": "service", "site-kind": "other" },
};

const STEPS: [string, string, string][] = [
  [
    "01",
    "Pick a design",
    "Choose Palace Heritage, Floral Anand Karaj, Neelam Blue, Shubh Vivah, or Destination.",
  ],
  [
    "02",
    "Send your details",
    "Names, parents, events, venues, and photos — all on WhatsApp.",
  ],
  [
    "03",
    "Share one link",
    "We set up your website. You send the same link to every family group.",
  ],
];

const FAQS: [string, string][] = [
  [
    "How long does it take?",
    "Usually 2 to 3 days after we receive your names, events, venues, and photos.",
  ],
  [
    "Can we change details later?",
    "Yes. Updates go live on the same link — no resending.",
  ],
  [
    "How do we order?",
    "Tap Chat on WhatsApp, share your wedding date and favourite design.",
  ],
  [
    "What does it cost?",
    PRICING_NOTE,
  ],
];

export default async function WeddingInvitationsHome() {
  const templates = listTemplates();
  const contact = await getSiteContact();
  const chat = whatsappLink(GENERIC_WHATSAPP_MESSAGE, contact.whatsappNumber);
  const showEmail = isEmailSet(contact.email);
  const showInstagram = isInstagramSet(contact.instagramUrl);

  return (
    <div
      id="top"
      style={{ background: "var(--wi-bg)", color: "var(--wi-ink)" }}
      className="font-body-luxury min-h-screen antialiased selection:bg-[#1e3a8a] selection:text-white"
    >
      <SiteNav />
      <WhatsAppDock href={chat} />

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
                Digital wedding websites
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
                    <em className="wi-wa-ink italic font-normal">
                      WhatsApp.
                    </em>
                  </span>
                </span>
              </h1>

              <p className="wi-fadeup wi-fadeup--2 mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#57534e]">
                Events, maps, gallery, countdown, and RSVP in one link guests love to open.
              </p>

              <div className="wi-fadeup wi-fadeup--3 mt-8 flex flex-wrap gap-3.5">
                <Shine enableOnHover asChild>
                  <Link href="/wedding-invitations/templates" className="wi-btn wi-btn--gold">
                    <span>Explore Designs</span>
                    <span className="wi-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </Shine>
                <Shine enableOnHover asChild>
                  <a
                    href={chat}
                    className="wi-btn wi-wa"
                  >
                    <WhatsAppGlyph />
                    <span>Chat on WhatsApp</span>
                  </a>
                </Shine>
              </div>

              <p className="wi-fadeup wi-fadeup--4 mt-8 max-w-xl text-sm leading-relaxed text-[#6b6259]">
                {PRICING_NOTE}
              </p>
            </div>

            <div className="wi-fadeup wi-fadeup--3 mx-auto w-full max-w-sm">
              <InteractiveTiltCard intensity={3}>
                <div className="overflow-hidden rounded-[1.8rem] border border-black/10 bg-[#ece5dd] shadow-[0_35px_80px_-30px_rgba(28,25,23,0.45)]">
                  <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37] font-display-luxury text-lg italic text-[#3a2a00]">
                      A
                    </span>
                    <div className="leading-tight">
                      <p className="text-[15px] font-medium">Abhishek &amp; Meera</p>
                      <p className="text-[11px] text-white/75">online · wedding website</p>
                    </div>
                  </div>
                  <div className="space-y-2.5 px-4 py-5 text-[13.5px] leading-snug">
                    <p className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 shadow-sm">
                      Congrats! Who designed this?
                    </p>
                    <p className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-[#d9fdd3] px-3.5 py-2.5 shadow-sm">
                      Inviteo — one link for maps, photos, RSVP.
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
                        <p className="mt-0.5 font-medium text-[#1c1917]">You are cordially invited</p>
                      </div>
                    </div>
                  </div>
                </div>
              </InteractiveTiltCard>
            </div>
          </div>
        </div>
      </header>

      <section id="designs" aria-label="Wedding invitation designs" className="wi-wrap wi-section scroll-mt-24">
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <OutlinedEditorialWord
              watermark="DESIGNS"
              eyebrow="Five designs"
              title={
                <>
                  Pick the feel of{" "}
                  <em className="italic font-normal" style={{ color: "var(--wi-accent)" }}>
                    your shaadi
                  </em>
                </>
              }
              subtitle="Swipe the phones. Open a live preview when one feels right."
              tone="ink"
              align="left"
            />
            <Link
              href="/wedding-invitations/templates"
              className="wi-btn"
              style={{ background: "var(--wi-royal-blue)", color: "#fff" }}
            >
              <span>All designs</span>
              <span className="wi-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <PhoneCarousel templates={templates} whatsappNumber={contact.whatsappNumber} />
        </ScrollReveal>
      </section>

      <section id="how" aria-label="How it works" style={{ background: "var(--wi-surface)" }} className="border-y border-[#0b192c]/10">
        <div className="wi-wrap wi-section scroll-mt-24">
          <ScrollReveal>
            <OutlinedEditorialWord
              watermark="STEPS"
              eyebrow="Three steps"
              title="How it works"
              tone="ink"
              align="left"
            />
          </ScrollReveal>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map(([n, title, body], i) => (
              <ScrollReveal key={n} delay={i * 80}>
                <li className="rounded-[1.5rem] bg-white p-7 ring-1 ring-black/5">
                  <p className="font-display-luxury text-5xl italic leading-none text-[#0b192c]/20">{n}</p>
                  <h3 className="font-display-luxury mt-3 text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5b708c]">{body}</p>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

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
              eyebrow="Ready when you are"
              title="Start on WhatsApp"
              subtitle="Send your wedding date and favourite design. We reply personally."
              tone="dark"
            />
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80">
              {PRICING_NOTE}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3.5">
              <a
                href={chat}
                className="wi-btn wi-wa"
              >
                <WhatsAppGlyph />
                <span>Chat on WhatsApp</span>
              </a>
              <Link href="/wedding-invitations/templates" className="wi-btn wi-btn--ghost">
                See designs first
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section aria-label="Frequently asked questions" className="wi-wrap wi-section">
        <ScrollReveal>
          <p className="wi-eyebrow">FAQ</p>
          <h2 className="wi-h2">Common questions</h2>
          <div className="wi-faq mt-8">
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

      <footer style={{ background: "#06101e" }} className="border-t border-[#d4af37]/20 pb-28 text-white/75 md:pb-0">
        <div className="wi-wrap flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display-luxury text-3xl text-white">
              {SITE_CONFIG.brandName.slice(0, 6)}
              <span className="italic text-[#d4af37]">{SITE_CONFIG.brandName.slice(6)}</span>
            </p>
            <p className="mt-2 max-w-sm text-sm text-white/70">{SITE_CONFIG.tagline}</p>
            {(showEmail || showInstagram) && (
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {showEmail && (
                  <a className="underline decoration-[#d4af37]/60 underline-offset-4" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                )}
                {showInstagram && (
                  <a className="underline decoration-[#d4af37]/60 underline-offset-4" href={contact.instagramUrl}>
                    Instagram
                  </a>
                )}
              </p>
            )}
          </div>
          <a href={chat} className="wi-btn wi-btn--gold">
            WhatsApp Us
          </a>
        </div>
        <div className="border-t border-white/10">
          <div className="wi-wrap py-5 text-xs text-white/50">
            © {new Date().getFullYear()} {SITE_CONFIG.brandName}
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
