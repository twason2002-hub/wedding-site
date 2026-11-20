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
  return <AdminLoginForm initialError={initialError} />;
}
