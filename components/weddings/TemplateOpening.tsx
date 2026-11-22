import type { WeddingData } from "@/lib/weddings/types";
import { experienceFor } from "@/lib/weddings/template-experience";
import OpeningOverlay from "./OpeningOverlay";

/**
 * Shared opening engine. One component for all templates: reads the
 * template's experience config (opening type, envelope theme, timing) and
 * renders the matching opening. Admin picks templateSlug → everything loads.
 * Wedding content stays in `wedding`; presentation stays in config + scenes.
 */
export default function TemplateOpening({ wedding }: { wedding: WeddingData }) {
  const exp = experienceFor(wedding.templateSlug);
  const names = `${wedding.couple.bride} & ${wedding.couple.groom}`;
  const pull = exp.motion.pullToReveal?.enabled ? exp.motion.pullToReveal.kind : null;
  const signature = exp.motion.signature;
  const variant = signature.palaceDoors
    ? "doors"
    : signature.diyaBell
      ? "bell"
      : signature.petalUnfold
        ? "petal"
        : signature.cardFlip
          ? "flip"
          : pull ?? exp.opening;
  const preload =
    variant === "doors"
      ? ["/weddings/openings/royal-door-left.webp", "/weddings/openings/royal-door-right.webp"]
      : variant === "bell"
        ? ["/weddings/openings/vivah-bell.webp"]
        : variant === "petal"
          ? ["/weddings/openings/floral-card.webp"]
          : variant === "flip"
            ? ["/weddings/openings/minimal-paper.webp"]
            : variant === "ribbon"
              ? ["/weddings/openings/destination-ribbon.webp"]
              : [];
  return (
    <>
      {preload.map((href) => (
        <link key={href} rel="preload" as="image" href={href} />
      ))}
      <OpeningOverlay
        variant={variant}
        names={names}
        blessing={wedding.blessing}
        subtitle={wedding.couple.weddingDateDisplay}
        theme={exp.envelope}
        timing={{ open: exp.timing.open, reveal: exp.timing.reveal }}
      />
    </>
  );
}
