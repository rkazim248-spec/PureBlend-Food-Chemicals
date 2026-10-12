import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const requiredEnv = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "ADMIN_INITIAL_EMAIL",
  "ADMIN_INITIAL_PASSWORD",
];

const missingEnv = requiredEnv.filter((name) => !process.env[name]?.trim());
if (missingEnv.length > 0) {
  console.error(`Missing required environment variables: ${missingEnv.join(", ")}`);
  process.exit(1);
}

const email = process.env.ADMIN_INITIAL_EMAIL.trim();
const password = process.env.ADMIN_INITIAL_PASSWORD;

if (password.length < 12) {
  console.error("ADMIN_INITIAL_PASSWORD must be at least 12 characters.");
  process.exit(1);
}

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });

const auth = getAuth(app);
const db = getFirestore(app);

async function getOrCreateAdminUser() {
  try {
    return { user: await auth.getUserByEmail(email), created: false };
  } catch (error) {
    if (error.code !== "auth/user-not-found") {
      throw error;
    }
  }

  const user = await auth.createUser({
    email,
    password,
    displayName: "PureBlend Administrator",
  });
  return { user, created: true };
}

async function main() {
  const { user, created } = await getOrCreateAdminUser();
  const customClaims = { ...user.customClaims, role: "ADMIN" };
  await auth.setCustomUserClaims(user.uid, customClaims);

  const adminRef = db.collection("admins").doc(user.uid);
  const adminSnapshot = await adminRef.get();
  await adminRef.set(
    {
      uid: user.uid,
      email,
      role: "ADMIN",
      isActive: true,
      createdAt: adminSnapshot.get("createdAt") ?? FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  console.log(
    created
      ? `Created and provisioned the Firebase admin account ${email}.`
      : `Provisioned existing Firebase account ${email} as an admin. Its password was not changed.`,
  );
  console.log("Sign in at /admin/login. Keep the configured credentials private.");
}

main().catch((error) => {
  console.error("Admin bootstrap failed:", error.message);
  process.exitCode = 1;
});
