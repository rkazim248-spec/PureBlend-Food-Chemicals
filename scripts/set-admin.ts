/**
 * Admin Provisioning Script
 *
 * Usage: npx ts-node scripts/set-admin.ts <uid>
 *
 * Grants admin role to an existing Firebase Authentication user.
 * Sets custom claim { role: "ADMIN" } and creates the Firestore admin record.
 *
 * This must be run from a server environment with Firebase Admin SDK credentials
 * (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env).
 *
 * WARNING: This grants elevated administrative privileges. Do not run against
 * production users unless intended. Always verify the UID before running.
 */

import "firebase-admin/auth";
import "firebase-admin/app";
import "firebase-admin/firestore";

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { z } from "zod";

// Parse and validate the UID argument
const args = process.argv.slice(2);
const uidSchema = z.string().min(1, "UID is required");

if (args.length === 0) {
  console.error("Usage: npx ts-node scripts/set-admin.ts <uid>");
  process.exit(1);
}

const validation = uidSchema.safeParse(args[0]);
if (!validation.success) {
  console.error("Invalid UID:", validation.error.message);
  process.exit(1);
}

const uid = validation.data;

// Load Firebase Admin config from environment
const adminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!adminConfig.projectId) {
  console.error("FIREBASE_PROJECT_ID is not set in environment");
  process.exit(1);
}
if (!adminConfig.clientEmail) {
  console.error("FIREBASE_CLIENT_EMAIL is not set in environment");
  process.exit(1);
}
if (!adminConfig.privateKey) {
  console.error("FIREBASE_PRIVATE_KEY is not set in environment");
  process.exit(1);
}

// Initialize Firebase Admin SDK
const adminApp = initializeApp({
  credential: cert({
    projectId: adminConfig.projectId,
    clientEmail: adminConfig.clientEmail,
    privateKey: adminConfig.privateKey,
  }),
});

const auth = getAuth(adminApp);
const db = getFirestore(adminApp);

async function main() {
  try {
    // 1. Verify the user exists in Firebase Auth
    try {
      await auth.getUser(uid);
      console.log(`User found: uid=${uid}`);
    } catch (error: any) {
      console.error(`User not found with uid=${uid}: ${error.message}`);
      process.exit(1);
    }

    // 2. Set custom admin claim
    await auth.setCustomUserClaims(uid, { role: "ADMIN" });
    console.log(`Admin claim set for uid=${uid}`);

    // 3. Create Firestore admin record
    await db.collection("admins").doc(uid).set({
      uid,
      role: "ADMIN",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true });
    console.log(`Firestore admin record created for uid=${uid}`);

    console.log("\nProvisioning complete. The user can now authenticate as an admin.");
    process.exit(0);
  } catch (error: any) {
    console.error("Provisioning failed:", error.message);
    process.exit(1);
  }
}

main();