export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(
  value: { toDate?: () => Date; seconds?: number; nanoseconds?: number } | string | null | undefined
): string {
  if (!value) return "-";
  try {
    let date: Date;
    if (typeof value === "string") {
      date = new Date(value);
    } else if (value.toDate) {
      date = value.toDate();
    } else {
      date = new Date((value.seconds ?? 0) * 1000);
    }
    return date.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "-";
  }
}
