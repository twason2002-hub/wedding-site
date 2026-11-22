/**
 * Directions tile under the Maps button. Links to the venue's real map query.
 */
import { MapPin } from "@/components/animate-ui/icons/map-pin";

export default function VenueQR({
  mapQuery,
  dark = false,
}: {
  mapQuery: string;
  dark?: boolean;
}) {
  const url = `https://maps.google.com/?q=${mapQuery}`;
  return (
    <div className="mt-4 flex justify-center">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        aria-label="Open directions to the venue"
        className="wi-action-lift inline-flex min-h-12 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
        style={
          dark
            ? { color: "#f6ead4", boxShadow: "inset 0 0 0 0.75px rgba(212,175,55,0.45)" }
            : { color: "#0f353e", boxShadow: "inset 0 0 0 0.75px rgba(15,53,62,0.28)" }
        }
      >
        <MapPin size={16} animateOnView aria-hidden="true" />
        Open directions
      </a>
    </div>
  );
}
