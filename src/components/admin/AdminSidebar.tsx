"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const adminNav = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/products", label: "Products", icon: "◈" },
  { href: "/admin/banners", label: "Banners", icon: "▣" },
  { href: "/admin/offers", label: "Offers", icon: "◇" },
  { href: "/admin/faqs", label: "FAQs", icon: "?" },
  { href: "/admin/content", label: "Content", icon: "≡" },
  { href: "/admin/seo", label: "SEO", icon: "⌕" },
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
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                active ? "bg-neutral-800 text-white" : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <span aria-hidden="true" className="w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
