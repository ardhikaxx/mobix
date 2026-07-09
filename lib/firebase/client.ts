"use client";

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let firebaseApp: FirebaseApp;
let auth: Auth;
let db: Firestore;

function initFirebase() {
  const missing = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length > 0) {
    throw new Error(
      `Firebase config incomplete. Missing: ${missing.join(", ")}. ` +
      "Ensure NEXT_PUBLIC_FIREBASE_* environment variables are set."
    );
  }

  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig as Record<string, string>);
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
}

if (typeof window !== "undefined") {
  initFirebase();
}

export { firebaseApp, auth, db };

export const getAnalyticsIfSupported = async () => {
  if (typeof window === "undefined") return null;
  if (!firebaseApp) return null;
  return (await isSupported()) ? getAnalytics(firebaseApp) : null;
};
