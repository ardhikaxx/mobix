import { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/constants/categories";
import appsData from "@/public/data/apps.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mobix-mu.vercel.app";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/developers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const appPages: MetadataRoute.Sitemap = appsData.apps
    .filter((app) => app.status === "published")
    .map((app) => ({
      url: `${baseUrl}/apps/${app.slug}`,
      lastModified: new Date(app.updatedAt || app.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...categoryPages, ...appPages];
}
