import type { SupabaseClient } from "@supabase/supabase-js";
import { slugifyCouple } from "./form-utils";

export { slugifyCouple };

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug) && slug.length >= 3 && slug.length <= 80;
}

/** Finds a free slug: base, base-2 … base-50, then base-<random>. */
export async function uniqueSlug(
  supabase: SupabaseClient,
  base: string,
  excludeId?: string,
): Promise<string> {
  const candidates = [base];
  for (let i = 2; i <= 50; i++) candidates.push(`${base}-${i}`);
  candidates.push(`${base}-${Math.random().toString(36).slice(2, 6)}`);

  for (const candidate of candidates) {
    let query = supabase.from("wedding_websites").select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}
