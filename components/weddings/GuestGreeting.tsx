"use client";

import { useState, useSyncExternalStore } from "react";

function guestFromUrl(): string | null {
  try {
    const q = new URLSearchParams(window.location.search);
    return q.get("guest")?.trim().slice(0, 60) || q.get("g")?.trim().slice(0, 60) || null;
  } catch {
    return null;
  }
}

/**
 * GuestGreeting — personalised welcome from ?guest= / ?g= links.
 * Client-only, React-escaped, length-capped. Nothing touches storage or network.
 */
export default function GuestGreeting({ accent }: { accent: string }) {
  const name = useSyncExternalStore(
    () => () => {},
    guestFromUrl,
    () => null
  );
  const [gone, setGone] = useState(false);

  if (!name || gone) return null;

  return (
    <p
      role="status"
      className="relative z-10 mx-auto mt-4 flex w-fit max-w-[92vw] items-center gap-3 rounded-full bg-white/85 px-5 py-2 text-center text-sm shadow-lg backdrop-blur-md"
    >
      <span>
        Welcome, <strong>{name}</strong>
      </span>
      <button
        onClick={() => setGone(true)}
        aria-label="Dismiss greeting"
        className="inline-flex min-h-[32px] min-w-[32px] items-center justify-center rounded-full text-xs"
        style={{ color: accent }}
      >
        ✕
      </button>
    </p>
  );
}
