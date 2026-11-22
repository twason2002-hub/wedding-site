import "./admin.css";
import { privatePageMetadata } from "@/lib/weddings/og";

/**
 * Route-scoped admin design system — loaded only under /admin.
 * Never touches the public site. Admin is private: no public page links
 * here, and every admin route is kept out of search engines.
 */
export const metadata = privatePageMetadata(
  "Inviteo Admin",
  "Private Inviteo admin for wedding invitation websites. These pages are not indexed and are not part of the public template gallery or guest invitations.",
  "/admin",
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
