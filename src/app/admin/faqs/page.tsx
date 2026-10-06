"use client";

import { EntityManager } from "@/components/admin/EntityManager";
import { admin } from "@/lib/api";
import type { Faq } from "@/lib/api/types";

export default function AdminFaqsPage() {
  return (
    <EntityManager<Faq>
      title="FAQs"
      description="Manage frequently asked questions."
      entityName="FAQ"
      fetchAll={() => admin.adminGetFaqs()}
      create={(input) => admin.adminCreateFaq(input as Omit<Faq, "id">)}
      update={(id, input) => admin.adminUpdateFaq(id, input)}
      remove={(id) => admin.adminDeleteFaq(id)}
      toggleStatus={{ label: (f) => f.published, set: async (id, v) => admin.adminUpdateFaq(id, { published: v }) }}
      searchText={(f) => `${f.question} ${f.answer}`}
      fields={[
        { key: "question", label: "Question", type: "text", required: true },
        { key: "answer", label: "Answer", type: "textarea", required: true },
        { key: "order", label: "Order", type: "number" },
        { key: "published", label: "Published", type: "checkbox" },
      ]}
      columns={[
        { label: "Question", render: (f) => <span className="font-semibold">{f.question}</span> },
        { label: "Order", render: (f) => f.order },
      ]}
    />
  );
}
