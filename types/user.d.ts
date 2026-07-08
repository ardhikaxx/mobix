import { Timestamp } from "firebase/firestore";

export interface UserDoc {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  provider: "password" | "google.com";
  bio: string | null;
  website: string | null;
  githubUsername: string | null;
  appCount: number;
  totalDownloads: number;
  status: "active" | "suspended";
  role: "user" | "admin";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
