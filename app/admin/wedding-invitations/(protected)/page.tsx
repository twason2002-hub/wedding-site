import Link from "next/link";
import { listAdminWebsites, listDbTemplates } from "@/lib/weddings/db";
import DashboardClient from "@/components/admin/DashboardClient";

export const metadata = { title: "Websites — Inviteo Admin" };

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { created } = await searchParams;

  let websites: Awaited<ReturnType<typeof listAdminWebsites>> = [];
  let templates: Awaited<ReturnType<typeof listDbTemplates>> = [];
  let loadError = "";
  try {
    [websites, templates] = await Promise.all([listAdminWebsites(), listDbTemplates()]);
  } catch (err) {
    loadError = (err as Error).message;
  }

  return (
    <main className="adm-wrap pb-20 pt-8">
      <section className="adm-hero">
        <span className="adm-hero-glow" aria-hidden="true" />
        <div className="adm-hero-inner">
          <div>
            <p className="adm-eyebrow adm-eyebrow--gold">Wedding website management</p>
            <h1 className="adm-h1 mt-2">Wedding websites</h1>
            <p className="adm-lead mt-2 max-w-xl">
              Pick a template, fill in the couple&apos;s details, publish to a unique link.
              Client sites expire after the wedding — demo sites never expire.
            </p>
          </div>
          <Link href="/admin/wedding-invitations/new" className="adm-btn adm-btn--gold">
            Create website
          </Link>
        </div>
      </section>

      {created && (
        <div className="adm-banner adm-banner--ok mt-6" role="status">
          Website created — live at <strong>/{created}</strong>. Share the link with the couple.
        </div>
      )}
      {loadError && (
        <div className="adm-banner adm-banner--err mt-6" role="alert">
          Could not load websites: {loadError}. Check the Supabase connection and refresh.
        </div>
      )}

      <DashboardClient websites={websites} templates={templates} />
    </main>
  );
}
