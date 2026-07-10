import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

let adminDb: ReturnType<typeof getFirestore> | null = null;

try {
  if (!getApps().length && projectId && clientEmail && privateKey) {
    const app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
    adminDb = getFirestore(app);
  }
} catch {
  // Firebase Admin not configured
}

export { adminDb };
