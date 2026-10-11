import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

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

export function getFirebaseAdminApp(): App {
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

export function getFirebaseAdminAuth(): Auth {
  if (!adminAuth) {
    adminAuth = getAuth(getFirebaseAdminApp());
  }
  return adminAuth;
}

export function getFirestoreAdmin(): Firestore {
  if (!adminDb) {
    adminDb = getFirestore(getFirebaseAdminApp());
  }
  return adminDb;
}

export async function verifyIdToken(idToken: string) {
  const auth = getFirebaseAdminAuth();
  return auth.verifyIdToken(idToken);
}

export async function createCustomToken(uid: string, claims?: Record<string, unknown>) {
  const auth = getFirebaseAdminAuth();
  return auth.createCustomToken(uid, claims);
}

export async function setCustomUserClaims(uid: string, claims: Record<string, unknown>) {
  const auth = getFirebaseAdminAuth();
  return auth.setCustomUserClaims(uid, claims);
}

export async function getUserByEmail(email: string) {
  const auth = getFirebaseAdminAuth();
  return auth.getUserByEmail(email);
}

export async function createAdminUser(email: string, password: string, displayName: string) {
  const auth = getFirebaseAdminAuth();
  const userRecord = await auth.createUser({
    email,
    password,
    displayName,
    emailVerified: true,
  });
  await auth.setCustomUserClaims(userRecord.uid, { role: "ADMIN" });
  return userRecord;
}