import { redirect } from "next/navigation";
import { createClient } from "./server";

/** Admin gate: authenticated Supabase user + admin_users membership. */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/wedding-invitations/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("role, email")
    .eq("id", user.id)
    .maybeSingle();
  if (!admin) redirect("/admin/wedding-invitations/login?error=not-admin");

  return { supabase, user, admin };
}
