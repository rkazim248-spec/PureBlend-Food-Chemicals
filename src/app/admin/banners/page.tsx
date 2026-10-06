"use client";

import { EntityManager } from "@/components/admin/EntityManager";
import { admin } from "@/lib/api";
import type { Banner } from "@/lib/api/types";

export default function AdminBannersPage() {
  return (
    <EntityManager<Banner>
      title="Banners"
      description="Manage the homepage banner carousel."
      entityName="Banner"
      fetchAll={() => admin.adminGetBanners()}
      create={(input) => admin.adminCreateBanner(input as Omit<Banner, "id">)}
      update={(id, input) => admin.adminUpdateBanner(id, input)}
      remove={(id) => admin.adminDeleteBanner(id)}
      toggleStatus={{ label: (b) => b.active, set: async (id, v) => admin.adminUpdateBanner(id, { active: v }) }}
      searchText={(b) => b.title}
      fields={[
        { key: "title", label: "Title", type: "text", required: true },
        { key: "description", label: "Description", type: "textarea" },
        { key: "imageUrl", label: "Image URL", type: "text", required: true },
        { key: "imageAlt", label: "Image alt text", type: "text", required: true },
        { key: "linkUrl", label: "Link URL", type: "text" },
        { key: "linkLabel", label: "Link label", type: "text" },
        { key: "order", label: "Order", type: "number" },
        { key: "active", label: "Active", type: "checkbox" },
      ]}
      columns={[
        { label: "Title", render: (b) => <span className="font-semibold">{b.title}</span> },
        { label: "Order", render: (b) => b.order },
      ]}
    />
  );
}
