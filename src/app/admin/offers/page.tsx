"use client";

import { EntityManager } from "@/components/admin/EntityManager";
import { admin } from "@/lib/api";
import type { Offer } from "@/lib/api/types";

export default function AdminOffersPage() {
  return (
    <EntityManager<Offer>
      title="Offers"
      description="Manage promotional offers and discounts."
      entityName="Offer"
      fetchAll={() => admin.adminGetOffers()}
      create={(input) => admin.adminCreateOffer(input as Omit<Offer, "id">)}
      update={(id, input) => admin.adminUpdateOffer(id, input)}
      remove={(id) => admin.adminDeleteOffer(id)}
      toggleStatus={{ label: (o) => o.active, set: async (id, v) => admin.adminUpdateOffer(id, { active: v }) }}
      searchText={(o) => `${o.title} ${o.discountText}`}
      fields={[
        { key: "title", label: "Title", type: "text", required: true },
        { key: "description", label: "Description", type: "textarea" },
        { key: "discountText", label: "Discount text", type: "text", required: true },
        { key: "validTo", label: "Valid to (ISO date)", type: "text", placeholder: "2026-12-31" },
        { key: "active", label: "Active", type: "checkbox" },
      ]}
      columns={[
        { label: "Title", render: (o) => <span className="font-semibold">{o.title}</span> },
        { label: "Value", render: (o) => o.discountText },
        { label: "Valid to", render: (o) => o.validTo ?? "—" },
      ]}
    />
  );
}
