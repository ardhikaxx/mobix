export function generateBadgeSvg({
  appName,
  downloadCount,
}: {
  appName: string;
  downloadCount?: number;
}): string {
  const label = "Mobix";
  const message = downloadCount !== undefined
    ? `${downloadCount.toLocaleString()} downloads`
    : appName;

  const labelWidth = 48;
  const charWidth = 7.5;
  const padding = 12;
  const msgWidth = Math.max(message.length * charWidth + padding, 60);
  const totalWidth = labelWidth + msgWidth;
  const height = 22;
  const borderRadius = 4;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}">
  <defs>
    <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".7"/>
      <stop offset="1" stop-color="#fff" stop-opacity=".1"/>
    </linearGradient>
    <linearGradient id="m" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#01875f"/>
      <stop offset="100%" stop-color="#00c488"/>
    </linearGradient>
  </defs>
  <clipPath id="r">
    <rect width="${totalWidth}" height="${height}" rx="${borderRadius}" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="${height}" fill="url(#m)"/>
    <rect x="${labelWidth}" width="${msgWidth}" height="${height}" fill="#1a1a2e"/>
    <rect width="${totalWidth}" height="${height}" fill="url(#s)"/>
  </g>
  <g fill="#fff" font-family="system-ui,-apple-system,Segoe UI,Helvetica,Arial,sans-serif" font-size="11" font-weight="600">
    <text x="${labelWidth / 2}" y="14" text-anchor="middle" letter-spacing=".5">${escapeXml(label)}</text>
    <text x="${labelWidth + msgWidth / 2}" y="14" text-anchor="middle">${escapeXml(message)}</text>
  </g>
</svg>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
