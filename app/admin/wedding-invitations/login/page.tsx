import AdminLoginForm from "@/components/weddings/AdminLoginForm";
import { privatePageMetadata } from "@/lib/weddings/og";

export const metadata = privatePageMetadata(
  "Admin Sign In | Inviteo",
  "Sign in to the private Inviteo admin to manage wedding websites, guest RSVPs, wishes, photos, and the public WhatsApp contact on marketing pages.",
  "/admin/wedding-invitations/login",
);

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const initialError =
    error === "not-admin" ? "This account does not have admin access." : "";
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return <AdminLoginForm initialError={initialError} configured={configured} />;
}
