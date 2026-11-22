import "./weddings.css";

/**
 * Route-scoped layout: loads the wedding-platform design + motion system
 * ONLY under /wedding-invitations. Admin styles stay in the admin layout.
 */
export default function WeddingInvitationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
