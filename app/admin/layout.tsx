import "./admin.css";

/**
 * Route-scoped admin design system — loaded only under /admin.
 * Never touches the public site. Admin is private: no public page links
 * here, and every admin route is kept out of search engines.
 */
export const metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
