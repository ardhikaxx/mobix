import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const decoded = await getAdminAuth().verifyIdToken(token);

    const { appId, ownerId } = await req.json();
    if (!appId) {
      return NextResponse.json({ error: "Missing appId" }, { status: 400 });
    }

    const db = getAdminDb();
    const appRef = db.collection("apps").doc(appId);
    await appRef.update({
      downloadCount: FieldValue.increment(1),
    });

    await db.collection("downloads").add({
      appId,
      userId: decoded.uid,
      ownerId: ownerId || "",
      downloadedAt: FieldValue.serverTimestamp(),
    });

    const snap = await appRef.get();
    const appData = snap.data();
    const apkURL = appData?.apkURL || "";

    return NextResponse.json({ apkURL });
  } catch {
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
