"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/admin/login") return;
    if (window.localStorage.getItem("pureblend.mock.admin") !== "1") {
      router.replace("/admin/login");
    }
  }, [pathname, router]);

  return null;
}
