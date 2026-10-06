"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { admin } from "@/lib/api";

export function AdminTopbar() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await admin.logout();
    } finally {
      router.replace("/admin/login");
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 sm:px-6">
      <p className="font-extrabold text-brand-700">PureBlend <span className="text-neutral-500">Admin</span></p>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/" className="font-semibold text-neutral-600 hover:text-brand-700">View site</Link>
        <button type="button" onClick={handleLogout} className="font-semibold text-neutral-600 hover:text-brand-700">
          Logout
        </button>
      </div>
    </header>
  );
}
