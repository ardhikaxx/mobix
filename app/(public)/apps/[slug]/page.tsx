import type { Metadata } from "next";
import appsData from "@/public/data/apps.json";
import AppDetailPageClient from "./page.client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = appsData.apps.find((a) => a.slug === slug);

  if (!app) {
    return {
      title: "Aplikasi Tidak Ditemukan | Mobix",
    };
  }

  return {
    title: `${app.name} — Unduh APK Android Gratis`,
    description: app.description.slice(0, 160),
    openGraph: {
      title: `${app.name} — Download APK Android di Mobix`,
      description: app.description.slice(0, 160),
      images: app.screenshots.length > 0
        ? [{ url: app.screenshots[0], width: 800, height: 1600, alt: `${app.name} Screenshot` }]
        : [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Mobix" }],
    },
    twitter: {
      title: `${app.name} — Download APK Android`,
      description: app.description.slice(0, 160),
      images: app.screenshots.length > 0 ? [app.screenshots[0]] : ["/opengraph-image.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <AppDetailPageClient params={params} />;
}
