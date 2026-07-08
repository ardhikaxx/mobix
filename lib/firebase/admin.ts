import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT env tidak ditemukan");
  }
  return JSON.parse(raw) as Record<string, string>;
}

function getAppInstance() {
  if (getApps().length === 0) {
    return initializeApp({ credential: cert(getServiceAccount()) });
  }
  return getApps()[0];
}

function getAdminDb() {
  return getFirestore(getAppInstance());
}

function getAdminAuth() {
  return getAuth(getAppInstance());
}

export { getAdminDb, getAdminAuth };
