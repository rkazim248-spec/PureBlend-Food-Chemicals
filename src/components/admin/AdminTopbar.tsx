"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { admin } from "@/lib/api";

export function AdminTopbar() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(async () => {
      try {
        const res = await admin.getMe();
        setIsAdmin(!!res.role && (res.role === "ADMIN" || res.role === "SUPERADMIN"));
      } catch {
        setIsAdmin(false);
      }
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  async function handleLogout() {
    try {
      await admin.logout();
    } finally {
      router.replace("/admin/login");
    }
  }

  return (
    <>
      {!isAdmin && (
        <header className="h-16 border-b border-neutral-200 bg-white px-4 sm:px-6">
          <p className="font-extrabold text-brand-700"><span aria-hidden="true">◆</span> PureBlend <span className="text-neutral-500">Admin</span></p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="font-semibold text-neutral-600 hover:text-brand-700"><span aria-hidden="true">↗</span> View site</Link>
            <button type="button" onClick={handleLogout} className="font-semibold text-neutral-600 hover:text-brand-700">
              <span aria-hidden="true">⇥</span> Logout
            </button>
          </div>
        </header>
      )}
      {isAdmin && (
        <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 sm:px-6">
          <p className="font-extrabold text-brand-700"><span aria-hidden="true">◆</span> PureBlend <span className="text-neutral-500">Admin</span></p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="font-semibold text-neutral-600 hover:text-brand-700"><span aria-hidden="true">↗</span> View site</Link>
            <button type="button" onClick={handleLogout} className="font-semibold text-neutral-600 hover:text-brand-700">
              <span aria-hidden="true">⇥</span> Logout
            </button>
          </div>
        </header>
      )}
    </>
  );
}