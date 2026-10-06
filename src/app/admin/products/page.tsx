"use client";

import { EntityManager } from "@/components/admin/EntityManager";
import { admin, type Product } from "@/lib/api";

export default function AdminProductsPage() {
  return (
    <EntityManager<Product>
      title="Products"
      description="Create, edit, publish, and delete products."
      entityName="Product"
      fetchAll={() => admin.adminGetProducts()}
      create={(input) => admin.adminCreateProduct(input as Omit<Product, "id">)}
      update={(id, input) => admin.adminUpdateProduct(id, input)}
      remove={(id) => admin.adminDeleteProduct(id)}
      toggleStatus={{ label: (p) => p.published, set: (id, v) => admin.adminSetProductPublished(id, v) }}
      searchText={(p) => `${p.name} ${p.description}`}
      fields={[
        { key: "name", label: "Name", type: "text", required: true },
        { key: "slug", label: "Slug", type: "text", required: true, placeholder: "url-friendly-name" },
        { key: "description", label: "Description", type: "textarea", required: true },
        { key: "published", label: "Published", type: "checkbox" },
      ]}
      columns={[
        { label: "Name", render: (p) => <span className="font-semibold">{p.name}</span> },
        { label: "Slug", render: (p) => <span className="text-neutral-500">{p.slug}</span> },
        { label: "Status", render: (p) => (p.published ? "Published" : "Draft") },
      ]}
    />
  );
}
