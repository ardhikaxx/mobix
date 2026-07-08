import Link from "next/link";

export function CategoryPill({ slug, label, active }: { slug: string; label: string; active?: boolean }) {
  return (
    <Link
      href={`/category/${slug}`}
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-store text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </Link>
  );
}
