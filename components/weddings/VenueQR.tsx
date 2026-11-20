/**
 * VenueQR — "Scan for directions" tile under the Maps button.
 * PLACEHOLDER: faux-QR tile. Swap the inner tile with a real QR (qrcode pkg
 * encoding the Maps URL) — layout stays identical.
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
        data-qr="placeholder"
        aria-label="Scan for directions — opens venue map"
        className="wi-action-lift inline-flex flex-col items-center gap-2 rounded-2xl px-3 py-2"
      >
        <span className="block rounded-xl bg-white p-1.5 shadow-[0_10px_28px_-12px_rgba(0,0,0,0.35),inset_0_0_0_0.75px_rgba(0,0,0,0.12)]">
          <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
            <rect width="72" height="72" fill="#fff" />
            <g fill="#1c1917">
              <rect x="6" y="6" width="20" height="20" />
              <rect x="46" y="6" width="20" height="20" />
              <rect x="6" y="46" width="20" height="20" />
              <rect x="11" y="11" width="10" height="10" fill="#fff" />
              <rect x="51" y="11" width="10" height="10" fill="#fff" />
              <rect x="11" y="51" width="10" height="10" fill="#fff" />
              <rect x="14" y="14" width="4" height="4" />
              <rect x="54" y="14" width="4" height="4" />
              <rect x="14" y="54" width="4" height="4" />
              <rect x="32" y="6" width="4" height="4" />
              <rect x="38" y="10" width="4" height="4" />
              <rect x="32" y="16" width="4" height="4" />
              <rect x="6" y="32" width="4" height="4" />
              <rect x="12" y="36" width="4" height="4" />
              <rect x="32" y="32" width="8" height="8" />
              <rect x="44" y="30" width="4" height="4" />
              <rect x="50" y="36" width="4" height="4" />
              <rect x="58" y="30" width="4" height="4" />
              <rect x="32" y="44" width="4" height="4" />
              <rect x="38" y="50" width="4" height="4" />
              <rect x="44" y="46" width="4" height="4" />
              <rect x="50" y="52" width="4" height="4" />
              <rect x="58" y="48" width="4" height="4" />
              <rect x="62" y="56" width="4" height="4" />
              <rect x="46" y="60" width="4" height="4" />
              <rect x="54" y="62" width="4" height="4" />
            </g>
          </svg>
        </span>
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.28em] ${
            dark ? "text-[#f3e5c3]/70" : "text-[#5b708c]"
          }`}
        >
          <MapPin size={13} animateOnView aria-hidden="true" />
          Scan for directions
        </span>
      </a>
    </div>
  );
}
