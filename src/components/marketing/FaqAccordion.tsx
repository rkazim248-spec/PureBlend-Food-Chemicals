"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Faq } from "@/lib/api/types";

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (faqs.length === 0) {
    return <EmptyState title="No FAQs yet" description="Frequently asked questions will appear here once published." />;
  }

  return (
    <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
      {faqs.map((faq) => {
        const open = openId === faq.id;
        return (
          <li key={faq.id}>
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`faq-panel-${faq.id}`}
                id={`faq-button-${faq.id}`}
                onClick={() => setOpenId(open ? null : faq.id)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left font-semibold text-neutral-900 focus-visible:outline-2 focus-visible:outline-brand-600 sm:px-6"
              >
                {faq.question}
                <span aria-hidden="true">{open ? "−" : "+"}</span>
              </button>
            </h3>
            {open && (
              <div id={`faq-panel-${faq.id}`} role="region" aria-labelledby={`faq-button-${faq.id}`} className="px-4 pb-4 text-sm text-neutral-700 sm:px-6">
                {faq.answer}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
