export const DEMO_SLUGS = [
  "aarav-diya-royal",
  "kabir-anaya-floral",
  "isha-vihaan-minimal",
  "aditi-rohan-vivah",
  "sara-arjun-goa",
] as const;

export function isDemoSlug(slug: string): boolean {
  return (DEMO_SLUGS as readonly string[]).includes(slug);
}
