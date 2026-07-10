"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  Link2,
  Code,
  Check,
  Copy,
  X as XIcon,
  Globe,
  QrCode,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
  appSlug: string;
}

const BASE_URL = "https://mobix-mu.vercel.app";
const SHARE_TEXT = (name: string) =>
  `Download ${name} gratis di Mobix! Platform aplikasi Android komunitas Indonesia.`;
const HASHTAGS = "Mobix,Android,APK,AppIndonesia";

type Tab = "share" | "embed" | "qrcode";

const platforms = [
  {
    name: "WhatsApp",
    icon: MessageCircle,
    color: "bg-green-500 hover:bg-green-600",
    getUrl: (url: string, text: string) =>
      `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`,
  },
  {
    name: "Twitter / X",
    icon: Globe,
    color: "bg-black hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600",
    getUrl: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${HASHTAGS}`,
  },
  {
    name: "Telegram",
    icon: Send,
    color: "bg-blue-500 hover:bg-blue-600",
    getUrl: (url: string, text: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: "Facebook",
    icon: MessageCircle,
    color: "bg-blue-700 hover:bg-blue-800",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
];

const FORUMS = [
  { label: "Kaskus", url: (url: string, text: string) => `https://www.kaskus.co.id/forum/thread/new?title=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}` },
  { label: "Reddit", url: (url: string, text: string) => `https://www.reddit.com/submit?title=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
];

export function ShareDialog({ isOpen, onClose, appName, appSlug }: ShareDialogProps) {
  const [tab, setTab] = useState<Tab>("share");
  const [copied, setCopied] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const appUrl = `${BASE_URL}/apps/${appSlug}`;
  const text = SHARE_TEXT(appName);

  useEffect(() => {
    if (tab === "qrcode" && !qrDataUrl) {
      import("qrcode").then((QRCode) => {
        QRCode.toDataURL(appUrl, {
          width: 280,
          margin: 2,
          color: { dark: "#171717", light: "#ffffff" },
        }).then(setQrDataUrl).catch(() => {});
      });
    }
  }, [tab, qrDataUrl, appUrl]);

  const copyToClipboard = useCallback(async (label: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(label);
      toast.success("Disalin ke clipboard!");
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Gagal menyalin");
    }
  }, []);

  const embeds = {
    markdown: `[![Available on Mobix](${BASE_URL}/badge.svg)](${appUrl})`,
    html: `<a href="${appUrl}" target="_blank" rel="noopener noreferrer">\n  <img src="${BASE_URL}/badge.svg" alt="Available on Mobix" width="180" height="60" />\n</a>`,
    bbcode: `[url=${appUrl}][img]${BASE_URL}/badge.svg[/img][/url]`,
    plain: appUrl,
    badgeLiveMarkdown: `[![${appName} downloads](${BASE_URL}/api/badge/${appSlug})](${appUrl})`,
    badgeLiveHtml: `<a href="${appUrl}" target="_blank" rel="noopener noreferrer">\n  <img src="${BASE_URL}/api/badge/${appSlug}" alt="${appName} downloads" />\n</a>`,
    iframeHtml: `<iframe src="${BASE_URL}/embed/${appSlug}" width="320" height="150" frameborder="0" style="border:none;overflow:auto;" allowfullscreen></iframe>`,
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `${appSlug}-qrcode.png`;
    a.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
            Promosikan {appName}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-5 dark:border-gray-700">
          <button
            onClick={() => setTab("share")}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition ${
              tab === "share"
                ? "border-store text-store"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <Link2 className="size-4" />
            Share
          </button>
          <button
            onClick={() => setTab("embed")}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition ${
              tab === "embed"
                ? "border-store text-store"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <Code className="size-4" />
            Embed
          </button>
          <button
            onClick={() => setTab("qrcode")}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition ${
              tab === "qrcode"
                ? "border-store text-store"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <QrCode className="size-4" />
            QR Code
          </button>
        </div>

        <div className="space-y-5 p-5">
          {tab === "share" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((p) => (
                  <a
                    key={p.name}
                    href={p.getUrl(appUrl, text)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition active:scale-95 ${p.color}`}
                  >
                    <p.icon className="size-4" />
                    {p.name}
                  </a>
                ))}
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Share ke forum
                </p>
                <div className="flex gap-2">
                  {FORUMS.map((f) => (
                    <a
                      key={f.label}
                      href={f.url(appUrl, text)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-center text-xs font-semibold text-gray-600 transition hover:bg-gray-50 hover:border-store/30 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                      {f.label}
                    </a>
                  ))}
                </div>
              </div>

              <button
                onClick={() => copyToClipboard("link", appUrl)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {copied === "link" ? (
                  <Check className="size-4 text-green-500" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copied === "link" ? "Disalin!" : "Salin Link"}
              </button>
            </>
          ) : tab === "embed" ? (
            <>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pasang badge atau widget di website, GitHub README, atau forum.
              </p>

              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400">Badge Standar</p>
                  {([
                    { label: "Markdown (GitHub)", key: "markdown" as const },
                    { label: "HTML", key: "html" as const },
                    { label: "BBCode (Forum)", key: "bbcode" as const },
                  ] as const).map(({ label, key }) => (
                    <div key={key} className="mb-2">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
                        <button
                          onClick={() => copyToClipboard(key, embeds[key])}
                          className="text-xs font-medium text-store hover:text-store-light"
                        >
                          {copied === key ? "Disalin!" : "Salin"}
                        </button>
                      </div>
                      <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        <code>{embeds[key]}</code>
                      </pre>
                    </div>
                  ))}
                  <div className="flex justify-center rounded-lg border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                    <img src="/badge.svg" alt="Available on Mobix" width={180} height={60} className="h-[60px] w-[180px]" />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 dark:border-gray-700">
                  <p className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400">Live Download Badge</p>
                  <p className="mb-2 text-[11px] text-gray-400">Badge dengan jumlah download real-time. Cocok untuk README GitHub atau website.</p>
                  {([
                    { label: "Markdown (GitHub)", key: "badgeLiveMarkdown" as const },
                    { label: "HTML", key: "badgeLiveHtml" as const },
                  ] as const).map(({ label, key }) => (
                    <div key={key} className="mb-2">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
                        <button
                          onClick={() => copyToClipboard(key, embeds[key])}
                          className="text-xs font-medium text-store hover:text-store-light"
                        >
                          {copied === key ? "Disalin!" : "Salin"}
                        </button>
                      </div>
                      <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        <code>{embeds[key]}</code>
                      </pre>
                    </div>
                  ))}
                  <div className="flex justify-center rounded-lg border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                    <img src={`/api/badge/${appSlug}`} alt={`${appName} downloads`} />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 dark:border-gray-700">
                  <p className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400">App Card (iframe)</p>
                  <p className="mb-2 text-[11px] text-gray-400">Embed kartu aplikasi interaktif di website kamu.</p>
                  <div className="mb-2">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">HTML iframe</span>
                      <button
                        onClick={() => copyToClipboard("iframe", embeds.iframeHtml)}
                        className="text-xs font-medium text-store hover:text-store-light"
                      >
                        {copied === "iframe" ? "Disalin!" : "Salin"}
                      </button>
                    </div>
                    <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      <code>{embeds.iframeHtml}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Scan QR code untuk langsung membuka halaman aplikasi di Mobix. Cocok untuk promosi offline (brosur, poster, card).
              </p>

              <div className="flex flex-col items-center gap-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt={`QR Code for ${appName}`} width={280} height={280} className="size-[200px] sm:size-[240px]" />
                  ) : (
                    <div className="flex size-[200px] sm:size-[240px] items-center justify-center">
                      <div className="size-8 animate-spin rounded-full border-2 border-store border-t-transparent" />
                    </div>
                  )}
                </div>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 break-all max-w-full">
                  {appUrl}
                </p>

                <button
                  onClick={downloadQR}
                  disabled={!qrDataUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-store px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-store-light disabled:opacity-50"
                >
                  <Download className="size-4" />
                  Download QR Code
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
