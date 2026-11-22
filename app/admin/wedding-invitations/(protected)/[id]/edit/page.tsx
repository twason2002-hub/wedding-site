import { notFound } from "next/navigation";
import { getAdminWebsite, listDbTemplates } from "@/lib/weddings/db";
import { websiteToInput } from "@/lib/weddings/admin-map";
import WebsiteForm from "@/components/admin/WebsiteForm";
import { privatePageMetadata } from "@/lib/weddings/og";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return privatePageMetadata(
    "Edit Wedding Website | Inviteo Admin",
    "Edit one Inviteo wedding invitation in the private admin. Update the couple, events, venues, and photos, then publish the same guest link again.",
    `/admin/wedding-invitations/${id}/edit`,
  );
}

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
