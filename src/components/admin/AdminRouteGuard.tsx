"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { admin } from "@/lib/api";
import { Spinner } from "@/components/ui/Spinner";

export function AdminRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<"checking" | "ok">("checking");

  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (pathname === "/admin/login") {
        setState("ok");
        return;
      }
      admin
        .getMe()
        .then(() => {
          if (!cancelled) setState("ok");
        })
        .catch(() => {
          if (!cancelled) router.replace("/admin/login");
        });
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [pathname, router]);

  if (state === "checking") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center" aria-busy="true">
        <Spinner label="Checking session" />
      </div>
    );
  }

  return state === "ok" ? null : router.replace("/admin/login");
}
