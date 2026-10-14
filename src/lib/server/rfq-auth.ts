import { NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebase/admin";

export async function requireRfqAdmin(request: Request): Promise<NextResponse | null> {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHENTICATED", message: "Authentication required." } },
      { status: 401 }
    );
  }

  let decodedToken: Awaited<ReturnType<typeof verifyIdToken>>;
  try {
    decodedToken = await verifyIdToken(token);
  } catch (error) {
    console.warn("Quotation requests access denied due to invalid admin token.", error);
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHENTICATED", message: "A valid administrator session is required." } },
      { status: 401 }
    );
  }

  if (decodedToken.role !== "ADMIN" && decodedToken.role !== "SUPERADMIN") {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Administrative privileges required." } },
      { status: 403 }
    );
  }

  return null;
}
