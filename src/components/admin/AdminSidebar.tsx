import Link from "next/link";

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
  return (
    <aside className="w-full border-b border-neutral-800 bg-neutral-950 lg:w-60 lg:border-b-0 lg:border-r">
      <nav aria-label="Admin" className="flex gap-1 overflow-x-auto p-3 lg:flex-col">
        {adminNav.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm font-semibold text-neutral-300 whitespace-nowrap hover:bg-neutral-800 hover:text-white">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
