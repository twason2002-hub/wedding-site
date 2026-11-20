"use client";

import { useEffect, useState } from "react";

interface Wish {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

/**
 * Wishes — virtual guestbook. Reads/writes /api/weddings/wishes (Supabase
 * `wedding_wishes`, public insert + public read for live sites only).
 */
export default function Wishes({
  weddingSlug,
  accent,
  ink,
}: {
  weddingSlug: string;
  accent: string;
  ink: string;
}) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    fetch(`/api/weddings/wishes?wedding=${encodeURIComponent(weddingSlug)}`)
      .then((r) => (r.ok ? r.json() : { wishes: [] }))
      .then((d) => {
        if (live && Array.isArray(d.wishes)) setWishes(d.wishes);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [weddingSlug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/weddings/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weddingSlug, name: name.trim(), message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save your wish");
      setWishes((w) => [data.wish, ...w].slice(0, 50));
      setName("");
      setMessage("");
      setState("done");
      setTimeout(() => setState("idle"), 3000);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div>
      <form onSubmit={submit} className="mx-auto max-w-xl space-y-3 text-left">
        <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.22em]" style={{ color: accent }}>
              Your name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={60}
              placeholder="Aarav & Diya"
              className="w-full rounded-xl bg-white/70 px-4 py-3 text-sm shadow-[inset_0_0_0_0.75px_rgba(0,0,0,0.12)] outline-none placeholder:text-stone-400 focus:ring-2"
              style={{ color: ink }}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.22em]" style={{ color: accent }}>
              Your wish
            </span>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              minLength={2}
              maxLength={280}
              placeholder="Wishing you a lifetime of happiness…"
              className="w-full rounded-xl bg-white/70 px-4 py-3 text-sm shadow-[inset_0_0_0_0.75px_rgba(0,0,0,0.12)] outline-none placeholder:text-stone-400 focus:ring-2"
              style={{ color: ink }}
            />
          </label>
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={state === "sending"}
          className="wi-action-lift inline-flex min-h-[48px] items-center gap-2 rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white disabled:opacity-60"
          style={{ background: accent }}
        >
          <span>{state === "sending" ? "Sending…" : state === "done" ? "Wish sent ✓" : "Send a wish ✦"}</span>
        </button>
      </form>

      {wishes.length > 0 && (
        <ul className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2" aria-label="Guest wishes">
          {wishes.map((w) => (
            <li
              key={w.id}
              className="rounded-2xl bg-white/70 px-5 py-4 text-left shadow-[0_14px_34px_-18px_rgba(0,0,0,0.2),inset_0_0_0_0.75px_rgba(0,0,0,0.08)]"
            >
              <p className="text-sm leading-relaxed" style={{ color: ink }}>
                “{w.message}”
              </p>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: accent }}>
                — {w.name}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
