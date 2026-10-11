import { NextResponse } from "next/server";
import { getUserByEmail, getFirestoreAdmin, verifyIdToken, checkAdminClaim, getAdminAuth } from "@/lib/firebase/admin";
import { UserRecord } from "firebase-admin/auth";
import { z } from "zod";

const loginBodySchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = loginBodySchema.safeParse(body);

    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: firstIssue.message } },
        { status: 400 }
      );
    }

    const { email } = validated.data;

    // Step 1: Verify user exists via Firebase Admin SDK
    let userRecord: UserRecord;
    try {
      userRecord = await getUserByEmail(email);
    } catch {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Invalid credentials." } },
        { status: 401 }
      );
    }

    // Step 2: Get the user's ID token to return
    // Note: Admin claims (role: "ADMIN"/"SUPERADMIN") are NOT set here.
    // Admin claims should be granted separately via:
    //   - scripts/set-admin.ts CLI script
    //   - Firebase Console > Users > Set custom claims
    //   - Dedicated admin provisioning endpoint with proper verification
    const idToken = await (userRecord as any).getIdToken();

    return NextResponse.json({
      success: true,
      data: {
        idToken,
        adminUser: {
          id: userRecord.uid,
          email: userRecord.email,
          role: userRecord.customClaims?.role as string | null,
        },
      },
    });
  } catch (err: any) {
    console.error("Auth login error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Unexpected error during login" } },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Extract token from Authorization header
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get("authorization") ?? "";
    const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : "";
    const token = tokenFromHeader || searchParams.get("token") || "";

    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHENTICATED", message: "No token provided." } },
        { status: 401 }
      );
    }

    // Verify token and check admin claim
    const { isAdmin, role, uid } = await checkAdminClaim(token);

    if (!isAdmin) {
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

    return NextResponse.json({
      success: true,
      data: {
        uid,
        email: decoded.email,
        name: decoded.name || "",
        role,
      },
    });
  } catch (err: any) {
    console.error("Auth verify error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Verification failed." } },
      { status: 500 }
    );
  }
}