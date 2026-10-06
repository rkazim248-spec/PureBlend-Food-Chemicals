"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/offers", label: "Offers" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/seo", label: "SEO" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full border-b border-neutral-800 bg-neutral-950 lg:w-60 lg:border-b-0 lg:border-r">
      <nav aria-label="Admin" className="flex gap-1 overflow-x-auto p-3 lg:flex-col">
        {adminNav.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                active ? "bg-neutral-800 text-white" : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
