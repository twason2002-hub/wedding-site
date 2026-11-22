import { ImageResponse } from "next/og";
import type { OgCardInput } from "./og";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Flat, text-and-shape card. No guest names, no photographs.
 * Satori output is a PNG with an image/png content-type and no redirect.
 */
export function renderOgImage(card: OgCardInput) {
  const motif = motifNodes(card);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: card.bg,
          color: card.ink,
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: `1px solid ${card.accent}`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 40,
            border: `1px solid ${card.accent}`,
            opacity: 0.45,
            display: "flex",
          }}
        />
        {motif}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 88px",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: card.accent,
              fontFamily: "sans-serif",
            }}
          >
            {card.eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: card.title.length > 28 ? 54 : card.motif === "brand" ? 64 : 72,
              lineHeight: 1.02,
              maxWidth: 980,
            }}
          >
            {card.title}
          </div>
          <div style={{ display: "flex", marginTop: 12, fontSize: 32, fontStyle: "italic", opacity: 0.9 }}>
            {card.line}
          </div>
          {card.designs?.length ? (
            <div style={{ display: "flex", marginTop: 28 }}>
              {card.designs.map((design, index) => (
                <div
                  key={design.name}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: 150,
                    marginLeft: index === 0 ? 0 : 18,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      height: 64,
                      borderRadius: 14,
                      background: design.swatch,
                      border: `1px solid ${card.accent}`,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      marginTop: 8,
                      fontSize: 16,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      fontFamily: "sans-serif",
                      color: card.accent,
                    }}
                  >
                    {design.name}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <div style={{ display: "flex", marginTop: 36, alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                background: card.surface,
                color: card.ink,
                border: `1px solid ${card.accent}`,
                borderRadius: 999,
                padding: "14px 28px",
                fontSize: 28,
                fontFamily: "sans-serif",
              }}
            >
              {card.date}
            </div>
            <div
              style={{
                display: "flex",
                marginLeft: 22,
                fontSize: 26,
                fontFamily: "sans-serif",
                color: card.accent,
              }}
            >
              {card.city}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}

function motifNodes(card: OgCardInput) {
  if (card.motif === "floral") {
    return (
      <div style={{ position: "absolute", right: 80, top: 80, display: "flex" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: 28,
              height: 48,
              marginLeft: i === 0 ? 0 : 8,
              borderRadius: 40,
              background: card.accent,
              opacity: 0.45,
            }}
          />
        ))}
      </div>
    );
  }
  if (card.motif === "destination") {
    return (
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", height: 70, background: "#1d6f86", opacity: 0.55 }} />
        <div style={{ display: "flex", height: 36, background: "#e6d3b3" }} />
      </div>
    );
  }
  if (card.motif === "minimal") {
    return (
      <div style={{ position: "absolute", right: 90, top: 90, display: "flex", flexDirection: "column" }}>
        <div style={{ width: 120, height: 1, background: card.accent, display: "flex" }} />
        <div style={{ width: 72, height: 1, background: card.accent, marginTop: 12, display: "flex" }} />
      </div>
    );
  }
  if (card.motif === "vivah") {
    return (
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 90,
          width: 88,
          height: 88,
          borderRadius: 88,
          border: `3px solid ${card.accent}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: card.accent,
          fontSize: 40,
        }}
      >
        ✦
      </div>
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        right: 92,
        top: 78,
        width: 150,
        height: 190,
        borderTopLeftRadius: 120,
        borderTopRightRadius: 120,
        border: `2px solid ${card.accent}`,
        display: "flex",
        opacity: 0.8,
      }}
    />
  );
}
