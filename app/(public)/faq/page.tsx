import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ — Mobix",
  description: "Pertanyaan yang sering diajukan tentang Mobix.",
};

const faqData = [
  {
    q: "Apa itu Mobix?",
    a: "Mobix adalah platform distribusi aplikasi Android berbasis komunitas. Pengguna bisa mendownload aplikasi gratis, dan developer bisa mendaftarkan aplikasi mereka dengan biaya Rp10.000 per aplikasi (sekali bayar, seumur hidup).",
  },
  {
    q: "Apakah Mobix gratis?",
    a: "Download aplikasi di Mobix gratis 100% tanpa biaya. Biaya Rp10.000 hanya untuk developer yang ingin mendaftarkan aplikasi mereka.",
  },
  {
    q: "Bagaimana cara mendownload aplikasi?",
    a: "Cukup buka halaman aplikasi yang kamu inginkan, klik tombol 'Install Aplikasi', dan file APK akan langsung terdownload.",
  },
  {
    q: "Apakah aplikasi di Mobix aman?",
    a: "Mobix menyediakan enkripsi data dalam transit, sistem rating dan ulasan, serta informasi data safety yang transparan. Namun, aplikasi diunggah oleh pihak ketiga — download dengan risiko sendiri.",
  },
  {
    q: "Bagaimana cara mendaftarkan aplikasi saya?",
    a: "Hubungi admin via WhatsApp di 0859-3364-8537. Kirim detail aplikasi, logo, dan file APK. Lakukan pembayaran Rp10.000 via QRIS per aplikasi. Admin akan menguploadnya ke katalog Mobix.",
  },
  {
    q: "Apakah saya bisa request aplikasi?",
    a: "Ya! Setelah login, kamu bisa membuat request aplikasi di halaman Requests. Fitur ini membantu developer tahu aplikasi apa yang dibutuhkan komunitas.",
  },
  {
    q: "Bagaimana cara menghubungi admin?",
    a: "Hubungi admin via WhatsApp di 0859-3364-8537 untuk pendaftaran aplikasi, laporan, atau pertanyaan lainnya.",
  },
  {
    q: "Apakah data saya aman?",
    a: "Data Anda disimpan di Firebase dengan enkripsi TLS. Kami tidak menjual data ke pihak ketiga. Lihat Kebijakan Privasi untuk informasi lengkap.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-store/15 shadow-sm border border-store/20">
          <HelpCircle className="size-7 text-store" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          FAQ
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Pertanyaan yang sering diajukan
        </p>
      </div>

      <div className="space-y-3">
        {faqData.map((item, i) => (
          <details
            key={i}
            className="group rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <summary className="flex cursor-pointer items-center justify-between text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 [&::-webkit-details-marker]:hidden">
              {item.q}
              <svg
                className="size-4 shrink-0 text-gray-400 transition group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
