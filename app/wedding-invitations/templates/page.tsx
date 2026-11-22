import Link from "next/link";
import SiteNav from "@/components/weddings/SiteNav";
import { ScrollReveal } from "@/components/weddings/HomeMoments";
import { OutlinedEditorialWord } from "@/components/weddings/LuxuryOrnaments";
import { listTemplates } from "@/lib/weddings/templates";
import { TEMPLATE_PRICE_LABEL, TEMPLATE_PRICE_NOTE, templateInterestMessage, whatsappLink } from "@/lib/weddings/site-config";
import { getSiteContact } from "@/lib/weddings/db";
import { demoWeddingFor } from "@/lib/weddings/sample-data";
import { marketingMetadata } from "@/lib/weddings/og";

export const metadata = marketingMetadata(
  "Wedding Invitation Templates | Inviteo",
  "Browse five Inviteo wedding invitation templates, from palace gold to a beach weekend. Open a live preview, then order one link for both families.",
  "/wedding-invitations/templates",
);

export default async function TemplateGallery() {
  const templates = listTemplates();
  const contact = await getSiteContact();

  return (
    <div
      style={{ background: "var(--wi-bg)", color: "var(--wi-ink)" }}
      className="font-body-luxury min-h-screen antialiased"
    >
      <SiteNav />

      <header className="wi-wrap pt-16 pb-[var(--wi-section-gap)] md:pt-24">
        <OutlinedEditorialWord
          watermark="DESIGNS"
          eyebrow="Inviteo Wedding Collection"
          title={
            <>
              Choose Your{" "}
              <em className="italic font-normal" style={{ color: "var(--wi-accent)" }}>
                Wedding Invitation
              </em>{" "}
              Design
            </>
          }
          subtitle={`${TEMPLATE_PRICE_NOTE}. Open a live preview or message us on WhatsApp to start.`}
          tone="ink"
          align="left"
        />
      </header>

      <main className="wi-wrap pb-[var(--wi-section-gap)]">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t, i) => {
            const sample = demoWeddingFor(t.slug);
            if (!sample) return null;
            return (
              <ScrollReveal key={t.slug} delay={(i % 3) * 80}>
                <article
                  className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-24px_rgba(11,25,44,0.25)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgba(11,25,44,0.35)]"
                >
                  <Link
                    href={`/wedding-invitations/templates/${t.slug}`}
                    className="wi-zoom relative block"
                    aria-label={`Open ${t.name} live preview`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.thumbnail}
                      alt={`${t.name} preview`}
                      loading={i < 2 ? "eager" : "lazy"}
                      decoding="async"
                      className="aspect-[16/10] w-full object-cover"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-md">
                      0{i + 1} · {t.category}
                    </span>
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className="text-[10px] font-medium uppercase tracking-[0.28em]"
                        style={{ color: t.palette.accent }}
                      >
                        {t.animation} opening
                      </p>
                      <span className="flex gap-1" aria-hidden="true">
                        {[t.palette.bg, t.palette.surface, t.palette.accent, t.palette.ink].map(
                          (hex, idx) => (
                            <span
                              key={idx}
                              className="h-3 w-3 rounded-full ring-1 ring-inset ring-white/40"
                              style={{ background: hex }}
                            />
                          )
                        )}
                      </span>
                    </div>

                    <h2 className="font-display-luxury mt-2 text-[1.7rem] font-normal italic leading-tight text-[#0b192c]">
                      {t.name}
                    </h2>
                    <p className="mt-1 font-display-luxury text-3xl text-[#0b192c]">{TEMPLATE_PRICE_LABEL} <span className="font-body-luxury text-sm not-italic text-[#5b708c]">one-time</span></p>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#3b4f6b]">
                      {t.description}
                    </p>
                    <p className="mt-3 text-xs text-[#5b708c]">
                      Sample:{" "}
                      <Link
                        href={`/wedding-invitations/${sample.slug}`}
                        className="font-medium underline decoration-[#d4af37]/60 underline-offset-4 hover:decoration-[#d4af37]"
                      >
                        {sample.couple.bride} &amp; {sample.couple.groom}
                      </Link>
                    </p>

                    <div className="mt-5 flex flex-col gap-2 pt-1">
                      <Link
                        href={`/wedding-invitations/templates/${t.slug}`}
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#0b192c] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-black"
                      >
                        <span>Open Live Preview</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                      <a
                        href={whatsappLink(templateInterestMessage(t.name), contact.whatsappNumber)}
                        className="wi-wa inline-flex min-h-12 items-center justify-center rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.16em]"
                      >
                        WhatsApp · {TEMPLATE_PRICE_LABEL}
                      </a>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </main>
    </div>
  );
}
