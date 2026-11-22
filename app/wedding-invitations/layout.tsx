import "./weddings.css";

/**
 * Route-scoped layout: loads the wedding-platform design + motion system
 * ONLY under /wedding-invitations (and /admin is separate). The existing
 * site (/, /dynamic-invitation) never loads this stylesheet.
 */
export default function WeddingInvitationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
