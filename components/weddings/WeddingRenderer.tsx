import type { WeddingData } from "@/lib/weddings/types";
import { DELIGHT_OFF, experienceFor } from "@/lib/weddings/template-experience";
import RoyalHeritage from "./templates/RoyalHeritage";
import FloralRomance from "./templates/FloralRomance";
import ModernMinimal from "./templates/ModernMinimal";
import TraditionalVivah from "./templates/TraditionalVivah";
import DestinationWedding from "./templates/DestinationWedding";
import ScrollProgress from "./ScrollProgress";
import SideBorders from "./SideBorders";
import GuestGreeting from "./GuestGreeting";
import QuickActions from "./QuickActions";
import MusicToggle, { WeddingMusicProvider } from "./MusicToggle";
import { WeddingMotionProvider, type MotionScene } from "./motion";

/**
 * Shared rendering engine: wedding data in, selected template out.
 * Renderer-level interactive layer (borders, guest greeting) is driven by
 * the template's experience config + admin flags.
 */
export default function WeddingRenderer({ wedding }: { wedding: WeddingData }) {
  const exp = experienceFor(wedding.templateSlug);
  const bordersOn = wedding.sections?.borders ?? exp.features.borders.enabled;
  const musicOn = Boolean(wedding.music?.enabled && wedding.sections?.music !== false);
  const darkMusic = wedding.templateSlug !== "floral-romance" && wedding.templateSlug !== "destination-wedding";
  const scene: MotionScene = {
    signature: exp.motion.signature,
    parallaxLayers: exp.motion.parallaxLayers ?? [],
    parallaxScrim: exp.motion.parallaxScrim ?? "none",
    accents: exp.motion.accents ?? {},
    delight: exp.motion.delight ?? DELIGHT_OFF,
  };

  return (
    <WeddingMotionProvider scene={scene}>
      <WeddingMusicProvider src={wedding.music?.src} enabled={musicOn}>
        <div className="wi-invite" data-template={wedding.templateSlug}>
          <ScrollProgress />
          {bordersOn && <SideBorders motif={exp.features.borders.motif} />}
          <GuestGreeting accent={exp.palette.accent} bride={wedding.couple.bride} groom={wedding.couple.groom} />
          <QuickActions wedding={wedding} />
          <MusicToggle dark={darkMusic} />
          {renderTemplate(wedding)}
        </div>
      </WeddingMusicProvider>
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