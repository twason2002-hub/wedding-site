"use client";

import { useEffect, useState } from "react";
import type { WeddingData } from "@/lib/weddings/types";
import { absoluteInviteUrl, shareTextFor, whatsappShare } from "@/lib/weddings/helpers";
import { FiligreeCorners } from "./LuxuryOrnaments";
import { CheckIcon, ShareIcon, WhatsAppIcon } from "./WeddingIcons";

export default function ShareBar({ wedding, dark = false }: { wedding: WeddingData; dark?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [waHref, setWaHref] = useState("https://wa.me/");

  useEffect(() => {
    const url = absoluteInviteUrl();
    setWaHref(whatsappShare(shareTextFor(wedding, url)));
  }, [wedding]);

  function inviteUrl() {
    return absoluteInviteUrl();
  }

  async function shareInvite() {
    const url = inviteUrl();
    const text = shareTextFor(wedding, url);
    const shareData = {
      title: `${wedding.couple.bride} & ${wedding.couple.groom}`,
      text,
      url,
    };
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    window.open(whatsappShare(text), "_blank", "noopener,noreferrer");
  }

  async function copyInvite() {
    const url = inviteUrl();
    try {
      await navigator.clipboard.writeText(shareTextFor(wedding, url));
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    } catch {
      window.open(whatsappShare(shareTextFor(wedding, url)), "_blank", "noopener,noreferrer");
    }
  }

  return (
    <section
      aria-label="Share Invitation"
      className={`relative rounded-3xl p-8 sm:p-10 text-center ${
        dark
          ? "bg-white/[0.025] text-[#f9ebd2] shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.32)]"
          : "bg-white/90 text-stone-900 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.12),inset_0_0_0_0.75px_rgba(0,0,0,0.1)]"
      }`}
    >
      <FiligreeCorners color={dark ? "rgba(212,175,55,0.4)" : "rgba(143,107,27,0.35)"} />
      <p className="text-[11px] uppercase tracking-[0.34em] opacity-65">Share the Joy</p>
      <h2 className="font-display-luxury mt-2 text-3xl sm:text-4xl italic">
        Extend This Invitation to Family
      </h2>
      {wedding.hashtag && (
        <p className={`mt-2 text-sm font-medium tracking-widest ${dark ? "text-[#d4af37]" : "text-stone-600"}`}>
          {wedding.hashtag}
        </p>
      )}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => {
            event.preventDefault();
            void shareInvite();
          }}
          className="wi-wa wi-action-lift inline-flex min-h-12 items-center gap-2 rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.22em] shadow-md"
        >
          <WhatsAppIcon size={17} />
          <span>Share on WhatsApp</span>
        </a>
        <button
          onClick={() => void copyInvite()}
          className={`wi-action-lift inline-flex min-h-[48px] items-center gap-2 rounded-full px-7 py-3 text-xs font-medium uppercase tracking-[0.22em] ${
            dark
              ? "text-[#f9ebd2] shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.45)]"
              : "text-stone-800 shadow-[inset_0_0_0_0.75px_rgba(28,25,23,0.25)]"
          }`}
        >
          {copied ? <CheckIcon size={15} /> : <ShareIcon size={15} />}
          <span>{copied ? "Invitation Link Copied" : "Copy Invitation Link"}</span>
        </button>
      </div>
      {wedding.contacts?.numbers?.length > 0 && (
        <div className="mt-6 border-t border-current/10 pt-5 text-xs opacity-75 space-y-1">
          <p className="uppercase tracking-[0.25em] text-[11px] mb-1.5">Family Hospitality Desk</p>
          {wedding.contacts.numbers.map((num) => (
            <p key={num}>{num}</p>
          ))}
        </div>
      )}
    </section>
  );
}
