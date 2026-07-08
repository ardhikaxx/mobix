export function generateSearchKeywords(name: string, tags: string[], category?: string): string[] {
  const base = `${name} ${category ?? ""} ${tags.join(" ")}`.toLowerCase();
  const words = base.replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);

  const prefixes = words.flatMap((w) =>
    Array.from({ length: w.length }, (_, i) => w.slice(0, i + 1))
  );

  return Array.from(new Set([...words, ...prefixes]));
}
