import type { WeddingData } from "@/lib/weddings/types";
import { experienceFor } from "@/lib/weddings/template-experience";
import Reactions from "./Reactions";
import InteractiveBlessings from "./InteractiveBlessings";

/**
 * GuestSections — guest delight: interactive blessings + reactions.
 * Wishes + photo uploads are parked (components/APIs/migrations kept,
 * not rendered). Blessings text comes from the template's motion config.
 */
export default function GuestSections({ wedding }: { wedding: WeddingData }) {
  const exp = experienceFor(wedding.templateSlug);
  const showBlessings = wedding.sections?.blessings ?? true;
  const showReactions = wedding.sections?.reactions ?? exp.features.reactions;
  if (!showBlessings && !showReactions) return null;

  const blessings = exp.features.blessings;

  return (
    <>
      {showBlessings && (
        <section aria-label="Interactive blessings">
          <InteractiveBlessings blessings={blessings} accent={exp.palette.accent} ink={exp.palette.ink} />
        </section>
      )}
      {showReactions && (
        <section aria-label="Send reactions" className="mt-12">
          <Reactions accent={exp.palette.accent} />
        </section>
      )}
    </>
  );
}
