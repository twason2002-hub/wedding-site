import type { WeddingData } from "@/lib/weddings/types";
import { experienceFor } from "@/lib/weddings/template-experience";
import RoyalHeritage from "./templates/RoyalHeritage";
import FloralRomance from "./templates/FloralRomance";
import ModernMinimal from "./templates/ModernMinimal";
import TraditionalVivah from "./templates/TraditionalVivah";
import DestinationWedding from "./templates/DestinationWedding";
import ScrollProgress from "./ScrollProgress";
import SideBorders from "./SideBorders";
import GuestGreeting from "./GuestGreeting";
import QuickActions from "./QuickActions";
import { WeddingMotionProvider } from "./motion";

/**
 * Shared rendering engine: wedding data in, selected template out.
 * Renderer-level interactive layer (borders, guest greeting) is driven by
 * the template's experience config + admin flags.
 */
export default function WeddingRenderer({ wedding }: { wedding: WeddingData }) {
  const exp = experienceFor(wedding.templateSlug);
  const bordersOn = wedding.sections?.borders ?? exp.features.borders.enabled;

  return (
    <WeddingMotionProvider value={exp.motion.signature}>
      <ScrollProgress />
      {bordersOn && <SideBorders motif={exp.features.borders.motif} />}
      <GuestGreeting accent={exp.palette.accent} bride={wedding.couple.bride} groom={wedding.couple.groom} />
      <QuickActions wedding={wedding} />
      {renderTemplate(wedding)}
    </WeddingMotionProvider>
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