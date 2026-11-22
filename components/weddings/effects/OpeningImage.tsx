"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

/**
 * Opening artwork. The generated WebP is the face; `fallback` (the previous
 * SVG/CSS art) shows if that file fails to load.
 */
export default function OpeningImage({
  src,
  width,
  height,
  alt = "",
  className,
  style,
  priority = false,
  fallback,
}: {
  src: string;
  width: number;
  height: number;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  fallback: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return (
    // Generated art has no text; the opening button names the control.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={width}
      height={height}
      alt={alt}
      decoding="async"
      draggable={false}
      fetchPriority={priority ? "high" : "auto"}
      className={className}
      style={style}
      onError={() => setFailed(true)}
    />
  );
}

/** Map an image pixel onto an object-fit:cover box (object-position: center). */
export function coverPoint(
  boxW: number,
  boxH: number,
  imgW: number,
  imgH: number,
  ix: number,
  iy: number,
) {
  if (boxW < 1 || boxH < 1) return null;
  const scale = Math.max(boxW / imgW, boxH / imgH);
  const offsetX = (boxW - imgW * scale) / 2;
  const offsetY = (boxH - imgH * scale) / 2;
  return { x: ix * scale + offsetX, y: iy * scale + offsetY };
}
