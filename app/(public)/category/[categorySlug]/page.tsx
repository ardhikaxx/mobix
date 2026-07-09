import type { Metadata } from "next";
import { getCategoryLabel } from "@/lib/constants/categories";
import appsData from "@/public/data/apps.json";
import CategoryPageClient from "./page.client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const label = getCategoryLabel(categorySlug);
  const appCount = appsData.apps.filter(
    (a) => a.status === "published" && a.category === categorySlug
  ).length;

  return {
    title: `Kategori ${label} — ${appCount} Aplikasi Android`,
    description: `Kumpulan ${appCount} aplikasi Android terbaik dalam kategori ${label} di Mobix. Unduh gratis aplikasi buatan komunitas Indonesia.`,
    openGraph: {
      title: `Kategori ${label} — Mobix`,
      description: `Download aplikasi Android kategori ${label} gratis di Mobix. Platform distribusi aplikasi komunitas Indonesia.`,
    },
  };
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  return <CategoryPageClient params={params} />;
}
