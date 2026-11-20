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
  // TODO(owner): confirm pricing model before publishing any numbers.
  pricingNote: "PLACEHOLDER_PRICING",
} as const;

/** True only when the owner has replaced the WhatsApp placeholder. */
export function isContactConfigured(): boolean {
  return !SITE_CONFIG.whatsappNumber.startsWith("PLACEHOLDER");
}

export function whatsappLink(message: string): string {
  if (!isContactConfigured()) return "#contact";
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
