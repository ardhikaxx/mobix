import { Timestamp } from "firebase/firestore";

export interface AppDoc {
  appId: string;
  ownerId: string;
  ownerName: string;
  ownerPhotoURL: string | null;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  searchKeywords: string[];
  logoURL: string;
  screenshots: string[];
  apkURL: string;
  apkFileName: string;
  apkSizeBytes: number;
  version: string;
  versionCode: number;
  minAndroidVersion: string;
  changelog: string;
  websiteURL: string | null;
  githubURL: string | null;
  downloadCount: number;
  viewCount: number;
  status: "published" | "draft" | "suspended";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastVersionUpdateAt: Timestamp;
}

export interface AppFormData {
  name: string;
  description: string;
  category: string;
  version: string;
  websiteURL?: string;
  githubURL?: string;
  tags: string[];
  changelog: string;
  minAndroidVersion: string;
}

export interface DownloadDoc {
  appId: string;
  appName: string;
  appVersion: string;
  userId: string;
  ownerId: string;
  downloadedAt: Timestamp;
}
