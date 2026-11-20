/**
 * Platform site configuration — ALL business info lives here.
 *
 * TODO(owner): replace every PLACEHOLDER value below with real business
 * details before launch. Nothing on the homepage invents contact info,
 * pricing or social handles — unconfigured values render as neutral
 * "coming soon" states instead of fake details.
 */

export const SITE_CONFIG = {
  brandName: "Inviteo",
  tagline: "Indian Wedding Invitation Websites",
  // TODO(owner): real WhatsApp business number in international format, no "+".
  whatsappNumber: "PLACEHOLDER_WHATSAPP_NUMBER",
  // TODO(owner): real links.
  instagramUrl: "PLACEHOLDER_INSTAGRAM_URL",
  email: "PLACEHOLDER_EMAIL",
  phoneDisplay: "PLACEHOLDER_PHONE",
  /** Published one-time price for any of the five templates. */
  templatePriceInr: 499,
} as const;

export const TEMPLATE_PRICE_LABEL = `₹${SITE_CONFIG.templatePriceInr.toLocaleString("en-IN")}`;

export const TEMPLATE_PRICE_NOTE = `${TEMPLATE_PRICE_LABEL} one-time · same price for every design`;

/** True only when the owner has replaced the WhatsApp placeholder. */
export function isContactConfigured(): boolean {
  return !SITE_CONFIG.whatsappNumber.startsWith("PLACEHOLDER");
}

export function whatsappLink(message: string): string {
  if (!isContactConfigured()) return "/wedding-invitations#contact";
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
