"use client";

import Link from "next/link";
import { useState } from "react";

export function MobileNav({ items, extraItems = [] }: { items: { href: string; label: string }[]; extraItems?: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-md text-neutral-800 focus-visible:outline-2 focus-visible:outline-brand-600"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true" className="text-xl">{open ? "✕" : "☰"}</span>
      </button>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="absolute inset-x-0 top-16 border-b border-neutral-200 bg-white shadow-raised">
          <ul className="flex flex-col p-4 text-base font-semibold text-neutral-800">
            {[...items, ...extraItems].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block rounded-md px-3 py-3 hover:bg-neutral-100" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
