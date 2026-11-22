import { getSetting, listDbTemplates } from "@/lib/weddings/db";
import WebsiteForm from "@/components/admin/WebsiteForm";
import { privatePageMetadata } from "@/lib/weddings/og";

export const metadata = privatePageMetadata(
  "New Wedding Website | Inviteo Admin",
  "Start a new Inviteo wedding invitation in the private admin. Pick a template, add the couple and events, and publish one link for both families.",
  "/admin/wedding-invitations/new",
);

export default async function NewWebsitePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template } = await searchParams;
  const templates = await listDbTemplates();
  const defaultExpiryDays = await getSetting<number>("default_expiry_days", 7);

  return (
    <WebsiteForm
      mode="create"
      templates={templates}
      defaultExpiryDays={defaultExpiryDays}
      preselectTemplate={template}
    />
  );
}
