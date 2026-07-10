import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { generateBadgeSvg } from "@/lib/badge";
import type { AppDoc } from "@/types/app";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const filePath = join(process.cwd(), "public", "data", "apps.json");
    const fileContent = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent) as { apps: AppDoc[] };
    const app = data.apps.find((a) => a.slug === slug && a.status === "published");

    if (!app) {
      return new NextResponse("App not found", { status: 404 });
    }

    let downloadCount: number | undefined;

    if (adminDb) {
      try {
        const snap = await adminDb.collection("downloads").doc(slug).get();
        if (snap.exists) {
          downloadCount = snap.data()?.count ?? 0;
        }
      } catch {
        // fallback
      }
    }

    const svg = generateBadgeSvg({
      appName: app.name,
      downloadCount,
    });

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}
