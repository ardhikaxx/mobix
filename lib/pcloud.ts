const API_BASE = process.env.PCLOUD_API_URL || "https://api.pcloud.com";

function getToken() {
  const token = process.env.PCLOUD_ACCESS_TOKEN;
  if (!token) throw new Error("PCLOUD_ACCESS_TOKEN env tidak ditemukan");
  return token;
}

export async function uploadFileToPCloud(
  buffer: Buffer,
  fileName: string,
  remoteDir: string,
): Promise<{ url: string; fileId: number }> {
  const token = getToken();

  const formData = new FormData();
  formData.append("auth", token);
  formData.append("path", `/mobix/${remoteDir}`);
  formData.append("file", new Blob([new Uint8Array(buffer)]), fileName);

  const res = await fetch(`${API_BASE}/uploadfile`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`pCloud uploadfile HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  if (data.result !== 0) throw new Error(`pCloud uploadfile error ${data.result}: ${data.error}`);

  const metadata = data.metadata?.[0];
  if (!metadata?.fileid) {
    throw new Error(`pCloud uploadfile: no fileid in response: ${JSON.stringify(data).slice(0, 300)}`);
  }

  const pubRes = await fetch(`${API_BASE}/getfilepublink`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ auth: token, fileid: String(metadata.fileid) }),
  });
  const pubData = await pubRes.json();
  if (pubData.result !== 0) throw new Error(`pCloud publink error ${pubData.result}: ${pubData.error}`);

  const code = pubData.code;
  if (!code) throw new Error(`pCloud publink: no code: ${JSON.stringify(pubData).slice(0, 200)}`);

  const dlRes = await fetch(`${API_BASE}/getpublinkdownload`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ auth: token, code }),
  });
  const dlData = await dlRes.json();
  if (dlData.result !== 0) throw new Error(`pCloud downloadlink error ${dlData.result}: ${dlData.error}`);

  const host = dlData.hosts?.[0];
  const path = dlData.path;
  if (!host || !path) throw new Error(`pCloud downloadlink: no host/path: ${JSON.stringify(dlData).slice(0, 200)}`);

  return { url: `https://${host}${path}`, fileId: metadata.fileid };
}

export async function deleteFileFromPCloud(fileId: number) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/deletefile`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ auth: token, fileid: String(fileId) }),
  });
  const data = await res.json();
  if (data.result !== 0) throw new Error(`pCloud deletefile error ${data.result}: ${data.error}`);
}
