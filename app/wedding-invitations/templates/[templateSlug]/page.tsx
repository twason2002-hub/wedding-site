import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplate, listTemplates } from "@/lib/weddings/templates";
import { demoWeddingFor } from "@/lib/weddings/sample-data";
import WeddingRenderer from "@/components/weddings/WeddingRenderer";
import { marketingMetadata, templatePreviewMetadata } from "@/lib/weddings/og";

export async function generateMetadata({ params }: { params: Promise<{ templateSlug: string }> }) {
  const { templateSlug } = await params;
  const t = getTemplate(templateSlug);
  if (!t || !demoWeddingFor(t.slug)) {
    return marketingMetadata(
      "Template Not Found | Inviteo",
      "This Inviteo template link is not available. Browse the five wedding invitation templates and open a live preview of palace, floral, or beach designs.",
      "/wedding-invitations/templates",
    );
  }
  return templatePreviewMetadata(t.slug, t.name, `/wedding-invitations/templates/${t.slug}`);
}

/** Live template preview rendered with realistic sample wedding data + quick switcher bar. */
export default async function TemplatePreview({ params }: { params: Promise<{ templateSlug: string }> }) {
  const { templateSlug } = await params;
  const template = getTemplate(templateSlug);
  const wedding = template ? demoWeddingFor(template.slug) : null;
  if (!template || !wedding) notFound();
  const allTemplates = listTemplates();

  return (
    <div>
      <div className="sticky top-0 z-[80] overflow-x-clip border-b border-[#d4af37]/25 bg-[#0b192c]/95 px-4 py-2.5 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/wedding-invitations/templates"
              aria-label="All designs"
              className="wi-action-lift inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full px-3.5 py-1.5 text-xs uppercase tracking-[0.22em] text-white/90 shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.45)]"
            >
              ←<span className="hidden sm:inline">&nbsp;All Designs</span>
            </Link>
            <p className="min-w-0 truncate text-xs sm:text-sm">
              <span className="hidden sm:inline text-[11px] uppercase tracking-[0.28em] text-[#e8cf8f] mr-2">
                Inviteo Preview
              </span>
              <strong className="font-display-luxury text-lg italic font-normal">{template.name}</strong>
              <span className="ml-2 hidden text-white/60 md:inline text-xs">
                · Sample: {wedding.couple.bride} &amp; {wedding.couple.groom}
              </span>
            </p>
          </div>

          {/* Quick Template Switcher Pills */}
          <div className="hidden min-[1400px]:flex items-center gap-1.5">
            {allTemplates.map((t) => {
              const active = t.slug === template.slug;
              return (
                <Link
                  key={t.slug}
                  href={`/wedding-invitations/templates/${t.slug}`}
                  className={`wi-action-lift rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.22em] ${
                    active
                      ? "bg-[#d4af37] text-[#140806] font-semibold"
                      : "text-white/65"
                  }`}
                >
                  {t.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/wedding-invitations/${wedding.slug}`}
              className="wi-action-lift inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-gradient-to-r from-[#d4af37] to-[#9b7318] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#140806]"
            >
              <span className="hidden sm:inline">Full Screen View</span>
              <span className="sm:hidden">Open</span>&nbsp;↗
            </Link>
          </div>
        </div>
      </div>
      <WeddingRenderer wedding={wedding} />
    </div>
  );
}
