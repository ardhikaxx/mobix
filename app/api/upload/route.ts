import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { uploadFileToPCloud } from "@/lib/pcloud";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const decoded = await getAdminAuth().verifyIdToken(token);

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const type = form.get("type") as string;
    const appId = form.get("appId") as string;

    if (!file || !type || !appId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const allowed = ["logo", "screenshot", "apk", "avatar"];
    if (!allowed.includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "bin";
    let fileName: string;
    let subDir: string;

    if (type === "avatar") {
      fileName = `${decoded.uid}.${ext}`;
      subDir = "avatars";
    } else if (type === "logo") {
      fileName = `${appId}.${ext}`;
      subDir = "logos";
    } else if (type === "screenshot") {
      const idx = form.get("index") || "0";
      fileName = `${idx}.${ext}`;
      subDir = `screenshots/${appId}`;
    } else {
      const versionCode = form.get("versionCode") || "1";
      fileName = `${versionCode}-${file.name.toLowerCase().replace(/\s+/g, "-")}`;
      subDir = `apks/${appId}`;
    }

    const { url } = await uploadFileToPCloud(buffer, fileName, subDir);
    return NextResponse.json({ url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
