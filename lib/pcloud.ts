const PCLOUD_API = "https://api.pcloud.com";

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
  const remotePath = `/mobix/${remoteDir}/${fileName}`;

  const formData = new FormData();
  formData.append("filename", new Blob([new Uint8Array(buffer)]), fileName);

  const params = new URLSearchParams({ access_token: token, path: `/mobix/${remoteDir}` });
  const res = await fetch(`${PCLOUD_API}/uploadfile?${params}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.result !== 0) throw new Error(data.error || "pCloud upload failed");

  const metadata = data.metadata?.[0];
  if (!metadata?.fileid) throw new Error("pCloud upload: no fileid");

  const pubRes = await fetch(
    `${PCLOUD_API}/getfilepublink?access_token=${token}&fileid=${metadata.fileid}`,
    { method: "POST" },
  );
  const pubData = await pubRes.json();
  if (pubData.result !== 0) throw new Error(pubData.error || "pCloud public link failed");

  const code = pubData.link?.split("code=")?.[1] || pubData.code;
  if (!code) throw new Error("pCloud: no public link code");

  const dlRes = await fetch(
    `${PCLOUD_API}/getpublinkdownload?access_token=${token}&code=${code}`,
    { method: "POST" },
  );
  const dlData = await dlRes.json();
  if (dlData.result !== 0) throw new Error(dlData.error || "pCloud download link failed");

  const host = dlData.hosts?.[0];
  const path = dlData.path;
  if (!host || !path) throw new Error("pCloud: no download host");

  const url = `https://${host}${path}`;
  return { url, fileId: metadata.fileid };
}

export async function deleteFileFromPCloud(fileId: number) {
  const token = getToken();
  await fetch(`${PCLOUD_API}/deletefile?access_token=${token}&fileid=${fileId}`, {
    method: "POST",
  });
}
