import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";

const modules = ["Products", "Banners", "Offers", "FAQs", "Content", "SEO"];

export default function AdminDashboardPage() {
  return (
    <div>
      <Heading level={1}>Dashboard</Heading>
      <p className="mt-2 text-neutral-600">Content management overview. Live counts will load from the API in a later phase.</p>
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => (
          <li key={m}>
            <Card>
              <p className="font-bold text-neutral-900">{m}</p>
              <p className="mt-1 text-sm text-neutral-500">Manage {m.toLowerCase()} — CRUD UI comes in a later phase.</p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
