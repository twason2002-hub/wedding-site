import { getSetting, listDbTemplates } from "@/lib/weddings/db";
import WebsiteForm from "@/components/admin/WebsiteForm";

export const metadata = { title: "Create website — Inviteo Admin" };

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
