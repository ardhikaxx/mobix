export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateAppSlug(name: string): string {
  const { nanoid } = require("nanoid");
  return `${slugify(name)}-${nanoid(6)}`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(timestamp: { toDate?: () => Date; seconds?: number; nanoseconds?: number } | null | undefined): string {
  if (!timestamp) return "-";
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date((timestamp.seconds ?? 0) * 1000);
    return date.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "-";
  }
}
