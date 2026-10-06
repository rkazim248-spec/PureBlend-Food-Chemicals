import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

const modules = [
  { href: "/admin/products", name: "Products" },
  { href: "/admin/banners", name: "Banners" },
  { href: "/admin/offers", name: "Offers" },
  { href: "/admin/faqs", name: "FAQs" },
  { href: "/admin/content", name: "Content" },
  { href: "/admin/seo", name: "SEO" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <Heading level={1}>Dashboard</Heading>
      <p className="mt-2 text-neutral-600">Manage website content. Counts will load from the API in a later phase.</p>
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => (
          <li key={m.name}>
            <Link href={m.href}>
              <Card>
                <p className="font-bold text-neutral-900">{m.name}</p>
                <p className="mt-1 text-sm text-neutral-500">Manage {m.name.toLowerCase()} →</p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
