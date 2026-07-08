import { z } from "zod";

export const appUploadSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").max(60, "Nama maksimal 60 karakter"),
  description: z.string().min(20, "Deskripsi terlalu singkat").max(5000, "Deskripsi terlalu panjang"),
  category: z.enum([
    "productivity", "tools", "games", "social", "finance",
    "health", "education", "entertainment", "photography", "other",
  ]),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Format versi harus x.y.z"),
  websiteURL: z.string().url("URL tidak valid").optional().or(z.literal("")),
  githubURL: z.string().url("URL tidak valid").regex(/github\.com/, "Harus URL GitHub").optional().or(z.literal("")),
  tags: z.array(z.string()).max(10, "Maksimal 10 tag").optional(),
  changelog: z.string().optional(),
  minAndroidVersion: z.string().optional(),
  logoFile: z
    .instanceof(File)
    .refine((f) => f.size <= 2 * 1024 * 1024, "Logo maksimal 2MB")
    .refine((f) => f.type.startsWith("image/"), "File harus berupa gambar"),
  apkFile: z
    .instanceof(File)
    .refine((f) => f.size <= 200 * 1024 * 1024, "APK maksimal 200MB")
    .refine((f) => f.name.endsWith(".apk"), "File harus berformat .apk"),
});

export type AppUploadInput = z.infer<typeof appUploadSchema>;

export const appEditSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").max(60, "Nama maksimal 60 karakter"),
  description: z.string().min(20, "Deskripsi terlalu singkat").max(5000, "Deskripsi terlalu panjang"),
  category: z.enum([
    "productivity", "tools", "games", "social", "finance",
    "health", "education", "entertainment", "photography", "other",
  ]),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Format versi harus x.y.z"),
  websiteURL: z.string().url("URL tidak valid").optional().or(z.literal("")),
  githubURL: z.string().url("URL tidak valid").regex(/github\.com/, "Harus URL GitHub").optional().or(z.literal("")),
  tags: z.array(z.string()).max(10, "Maksimal 10 tag").optional(),
  changelog: z.string().optional(),
  minAndroidVersion: z.string().optional(),
});

export type AppEditInput = z.infer<typeof appEditSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  displayName: z.string().min(2, "Nama minimal 2 karakter").max(50),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const profileSchema = z.object({
  displayName: z.string().min(2, "Nama minimal 2 karakter").max(50),
  bio: z.string().max(200, "Maksimal 200 karakter").optional().or(z.literal("")),
  website: z.string().url("URL tidak valid").optional().or(z.literal("")),
  githubUsername: z.string().optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;
