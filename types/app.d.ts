export interface AppDoc {
  appId: string;
  ownerId: string;
  ownerName: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
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
  status: "published" | "draft" | "suspended";
  isExclusive?: boolean;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
  lastVersionUpdateAt: string;
}
