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
  return (
    <OpeningOverlay
      variant={pull ?? exp.opening}
      names={names}
      blessing={wedding.blessing}
      subtitle={wedding.couple.weddingDateDisplay}
      theme={exp.envelope}
      timing={{ open: exp.timing.open, reveal: exp.timing.reveal }}
    />
  );
}
