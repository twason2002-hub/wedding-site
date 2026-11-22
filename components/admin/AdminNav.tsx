"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/wedding-invitations", label: "Websites" },
  { href: "/admin/wedding-invitations/new", label: "Create" },
  { href: "/admin/wedding-invitations/settings", label: "Contact" },
];

function isCurrent(path: string, href: string): boolean {
  if (href.endsWith("/new") || href.endsWith("/settings")) return path === href || path.startsWith(`${href}/`);
  return path === href || /^\/admin\/wedding-invitations\/[^/]+/.test(path);
}

export default function AdminNav() {
  const path = usePathname() ?? "";

  return (
    <nav className="adm-topnav" aria-label="Admin">
      {LINKS.map((link) => (
        <Link key={link.href} href={link.href} aria-current={isCurrent(path, link.href) ? "page" : undefined}>
          {link.label}
        </Link>
      ))}
      <Link href="/wedding-invitations/templates" target="_blank" rel="noreferrer">
        Previews
      </Link>
    </nav>
  );
}
