"use client";

import { useState } from "react";
import type { WeddingData } from "@/lib/weddings/types";
import { Particles } from "@animate-ui/react/primitives/effects/particles";

export default function RsvpForm({
  wedding,
  dark = false,
  variant = "default",
}: {
  wedding: WeddingData;
  dark?: boolean;
  variant?: "default" | "royal" | "floral" | "minimal" | "vivah" | "coastal";
}) {
  const [form, setForm] = useState({
    name: "",
    attending: "yes",
    eventIds: wedding.events.map((e) => e.id),
    guests: 2,
    diet: "",
    message: "",
  });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  // Isolated phone previews (?preview=auto) must never write guest RSVPs.
  const isPreview =
    typeof window !== "undefined" &&
    (() => {
      try {
        return new URLSearchParams(window.location.search).get("preview") === "auto";
      } catch {
        return false;
      }
    })();

  const isDark = dark || variant === "royal";
  const waNumber = wedding.contacts?.rsvpNumber?.replace(/\D/g, "");
  const waHref = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
        `RSVP for ${wedding.couple.bride} & ${wedding.couple.groom}'s wedding:\nName: ${form.name}\nAttending: ${
          form.attending === "yes" ? "Yes" : "No"
        }\nGuests: ${form.guests}`
      )}`
    : null;

  const input = `w-full rounded-xl px-4 py-3.5 text-base min-h-[50px] focus:outline-none ${
    isDark
      ? "bg-white/[0.04] text-[#f9ebd2] placeholder:text-[#f9ebd2]/50 shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.35)]"
      : variant === "minimal"
      ? "rounded-none bg-transparent text-[#171513] placeholder:text-[#7c7267]/60 shadow-[inset_0_0_0_0.75px_rgba(23,21,19,0.25)]"
      : variant === "floral"
      ? "rounded-2xl bg-white text-[#4a252a] placeholder:text-[#b36a7a]/55 shadow-[inset_0_0_0_0.75px_rgba(217,138,156,0.45)]"
      : "bg-white text-stone-900 placeholder:text-stone-400 shadow-[inset_0_0_0_0.75px_rgba(28,25,23,0.2)]"
  }`;

  const labelCls = `mb-2 block text-[11px] uppercase tracking-[0.25em] font-medium ${
    isDark ? "text-[#e8cf8f]" : variant === "floral" ? "text-[#9e5262]" : "text-stone-600"
  }`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (isPreview) return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/weddings/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weddingSlug: wedding.slug,
          name: form.name.trim(),
          attending: form.attending === "yes",
          eventIds: form.eventIds,
          guests: Number(form.guests),
          diet: form.diet,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (state === "done") {
    return (
      <Particles animate>
      <div
        className={`rounded-3xl p-10 text-center ${
          isDark
            ? "bg-[#23100b] text-[#f9ebd2] shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.45)]"
            : "bg-emerald-50/70 text-stone-900 shadow-[inset_0_0_0_0.75px_rgba(16,185,129,0.35)]"
        }`}
        role="status"
      >
        <svg
          className="wi-success-check mx-auto mb-4 h-14 w-14"
          viewBox="0 0 52 52"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="26"
            cy="26"
            r="23"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
          <path
            className="wi-success-tick"
            d="M16 27.5 23 34l13-15"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
          />
        </svg>
        <p className="font-display-luxury text-4xl italic">With Gratitude</p>
        <p className="mt-3 text-base opacity-85">
          Your RSVP has been recorded for {wedding.couple.bride} &amp; {wedding.couple.groom}&apos;s celebration.
        </p>
      </div>
      </Particles>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl space-y-6 text-left">
      <div>
        <label htmlFor="rsvp-name" className={labelCls}>
          Full Name &amp; Family *
        </label>
        <input
          id="rsvp-name"
          className={input}
          required
          minLength={2}
          maxLength={80}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Maharajkumar Devraj & Family"
        />
      </div>

      <fieldset>
        <legend className={labelCls}>Your Presence *</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            ["yes", "Joyfully Accepts"],
            ["no", "Regretfully Declines"],
          ].map(([v, label]) => {
            const active = form.attending === v;
            return (
              <label
                key={v}
                className={`wi-action-lift flex items-center justify-center gap-2.5 rounded-xl px-5 py-3.5 text-sm font-medium cursor-pointer min-h-[50px] ${
                  active
                    ? isDark
                      ? "bg-[#d4af37]/20 text-[#f9ebd2] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.75)]"
                      : variant === "floral"
                      ? "bg-[#fdf1f4] text-[#4a252a] shadow-[inset_0_0_0_1px_rgba(200,125,138,0.75)]"
                      : "bg-stone-900 text-white"
                    : isDark
                    ? "bg-white/[0.03] text-white/70 shadow-[inset_0_0_0_0.75px_rgba(255,255,255,0.16)]"
                    : "bg-white/70 text-stone-700 shadow-[inset_0_0_0_0.75px_rgba(28,25,23,0.18)]"
                }`}
              >
                <input
                  type="radio"
                  name="attending"
                  value={v}
                  checked={active}
                  onChange={(e) => setForm({ ...form, attending: e.target.value })}
                  className="sr-only"
                />
                <span>{active ? "✦" : "○"}</span>
                <span>{label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelCls}>Celebrations Attending</legend>
        <div className="flex flex-wrap gap-2.5">
          {wedding.events.map((ev) => {
            const checked = form.eventIds.includes(ev.id);
            return (
              <label
                key={ev.id}
                className={`wi-action-lift flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium cursor-pointer min-h-[44px] ${
                  checked
                    ? isDark
                      ? "bg-[#d4af37]/20 text-[#f9ebd2] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.7)]"
                      : variant === "floral"
                      ? "bg-[#fdf1f4] text-[#4a252a] shadow-[inset_0_0_0_1px_rgba(200,125,138,0.7)]"
                      : "bg-stone-900 text-white"
                    : isDark
                    ? "bg-white/[0.03] text-white/65 shadow-[inset_0_0_0_0.75px_rgba(255,255,255,0.15)]"
                    : "bg-white/80 text-stone-600 shadow-[inset_0_0_0_0.75px_rgba(28,25,23,0.18)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      eventIds: e.target.checked
                        ? [...form.eventIds, ev.id]
                        : form.eventIds.filter((id) => id !== ev.id),
                    })
                  }
                  className="sr-only"
                />
                <span>{checked ? "✓" : "+"}</span>
                <span>{ev.name}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="rsvp-guests" className={labelCls}>
            Number of Guests
          </label>
          <input
            id="rsvp-guests"
            type="number"
            min={1}
            max={10}
            className={input}
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
          />
        </div>
        <div>
          <label htmlFor="rsvp-diet" className={labelCls}>
            Dietary Preferences
          </label>
          <input
            id="rsvp-diet"
            className={input}
            maxLength={120}
            value={form.diet}
            onChange={(e) => setForm({ ...form, diet: e.target.value })}
            placeholder="Pure Veg / Jain / Allergies"
          />
        </div>
      </div>

      <div>
        <label htmlFor="rsvp-msg" className={labelCls}>
          Personal Note &amp; Blessings
        </label>
        <textarea
          id="rsvp-msg"
          className={input}
          rows={3}
          maxLength={500}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Share your blessings, arrival details, or a song for the sangeet…"
        />
      </div>

      {state === "error" && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending" || isPreview}
        title={isPreview ? "RSVP is disabled in preview mode" : undefined}
        className={`wi-action-lift w-full rounded-full py-4 text-xs font-semibold uppercase tracking-[0.28em] min-h-[54px] disabled:opacity-60 ${
          isDark
            ? "bg-gradient-to-r from-[#d4af37] to-[#9b7318] text-[#170906] shadow-[0_12px_30px_rgba(212,175,55,0.3)]"
            : variant === "floral"
            ? "bg-[#4a252a] text-white shadow-[0_12px_30px_rgba(74,37,42,0.25)]"
            : variant === "minimal"
            ? "rounded-none bg-[#171513] text-white"
            : "bg-stone-900 text-white"
        }`}
      >
        {state === "sending" ? "Confirming Attendance…" : "Confirm RSVP Attendance ✦"}
      </button>
      {isPreview && (
        <p className={`text-center text-xs ${isDark ? "text-[#f9ebd2]/60" : "text-stone-500"}`}>
          Preview mode — RSVP is disabled here, live on your link.
        </p>
      )}

      {waHref && (
        <p className={`text-center text-sm ${isDark ? "text-[#f9ebd2]/75" : "text-stone-600"}`}>
          Prefer WhatsApp?{" "}
          <a href={waHref} target="_blank" rel="noreferrer" className="wi-link font-medium">
            Send your RSVP on WhatsApp
          </a>
        </p>
      )}
    </form>
  );
}
