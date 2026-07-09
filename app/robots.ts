import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/private", "/api", "/*.json$", "/?*sort="],
    },
    sitemap: "https://mobix-mu.vercel.app/sitemap.xml",
  };
}
