import type { TemplateDefinition } from "./types";

/**
 * Inviteo Template Registry — 5 Indian Wedding Invitation Designs.
 * Uses generated Indian wedding photography from /public/weddings/*.
 */
export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "tpl-royal-heritage",
    slug: "royal-heritage",
    name: "Palace Heritage",
    category: "royal",
    description:
      "A grand palace wedding card in deep maroon and gold. Features an ornate arch photo frame, velvet curtain opening, and traditional Indian motifs.",
    thumbnail: "/weddings/royal-couple.jpg",
    fonts: { display: "Cinzel, Cormorant Garamond, serif", body: "Plus Jakarta Sans, sans-serif" },
    palette: { bg: "#180907", ink: "#f6ead4", accent: "#d4af37", surface: "#26100c" },
    sections: ["opening", "story", "countdown", "events", "gallery", "venue", "rsvp", "footer"],
    animation: "envelope",
    active: true,
    sortOrder: 1,
  },
  {
    id: "tpl-floral-romance",
    slug: "floral-romance",
    name: "Floral Anand Karaj",
    category: "floral",
    description:
      "Soft pastel pink and rose gold with falling flower petals. Perfect for daytime weddings, Anand Karaj, and garden celebrations.",
    thumbnail: "/weddings/floral-couple.jpg",
    fonts: { display: "Cormorant Garamond, Playfair Display, serif", body: "Plus Jakarta Sans, sans-serif" },
    palette: { bg: "#fdf6f4", ink: "#4a252a", accent: "#c87d8a", surface: "#ffffff" },
    sections: ["opening", "story", "countdown", "events", "gallery", "venue", "rsvp", "footer"],
    animation: "bloom",
    active: true,
    sortOrder: 2,
  },
  {
    id: "tpl-modern-minimal",
    slug: "modern-minimal",
    name: "Neelam Blue",
    category: "minimal",
    description:
      "Midnight peacock blue and champagne gold. Inspired by Indian Sangeet nights, starlit courtyards, and deep blue silk.",
    thumbnail: "/weddings/minimal-couple.jpg",
    fonts: { display: "Cormorant Garamond, serif", body: "Plus Jakarta Sans, sans-serif" },
    palette: { bg: "#091526", ink: "#f4efe6", accent: "#d4af37", surface: "#10233f" },
    sections: ["opening", "story", "countdown", "events", "gallery", "venue", "rsvp", "footer"],
    animation: "unfold",
    active: true,
    sortOrder: 3,
  },
  {
    id: "tpl-traditional-vivah",
    slug: "traditional-vivah",
    name: "Shubh Vivah",
    category: "traditional",
    description:
      "Auspicious sindoor red and temple gold with Lord Ganesha blessings, Sanskrit mantras, marigold toran, and a glowing diya opening.",
    thumbnail: "/weddings/vivah-mandap.jpg",
    fonts: { display: "Cinzel, Playfair Display, serif", body: "Plus Jakarta Sans, sans-serif" },
    palette: { bg: "#4a0b0d", ink: "#fdf1d6", accent: "#f0b429", surface: "#631215" },
    sections: ["opening", "story", "countdown", "events", "gallery", "venue", "rsvp", "footer"],
    animation: "scroll",
    active: true,
    sortOrder: 4,
  },
  {
    id: "tpl-destination-wedding",
    slug: "destination-wedding",
    name: "Beach & Palace Destination",
    category: "destination",
    description:
      "Made for Goa, Udaipur, and Jaipur destination weddings — with full event schedule, hotel stay details, airport pickup info, and maps.",
    thumbnail: "/weddings/goa-beach.jpg",
    fonts: { display: "Cormorant Garamond, serif", body: "Plus Jakarta Sans, sans-serif" },
    palette: { bg: "#f4f7fb", ink: "#0b253c", accent: "#b86b43", surface: "#ffffff" },
    sections: ["opening", "story", "countdown", "events", "travel", "gallery", "venue", "rsvp", "footer"],
    animation: "postcard",
    active: true,
    sortOrder: 5,
  },
];

export function getTemplate(slug: string): TemplateDefinition | undefined {
  return TEMPLATES.find((t) => t.slug === slug && t.active);
}

export function listTemplates(): TemplateDefinition[] {
  return [...TEMPLATES].filter((t) => t.active).sort((a, b) => a.sortOrder - b.sortOrder);
}
