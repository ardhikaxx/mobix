import { NextRequest, NextResponse } from "next/server";

interface OgData {
  title: string | null;
  description: string | null;
  image: string | null;
  url: string;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json({ error: "Invalid protocol" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      headers: {
        "User-Agent": "Mobix/1.0 LinkPreview",
        Accept: "text/html",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: 502 });
    }

    const html = await res.text();
    const og = parseOg(html, url);

    return NextResponse.json(og);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 502 });
  }
}

function parseOg(html: string, fallbackUrl: string): OgData {
  const getMeta = (property: string): string | null => {
    const patterns = [
      new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"),
    ];
    for (const p of patterns) {
      const m = html.match(p);
      if (m) return m[1];
    }
    return null;
  };

  const title = getMeta("og:title") || getMeta("twitter:title") || html.match(/<title>([^<]+)<\/title>/i)?.[1] || null;
  const description = getMeta("og:description") || getMeta("twitter:description") || getMeta("description") || null;
  let image = getMeta("og:image") || getMeta("twitter:image") || null;

  if (image && !image.startsWith("http")) {
    try {
      const u = new URL(fallbackUrl);
      if (image.startsWith("//")) {
        image = `${u.protocol}${image}`;
      } else if (image.startsWith("/")) {
        image = `${u.origin}${image}`;
      } else {
        image = `${u.origin}${image.startsWith("/") ? "" : "/"}${image}`;
      }
    } catch {
      image = null;
    }
  }

  return {
    title: title ? decodeEntities(title).slice(0, 200) : null,
    description: description ? decodeEntities(description).slice(0, 400) : null,
    image,
    url: fallbackUrl,
  };
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}
