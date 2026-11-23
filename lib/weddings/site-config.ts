/**
 * Platform contact defaults. Admin can override these in app_settings
 * (`site_contact`); public pages fall back here when Supabase has no row.
 * WhatsApp is stored as digits only so links can use https://wa.me/<digits>.
 */

export const DEFAULT_WHATSAPP_NUMBER = "919056314930";

export const GENERIC_WHATSAPP_MESSAGE = "Hi, I'd like to create a wedding invitation website.";

export function templateInterestMessage(templateName: string): string {
  return `Hi, I'm interested in the ${templateName} wedding invitation template. Please share details.`;
}

export interface SiteContact {
  whatsappNumber: string;
  email: string;
  instagramUrl: string;
}

export const DEFAULT_SITE_CONTACT: SiteContact = {
  whatsappNumber: DEFAULT_WHATSAPP_NUMBER,
  email: "",
  instagramUrl: "",
};

export const SITE_CONFIG = {
  brandName: "Inviteo",
  tagline: "Indian Wedding Invitation Websites",
} as const;

export const PRICING_NOTE =
  "Contact us on WhatsApp for pricing — easy on your pocket, guaranteed cheapest in the market.";

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Accepts "+91 90563 14930", "919056314930", or a 10-digit Indian mobile. */
export function normalizeWhatsappNumber(value: string): string {
  let digits = digitsOnly(value);
  if (digits.length === 10) digits = `91${digits}`;
  return digits;
}

export function isValidWhatsappNumber(digits: string): boolean {
  return /^[1-9]\d{7,14}$/.test(digits);
}

export function formatWhatsappDisplay(digits: string): string {
  if (digits.startsWith("91") && digits.length === 12) {
    const local = digits.slice(2);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return digits ? `+${digits}` : "";
}

export function whatsappLink(message: string, number: string = DEFAULT_WHATSAPP_NUMBER): string {
  const digits = normalizeWhatsappNumber(number);
  const safe = isValidWhatsappNumber(digits) ? digits : DEFAULT_WHATSAPP_NUMBER;
  return `https://wa.me/${safe}?text=${encodeURIComponent(message)}`;
}

export function isEmailSet(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Empty stays empty. A real Instagram URL is returned normalized, otherwise null. */
export function normalizeInstagramUrl(value: string): string | null {
  const raw = value.trim();
  if (!raw) return "";
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProtocol);
    const host = url.hostname.replace(/^www\./, "");
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (host !== "instagram.com") return null;
    if (!url.pathname || url.pathname === "/") return null;
    url.protocol = "https:";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function isInstagramSet(url: string): boolean {
  return Boolean(url.trim()) && normalizeInstagramUrl(url) !== null;
}
