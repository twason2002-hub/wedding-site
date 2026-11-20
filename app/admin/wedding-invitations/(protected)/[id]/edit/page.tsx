import { notFound } from "next/navigation";
import { getAdminWebsite, listDbTemplates } from "@/lib/weddings/db";
import { websiteToInput } from "@/lib/weddings/admin-map";
import WebsiteForm from "@/components/admin/WebsiteForm";

export const metadata = { title: "Edit website — Inviteo Admin" };

export default async function EditWebsitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getAdminWebsite(id);
  if (!data) notFound();

  const templates = await listDbTemplates();
  const initial = websiteToInput(data.row, data.content, data.images);

  return (
    <WebsiteForm
      mode="edit"
      templates={templates}
      initial={initial}
      defaultExpiryDays={initial.expiryDays}
    />
  );
}
