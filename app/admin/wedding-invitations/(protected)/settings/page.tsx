import SiteContactForm from "@/components/admin/SiteContactForm";
import { getSiteContact } from "@/lib/weddings/db";
import { privatePageMetadata } from "@/lib/weddings/og";

export const metadata = privatePageMetadata(
  "Contact Settings | Inviteo Admin",
  "Update the Inviteo WhatsApp number, email, and Instagram shown on public marketing pages. Guest invitations still use each couple's own contact numbers.",
  "/admin/wedding-invitations/settings",
);

export default async function SiteContactSettingsPage() {
  const contact = await getSiteContact();

  return (
    <main className="adm-wrap pb-20 pt-8">
      <p className="adm-eyebrow adm-eyebrow--gold">Marketing site</p>
      <h1 className="adm-h1 mt-2">Contact</h1>
      <p className="adm-lead mt-2 max-w-xl">
        These details are used by every Inviteo WhatsApp button. Wedding invitations still use the couple&apos;s own numbers from each website.
      </p>
      <div className="mt-6 max-w-xl">
        <SiteContactForm initial={contact} />
      </div>
    </main>
  );
}
