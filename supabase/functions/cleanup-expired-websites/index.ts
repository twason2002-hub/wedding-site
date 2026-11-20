import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BUCKET = "wedding-images";

Deno.serve(async (req: Request) => {
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  });

  const { data: secretRow } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "cleanup_secret")
    .single();
  const expected = secretRow?.value as string | undefined;
  const provided = req.headers.get("x-cleanup-secret");
  if (!expected || !provided || provided !== expected) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: expiredCount, error: expireErr } = await supabase.rpc("expire_wedding_websites");
  if (expireErr) {
    return new Response(JSON.stringify({ error: expireErr.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: retentionRow } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "retention_days")
    .single();
  const retentionDays = Number(retentionRow?.value ?? 30) || 30;
  const cutoff = new Date(Date.now() - retentionDays * 86400_000).toISOString();

  // no_expiry sites (demos) are never purged, whatever their status says.
  const { data: expiredSites } = await supabase
    .from("wedding_websites")
    .select("id, slug")
    .eq("status", "expired")
    .eq("no_expiry", false)
    .lt("expires_at", cutoff);
  const { data: deletedSites } = await supabase
    .from("wedding_websites")
    .select("id, slug")
    .eq("status", "deleted")
    .eq("no_expiry", false)
    .lt("deleted_at", cutoff);

  const targets = [...(expiredSites ?? []), ...(deletedSites ?? [])];
  const purged: string[] = [];
  const failures: string[] = [];

  for (const site of targets) {
    const { data: files } = await supabase.storage.from(BUCKET).list(site.id, { limit: 1000 });
    if (files && files.length > 0) {
      const paths = files.map((f) => `${site.id}/${f.name}`);
      const { error: rmErr } = await supabase.storage.from(BUCKET).remove(paths);
      if (rmErr) {
        failures.push(`${site.slug}: storage ${rmErr.message}`);
        continue;
      }
    }
    const { error: delErr } = await supabase.from("wedding_websites").delete().eq("id", site.id);
    if (delErr) failures.push(`${site.slug}: db ${delErr.message}`);
    else purged.push(site.slug);
  }

  return new Response(
    JSON.stringify({ markedExpired: expiredCount ?? 0, purged, failures, retentionDays }),
    { headers: { "Content-Type": "application/json" } },
  );
});
