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
      className={`wi-face relative rounded-3xl p-8 text-center sm:p-10 ${
        dark ? "bg-[var(--t-card)] text-[var(--t-ink)]" : "bg-[var(--t-card)] text-[var(--t-ink)]"
      }`}
    >
      <FiligreeCorners color={dark ? "rgba(212,175,55,0.4)" : "rgba(143,107,27,0.35)"} />
      <p className="wi-soft text-[11px] uppercase tracking-[0.34em]">Share the Joy</p>
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
          className="wi-wa wi-cta"
        >
          <WhatsAppIcon size={17} />
          <span>Share on WhatsApp</span>
        </a>
        <button
          onClick={() => void copyInvite()}
          className="wi-cta-ghost"
        >
          {copied ? <CheckIcon size={15} /> : <ShareIcon size={15} />}
          <span>{copied ? "Invitation Link Copied" : "Copy Invitation Link"}</span>
        </button>
      </div>
      {wedding.contacts?.numbers?.length > 0 && (
        <div className="wi-rule-t wi-soft mt-6 space-y-1 pt-5 text-xs">
          <p className="uppercase tracking-[0.25em] text-[11px] mb-1.5">Family Hospitality Desk</p>
          {wedding.contacts.numbers.map((num) => (
            <p key={num}>{num}</p>
          ))}
        </div>
      )}
    </section>
  );
}
