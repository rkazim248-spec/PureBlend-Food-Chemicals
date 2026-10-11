import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth, type UserRecord } from "firebase-admin/auth";
import { getFirestore, type Firestore, type DocumentSnapshot, type QueryDocumentSnapshot } from "firebase-admin/firestore";
import { Timestamp } from "firebase-admin/firestore";

const adminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

function validateAdminConfig(): void {
  if (!adminConfig.projectId) {
    throw new Error("FIREBASE_PROJECT_ID is not set");
  }
  if (!adminConfig.clientEmail) {
    throw new Error("FIREBASE_CLIENT_EMAIL is not set");
  }
  if (!adminConfig.privateKey) {
    throw new Error("FIREBASE_PRIVATE_KEY is not set");
  }
}

function getAdminApp(): App {
  if (!adminApp) {
    validateAdminConfig();
    if (getApps().length === 0) {
      adminApp = initializeApp({
        credential: cert({
          projectId: adminConfig.projectId,
          clientEmail: adminConfig.clientEmail,
          privateKey: adminConfig.privateKey,
        }),
      });
    } else {
      adminApp = getApps()[0];
    }
  }
  return adminApp;
}

export function getAdminAuth(): Auth {
  if (!adminAuth) {
    adminAuth = getAuth(getAdminApp());
  }
  return adminAuth;
}

export function getAdminDb(): Firestore {
  if (!adminDb) {
    adminDb = getFirestore(getAdminApp());
  }
  return adminDb;
}

export function getFirestoreAdmin(): Firestore {
  // Lazily initialize and cache the admin Firestore instance
  const db = getAdminDb();
  return db;
}

/**
 * Verify a Firebase ID token and return decoded payload.
 * Throws ApiError-like error on failure (caller maps to HTTP).
 */
/**
 * Get user record by email from Firebase Auth.
 */
export async function getUserByEmail(email: string) {
  const auth = getAdminAuth();
  return auth.getUserByEmail(email);
}

/**
 * Set custom claims on a Firebase user.
 */
export async function setCustomUserClaims(uid: string, claims: Record<string, unknown>) {
  const auth = getAdminAuth();
  return auth.setCustomUserClaims(uid, claims);
}

/**
 * Verify a Firebase ID token and return decoded payload.
 */
export async function verifyIdToken(idToken: string) {
  const auth = getAdminAuth();
  return auth.verifyIdToken(idToken);
}

/**
 * Check if decoded token has admin role.
 * Returns { isAdmin: boolean, role: string | null, uid: string }
 */
export async function checkAdminClaim(idToken: string): Promise<{ isAdmin: boolean; role: string | null; uid: string }> {
  const decoded = await verifyIdToken(idToken);
  const role = (decoded.customClaims?.role as string | null);
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";
  return { isAdmin, role, uid: decoded.uid };
}

/**
 * Set custom claims on a Firebase user.
 * Grants admin role if claims.role === "ADMIN".
 */
export async function setAdminClaim(uid: string, isGranting: boolean): Promise<void> {
  const auth = getAdminAuth();
  const claims = isGranting ? { role: "ADMIN" } : { role: null };
  await auth.setCustomUserClaims(uid, claims);
}

/**
 * Get current user record from Firebase Auth.
 */
export async function getUserRecord(uid: string): Promise<UserRecord> {
  const auth = getAdminAuth();
  return auth.getUser(uid);
}

/**
 * Revoke all refresh tokens for a user (e.g., on access revocation).
 */
export async function revokeRefreshTokens(uid: string): Promise<void> {
  const auth = getAdminAuth();
  await auth.revokeRefreshTokens(uid);
}

/**
 * Get admin Firestore record associated with a UID.
 */
export async function getAdminRecord(uid: string): Promise<{ uid: string; email: string; role: string; active: boolean; createdAt: Timestamp; updatedAt: Timestamp } | null> {
  const db = getAdminDb();
  const doc = await db.collection("admins").doc(uid).get();
  if (!doc.exists) return null;
  const data = doc.data()!;
  return {
    uid: doc.id,
    email: data.email,
    role: data.role,
    active: data.isActive,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/** Legacy: create admin user with password + custom claims */
export async function createAdminUser(email: string, password: string, displayName: string) {
  const auth = getAdminAuth();
  const userRecord = await auth.createUser({
    email,
    password,
    displayName,
    emailVerified: true,
  });
  await auth.setCustomUserClaims(userRecord.uid, { role: "ADMIN" });
  // Also create Firestore admin record
  const db = getAdminDb();
  await db.collection("admins").doc(userRecord.uid).set({
    uid: userRecord.uid,
    email,
    role: "ADMIN",
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return userRecord;
}