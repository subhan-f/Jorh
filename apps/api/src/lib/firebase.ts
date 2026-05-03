import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { env } from "../env.js";

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: env.FIREBASE_PROJECT_ID,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
// Firestore rejects undefined field values by default; this makes it silently omit them
adminDb.settings({ ignoreUndefinedProperties: true });
export const adminStorage = getStorage();

export const Collections = {
  USERS: "users",
  LINKS: "links",
  CLICKS: "clicks",
  BIO_PAGES: "bioPages",
  WORKSPACES: "workspaces",
  QR_CODES: "qrCodes",
} as const;
