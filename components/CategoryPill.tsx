import Link from "next/link";

export function CategoryPill({ slug, label, active }: { slug: string; label: string; active?: boolean }) {
  return (
    <Link
      href={`/category/${slug}`}
      className={`inline-flex items-center justify-center min-h-[40px] rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 ${
        active
          ? "bg-store text-white shadow-sm ring-2 ring-store/30"
          : "bg-gray-100/90 text-gray-700 hover:bg-store/10 hover:text-store"
      }`}
    >
      {label}
    </Link>
  );
}
