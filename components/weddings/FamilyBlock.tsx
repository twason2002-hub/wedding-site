import type { WeddingData } from "@/lib/weddings/types";
import { FiligreeCorners } from "./LuxuryOrnaments";

/**
 * Couple + Family section + Love Story.
 * Ultra-fine hairline filigree enclosures instead of thick borders.
 */
export default function FamilyBlock({
  wedding,
  tone = "light",
  showIntro = true,
}: {
  wedding: WeddingData;
  tone?: "light" | "dark" | "minimal" | "floral" | "vivah";
  showIntro?: boolean;
}) {
  const { couple } = wedding;
  const hasFamily = !!(couple.brideParents || couple.groomParents || couple.grandparents);
  if (!hasFamily && !(showIntro && (couple.intro || couple.loveStory))) return null;

  if (tone === "dark" || tone === "vivah") {
    return (
      <section aria-label="Family and Blessings" className="wi-bezel-dark">
        <div className="wi-bezel-dark-inner relative bg-gradient-to-b from-[#200e09]/90 to-[#140705]/90 p-8 sm:p-12 text-center">
          <FiligreeCorners color="rgba(212,175,55,0.45)" />
          <p className="font-regal text-[11px] uppercase tracking-[0.34em] text-[#d4af37]">
            With the Blessings of Our Families
          </p>
          {couple.grandparents && (
            <p className="mt-3 font-display-luxury text-lg italic text-[#e8cf8f]/85">
              {couple.grandparents}
            </p>
          )}
          {hasFamily && (
            <div className="mt-8 grid gap-6 md:grid-cols-2 border-y border-[#d4af37]/15 py-7">
              {couple.brideParents && (
                <div>
                  <p className="font-regal text-[11px] uppercase tracking-[0.32em] text-[#d4af37]">
                    Bride&apos;s Parents
                  </p>
                  <p className="mt-2 font-display-luxury text-2xl text-[#f9ebd2]">
                    {couple.brideParents}
                  </p>
                </div>
              )}
              {couple.groomParents && (
                <div>
                  <p className="font-regal text-[11px] uppercase tracking-[0.32em] text-[#d4af37]">
                    Groom&apos;s Parents
                  </p>
                  <p className="mt-2 font-display-luxury text-2xl text-[#f9ebd2]">
                    {couple.groomParents}
                  </p>
                </div>
              )}
            </div>
          )}
          {showIntro && couple.intro && (
            <p className="mx-auto mt-7 max-w-2xl font-display-luxury text-xl sm:text-2xl italic leading-relaxed text-[#f3e5c3]/90">
              &ldquo;{couple.intro}&rdquo;
            </p>
          )}
          {couple.loveStory && (
            <div className="mx-auto mt-6 max-w-2xl border-t border-[#d4af37]/12 pt-6">
              <p className="font-regal text-[11px] uppercase tracking-[0.32em] text-[#d4af37]">
                Our Story
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#f3e5c3]/75">{couple.loveStory}</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (tone === "minimal") {
    return (
      <section aria-label="Family" className="border-t border-[#171513]/12 pt-12">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.6fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[#7c7267]">01.B — The Houses</p>
            <h2 className="font-display-luxury mt-3 text-4xl font-light text-[#171513]">
              Two Families,
              <br />
              One Table.
            </h2>
          </div>
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 border-b border-[#171513]/12 pb-6">
              {couple.brideParents && (
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[#7c7267]">Bride&apos;s Parents</p>
                  <p className="mt-2 font-display-luxury text-2xl text-[#171513]">{couple.brideParents}</p>
                </div>
              )}
              {couple.groomParents && (
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[#7c7267]">Groom&apos;s Parents</p>
                  <p className="mt-2 font-display-luxury text-2xl text-[#171513]">{couple.groomParents}</p>
                </div>
              )}
            </div>
            {couple.loveStory && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-[#7c7267]">Editorial Note</p>
                <p className="mt-2 text-base leading-relaxed text-[#3d3833]">{couple.loveStory}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (tone === "floral") {
    return (
      <section
        aria-label="Family"
        className="relative rounded-[2.5rem] bg-white/95 p-8 sm:p-12 text-center shadow-[0_24px_60px_-24px_rgba(168,90,110,0.16),inset_0_0_0_0.75px_rgba(217,138,156,0.4)]"
      >
        <FiligreeCorners color="rgba(200,125,138,0.45)" />
        <p className="font-script-luxury text-3xl text-[#c87d8a]">With the blessings of</p>
        {couple.grandparents && (
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-[#a65c6b]">{couple.grandparents}</p>
        )}
        {hasFamily && (
          <div className="mt-6 grid gap-6 md:grid-cols-2 border-y border-[#f3dce2] py-6">
            {couple.brideParents && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#b36a7a]">Bride&apos;s Parents</p>
                <p className="mt-1.5 font-display-luxury text-2xl italic text-[#4a252a]">
                  {couple.brideParents}
                </p>
              </div>
            )}
            {couple.groomParents && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#b36a7a]">Groom&apos;s Parents</p>
                <p className="mt-1.5 font-display-luxury text-2xl italic text-[#4a252a]">
                  {couple.groomParents}
                </p>
              </div>
            )}
          </div>
        )}
        {showIntro && couple.intro && (
          <p className="mx-auto mt-6 max-w-2xl font-display-luxury text-2xl italic leading-relaxed text-[#4a252a]">
            &ldquo;{couple.intro}&rdquo;
          </p>
        )}
      </section>
    );
  }

  return (
    <section aria-label="Family" className="wi-bezel">
      <div className="wi-bezel-inner relative p-8 sm:p-12 text-center">
        <FiligreeCorners color="rgba(184,107,67,0.4)" />
        <p className="text-[11px] uppercase tracking-[0.32em] text-[#0f353e]">
          Hosted with Love by Our Families
        </p>
        {hasFamily && (
          <div className="mt-6 grid gap-6 md:grid-cols-2 border-y border-black/10 py-6">
            {couple.brideParents && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">Bride&apos;s Parents</p>
                <p className="mt-1.5 font-display-luxury text-2xl text-[#0f353e]">{couple.brideParents}</p>
              </div>
            )}
            {couple.groomParents && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">Groom&apos;s Parents</p>
                <p className="mt-1.5 font-display-luxury text-2xl text-[#0f353e]">{couple.groomParents}</p>
              </div>
            )}
          </div>
        )}
        {showIntro && couple.intro && (
          <p className="mx-auto mt-6 max-w-2xl font-display-luxury text-2xl italic leading-relaxed text-[#0f353e]">
            &ldquo;{couple.intro}&rdquo;
          </p>
        )}
        {couple.loveStory && (
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-stone-600">
            {couple.loveStory}
          </p>
        )}
      </div>
    </section>
  );
}
