"use client";

import { useState, useTransition } from "react";
import { saveSiteContact } from "@/app/admin/wedding-invitations/actions";
import {
  formatWhatsappDisplay,
  isEmailSet,
  normalizeInstagramUrl,
  normalizeWhatsappNumber,
  isValidWhatsappNumber,
  type SiteContact,
} from "@/lib/weddings/site-config";

export default function SiteContactForm({ initial }: { initial: SiteContact }) {
  const [whatsapp, setWhatsapp] = useState(initial.whatsappNumber);
  const [email, setEmail] = useState(initial.email);
  const [instagram, setInstagram] = useState(initial.instagramUrl);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const digits = normalizeWhatsappNumber(whatsapp);
  const preview = isValidWhatsappNumber(digits) ? formatWhatsappDisplay(digits) : "";

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSaved(false);
    if (!isValidWhatsappNumber(digits)) {
      setError("Enter a WhatsApp number with country code. 919582915979 or +91 95829 15979 both work.");
      return;
    }
    if (email.trim() && !isEmailSet(email)) {
      setError("That email looks incomplete. Clear the field to hide email on the site.");
      return;
    }
    if (instagram.trim() && normalizeInstagramUrl(instagram) === null) {
      setError("Instagram must be a profile link such as https://instagram.com/inviteo, or left blank.");
      return;
    }
    startTransition(async () => {
      const result = await saveSiteContact({
        whatsappNumber: digits,
        email: email.trim(),
        instagramUrl: instagram.trim(),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved(true);
    });
  }

  return (
    <form onSubmit={submit} className="adm-card adm-form-section">
      <div className="adm-section-head">
        <span className="adm-section-num">01</span>
        <h2 className="adm-h2">Site contact</h2>
      </div>
      <p className="adm-lead mb-5">
        WhatsApp is the only public contact until you add an email or Instagram. Empty fields stay hidden on the marketing site.
      </p>

      {error && (
        <div className="adm-banner adm-banner--err mb-4" role="alert">
          {error}
        </div>
      )}
      {saved && (
        <div className="adm-banner adm-banner--ok mb-4" role="status">
          Contact settings saved.
        </div>
      )}

      <div className="adm-form-grid">
        <div>
          <label className="adm-label" htmlFor="site-whatsapp">
            WhatsApp number
          </label>
          <input
            id="site-whatsapp"
            className="adm-field"
            inputMode="tel"
            autoComplete="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="919582915979"
            required
          />
          <p className="adm-hint">
            Stored as digits for wa.me. {preview ? `Guests see ${preview}.` : "Include the country code."}
          </p>
        </div>
        <div>
          <label className="adm-label" htmlFor="site-email">
            Email <span className="font-normal">(optional)</span>
          </label>
          <input
            id="site-email"
            className="adm-field"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Leave blank to hide"
          />
          <p className="adm-hint">Shown in the footer only after a valid address is saved.</p>
        </div>
        <div>
          <label className="adm-label" htmlFor="site-instagram">
            Instagram <span className="font-normal">(optional)</span>
          </label>
          <input
            id="site-instagram"
            className="adm-field"
            inputMode="url"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="Leave blank to hide"
          />
          <p className="adm-hint">A full https://instagram.com/… link. Hidden while this is empty.</p>
        </div>
      </div>

      <button className="adm-btn adm-btn--gold mt-6" type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save contact settings"}
      </button>
    </form>
  );
}
