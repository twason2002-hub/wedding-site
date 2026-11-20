import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { signOut } from "../actions";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { admin } = await requireAdmin();

  return (
    <div className="adm-shell">
      <header className="adm-topbar">
        <div className="adm-wrap adm-topbar-inner">
          <Link href="/admin/wedding-invitations" className="adm-brand">
            <span className="adm-brand-dot" aria-hidden="true" />
            Inviteo
            <span className="adm-brand-sub">Admin</span>
          </Link>
          <nav className="adm-topnav" aria-label="Admin">
            <Link href="/admin/wedding-invitations" aria-current="page">Websites</Link>
            <Link href="/admin/wedding-invitations/new">Create website</Link>
            <Link href="/wedding-invitations/templates" target="_blank" rel="noreferrer">
              Template previews ↗
            </Link>
          </nav>
          <div className="adm-user">
            <span className="hidden sm:inline">{admin.email}</span>
            <form action={signOut}>
              <button className="adm-btn adm-btn--outline adm-btn--sm" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
