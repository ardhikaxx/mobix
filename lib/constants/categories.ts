export const CATEGORIES = [
  { slug: "productivity", label: "Productivity" },
  { slug: "tools", label: "Tools & Utilities" },
  { slug: "games", label: "Games" },
  { slug: "social", label: "Social" },
  { slug: "finance", label: "Finance" },
  { slug: "health", label: "Health & Fitness" },
  { slug: "education", label: "Education" },
  { slug: "entertainment", label: "Entertainment" },
  { slug: "photography", label: "Photography" },
  { slug: "business", label: "Business" },
  { slug: "other", label: "Other" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function getCategoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
