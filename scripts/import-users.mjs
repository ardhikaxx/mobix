import { readFileSync } from "fs";
import admin from "firebase-admin";

admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();

const raw = JSON.parse(readFileSync("data-export.json", "utf-8"));
const users = raw.users;

let i = 0;
const entries = Object.entries(users);
for (const [uid, data] of entries) {
  await db.collection("users").doc(uid).set({
    uid,
    displayName: data.fullName,
    email: data.email,
    photoURL: null,
    createdAt: admin.firestore.Timestamp.fromDate(new Date(data.createdAt)),
  });
  i++;
  if (i % 20 === 0) console.log(`Imported ${i}/${entries.length}`);
}

console.log(`Done! Imported ${i} users.`);
