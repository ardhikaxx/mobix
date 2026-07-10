import type { Metadata } from "next";
import appsData from "@/public/data/apps.json";
import { slugify } from "@/lib/utils/slug";
import DeveloperPageClient from "./page.client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const apps = appsData.apps.filter(
    (a) => a.status === "published" && slugify(a.ownerName) === username
  );
  const devName = apps.length > 0 ? apps[0].ownerName : username;

  return {
    title: `${devName} — Developer Aplikasi Android di Mobix`,
    description: `Lihat ${apps.length} aplikasi Android buatan ${devName} di Mobix. Download gratis aplikasi buatan komunitas Indonesia.`,
    openGraph: {
      title: `${devName} — Developer di Mobix`,
      description: `Kumpulan aplikasi Android buatan ${devName}. Download gratis di Mobix.`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function DeveloperPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return <DeveloperPageClient params={params} />;
}
