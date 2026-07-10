"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, HelpCircle, Upload } from "lucide-react";

const WA_NUMBER = "6285933648537";

const TEMPLATES = [
  {
    id: "ask",
    icon: HelpCircle,
    label: "Tanya Admin",
    text: "Halo kak, saya mau tanya tentang Mobix nih.",
  },
  {
    id: "upload",
    icon: Upload,
    label: "Upload Aplikasi",
    text: "Halo kak, saya mau upload aplikasi ke Mobix. Ini saya lampirkan APK-nya ya.",
  },
];

function openWA(text: string) {
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
}

export function FloatingWA() {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSend = () => {
    if (custom.trim()) {
      openWA(custom.trim());
      setCustom("");
      setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div ref={ref} className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      {open && (
        <div className="absolute bottom-16 right-0 w-72 animate-in fade-in slide-in-from-bottom-4 rounded-2xl border border-gray-100 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2 rounded-t-2xl bg-green-600 px-4 py-3 text-sm font-bold text-white">
            <MessageCircle className="size-4" />
            Chat Admin via WhatsApp
          </div>

          <div className="space-y-1.5 p-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => { openWA(t.text); setOpen(false); }}
                className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
              >
                <t.icon className="size-4 shrink-0 text-gray-400" />
                {t.label}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 p-3 dark:border-gray-700">
            <textarea
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pesan lainnya..."
              rows={2}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-100"
            />
            <button
              onClick={handleSend}
              disabled={!custom.trim()}
              className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700 active:scale-[0.97] disabled:opacity-50"
            >
              <Send className="size-3.5" />
              Kirim via WhatsApp
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex size-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition hover:bg-green-700 active:scale-95"
        aria-label="Chat Admin"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </div>
  );
}
