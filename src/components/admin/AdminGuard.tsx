"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { admin } from "@/lib/api";
import { Spinner } from "@/components/ui/Spinner";

/*
 * UX-level route protection: checks the Firebase admin claim and redirects to login.
 * Admin API routes remain the security boundary and independently verify each token.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<"checking" | "ok">("checking");

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => {
      if (pathname === "/admin/login") {
        setState("ok");
        return;
      }
      admin
        .getMe()
        .then(() => { if (!cancelled) setState("ok"); })
        .catch(() => { if (!cancelled) router.replace("/admin/login"); });
    }, 0);
    return () => { cancelled = true; clearTimeout(t); };
  }, [pathname, router]);

  if (state === "checking") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center" aria-busy="true">
        <Spinner label="Checking session" />
      </div>
    );
  }
  return <>{children}</>;
}
