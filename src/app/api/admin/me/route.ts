import { NextResponse } from "next/server";
import { verifyIdToken, checkAdminClaim, getFirestoreAdmin } from "@/lib/firebase/admin";

export async function GET(request: Request) {
  try {
    // Extract token from Authorization header
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get("authorization") ?? "";
    const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : "";
    const token = tokenFromHeader || searchParams.get("token") || "";

    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHENTICATED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    // Verify token and check admin claim
    const { isAdmin, role, uid } = await checkAdminClaim(token);

    if (!isAdmin) {
      // Return 403 for authenticated non-admin users
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Administrative privileges required." } },
        { status: 403 }
      );
    }

    // Fetch full decoded token for user info
    let decoded: import("firebase-admin/auth").DecodedIdToken;
    try {
      decoded = await verifyIdToken(token);
    } catch (err) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_TOKEN", message: "Invalid or expired token." } },
        { status: 401 }
      );
    }

    // Get Firestore admin record for additional metadata (active status, etc.)
    const adminDb = getFirestoreAdmin();
    const adminRecord = await adminDb.collection("admins").doc(uid).get();

    let active = false;
    let email = decoded.email || "";

    if (adminRecord.exists) {
      const data = adminRecord.data()!;
      active = data.isActive ?? true;
      email = data.email || decoded.email || "";
    }

    return NextResponse.json({
      success: true,
      data: {
        uid,
        email,
        role: decoded.customClaims?.role,
        active,
      },
    });
  } catch (err: any) {
    console.error("Admin me error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message ?? "Operation failed." } },
      { status: 500 }
    );
  }
}