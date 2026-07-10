import { NextRequest, NextResponse } from "next/server";
import type { AppDoc } from "@/types/app";
import { readFile } from "fs/promises";
import { join } from "path";

async function fetchAllApps(): Promise<AppDoc[]> {
  try {
    const filePath = join(process.cwd(), "public", "data", "apps.json");
    const fileContent = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    return data.apps || [];
  } catch (error) {
    console.error("Error fetching apps:", error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search")?.toLowerCase().trim() || "";

    const allApps = await fetchAllApps();

    if (!search) {
      return NextResponse.json({
        apps: allApps.filter((a) => a.status === "published"),
      });
    }

    const filtered = allApps.filter((app) => {
      if (app.status !== "published") return false;

      const searchableText = `${app.name} ${app.description} ${app.category} ${app.ownerName} ${(app.searchKeywords || []).join(" ")}`.toLowerCase();
      return searchableText.includes(search);
    });

    return NextResponse.json({
      apps: filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search apps", apps: [] },
      { status: 500 }
    );
  }
}

