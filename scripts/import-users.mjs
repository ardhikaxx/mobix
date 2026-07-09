import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const configPath = join(homedir(), ".config", "configstore", "firebase-tools.json");
const config = JSON.parse(readFileSync(configPath, "utf-8"));
const { access_token, expires_at, refresh_token } = config.tokens || {};

if (!access_token) {
  console.error("No Firebase login session found. Run: firebase login");
  process.exit(1);
}

async function getToken() {
  if (expires_at > Date.now()) return access_token;
  console.log("Token expired, refreshing...");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
      refresh_token,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Refresh failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.access_token;
}

async function writeDoc(uid, data, token) {
  const url = `https://firestore.googleapis.com/v1/projects/mobix-71e46/databases/(default)/documents/users/${uid}`;
  const body = {
    fields: {
      uid: { stringValue: uid },
      displayName: { stringValue: data.fullName },
      email: { stringValue: data.email },
      photoURL: { nullValue: null },
      createdAt: { timestampValue: new Date(data.createdAt).toISOString() },
    },
  };
  const res = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HTTP ${res.status}: ${err.substring(0, 150)}`);
  }
}

const raw = JSON.parse(readFileSync("data-export.json", "utf-8"));
const entries = Object.entries(raw.users);
const token = await getToken();

let ok = 0, fail = 0;
for (const [uid, data] of entries) {
  try {
    await writeDoc(uid, data, token);
    ok++;
  } catch (err) {
    console.error(`FAIL ${uid} (${data.fullName}): ${err.message}`);
    fail++;
  }
  if ((ok + fail) % 20 === 0) console.log(`Progress: ${ok + fail}/${entries.length}`);
}

console.log(`Done! Success: ${ok}, Failed: ${fail}`);
