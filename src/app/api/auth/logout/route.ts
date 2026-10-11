import { NextResponse } from "next/server";
import { getAdminAuth, revokeRefreshTokens } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { uid } = body;

    if (uid) {
      // Revoke all refresh tokens for this user (hard logout)
      const auth = getAdminAuth();
      await revokeRefreshTokens(uid);
    }

    // Return success — client should remove stored token
    return NextResponse.json({ success: true, data: { ok: true } });
  } catch (err: any) {
    console.error("Auth logout error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message ?? "Logout failed." } },
      { status: 500 }
    );
  }
}