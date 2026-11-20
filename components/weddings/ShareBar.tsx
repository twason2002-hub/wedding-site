"use client";

import { useState } from "react";
import type { WeddingData } from "@/lib/weddings/types";
import { shareTextFor, whatsappShare } from "@/lib/weddings/helpers";
import { FiligreeCorners } from "./LuxuryOrnaments";
import { CheckIcon, ShareIcon, WhatsAppIcon } from "./WeddingIcons";

export default function ShareBar({ wedding, dark = false }: { wedding: WeddingData; dark?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function nativeShare() {
    const url = window.location.href;
    const shareData = {
      title: `${wedding.couple.bride} & ${wedding.couple.groom}`,
      text: shareTextFor(wedding, url),
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(`${shareTextFor(wedding, url)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    } catch {
      /* fallback */
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
          href={whatsappShare(
            `You are cordially invited to celebrate the wedding of ${wedding.couple.bride} & ${wedding.couple.groom} (${wedding.couple.weddingDateDisplay}). Open our digital invitation:`
          )}
          target="_blank"
          rel="noreferrer"
          className="wi-action-lift inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#1faa53] px-7 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-md"
        >
          <WhatsAppIcon size={17} />
          <span>Share on WhatsApp</span>
        </a>
        <button
          onClick={nativeShare}
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
