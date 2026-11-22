import AdminLoginForm from "@/components/weddings/AdminLoginForm";

export const metadata = { title: "Admin sign in — Inviteo" };

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
