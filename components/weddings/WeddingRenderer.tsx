import type { WeddingData } from "@/lib/weddings/types";
import { experienceFor } from "@/lib/weddings/template-experience";
import RoyalHeritage from "./templates/RoyalHeritage";
import FloralRomance from "./templates/FloralRomance";
import ModernMinimal from "./templates/ModernMinimal";
import TraditionalVivah from "./templates/TraditionalVivah";
import DestinationWedding from "./templates/DestinationWedding";
import ScrollProgress from "./ScrollProgress";
import SideBorders from "./SideBorders";
import FloatingEffects from "./FloatingEffects";
import GuestGreeting from "./GuestGreeting";
import QuickActions from "./QuickActions";

/**
 * Shared rendering engine: wedding data in, selected template out.
 * Renderer-level interactive layer (borders, ambient effects, guest
 * greeting) is driven by the template's experience config + admin flags.
 * Adding a template = add key here + registry entry. No data changes needed.
 */
export default function WeddingRenderer({ wedding }: { wedding: WeddingData }) {
  const exp = experienceFor(wedding.templateSlug);
  const effectsOn = wedding.sections?.effects ?? exp.features.effects.enabled;
  const bordersOn = wedding.sections?.borders ?? exp.features.borders.enabled;

  return (
    <>
      <ScrollProgress />
      {bordersOn && <SideBorders motif={exp.features.borders.motif} />}
      {effectsOn && (
        <FloatingEffects kind={exp.features.effects.kind} speed={wedding.sections?.effectsSpeed ?? exp.features.effects.speed} density={exp.motion.intensity} />
      )}
      <GuestGreeting accent={exp.palette.accent} />
      <QuickActions wedding={wedding} />
      {renderTemplate(wedding)}
    </>
  );
}

function renderTemplate(wedding: WeddingData) {
  switch (wedding.templateSlug) {
    case "royal-heritage":
      return <RoyalHeritage wedding={wedding} />;
    case "floral-romance":
      return <FloralRomance wedding={wedding} />;
    case "modern-minimal":
      return <ModernMinimal wedding={wedding} />;
    case "traditional-vivah":
      return <TraditionalVivah wedding={wedding} />;
    case "destination-wedding":
      return <DestinationWedding wedding={wedding} />;
    default:
      return <RoyalHeritage wedding={{ ...wedding, templateSlug: "royal-heritage" }} />;
  }
}
