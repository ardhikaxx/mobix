import type { Metadata } from "next";
import Link from "next/link";
import { Send, Smartphone, DollarSign, Users, Zap, Shield, CheckCircle, ArrowRight, MessageCircle, QrCode } from "lucide-react";

const WA_NUMBER = "085933648537";
const WA_LINK = `https://wa.me/${WA_NUMBER}`;

export const metadata: Metadata = {
  title: "Untuk Developer — Daftarkan Aplikasi Android Anda di Mobix",
  description:
    "Mobix membantu developer Indonesia mempromosikan aplikasi Android mereka. Biaya listing Rp10.000 sekali seumur hidup. Jangkau ribuan pengguna.",
  openGraph: {
    title: "Daftarkan Aplikasi Android di Mobix — Untuk Developer",
    description:
      "Promosikan aplikasi Android Anda melalui Mobix. Bayar sekali, listing seumur hidup.",
  },
};

const faqData = [
  {
    question: "Bagaimana cara mendaftarkan aplikasi saya di Mobix?",
    answer:
      `Hubungi admin Mobix via WhatsApp di ${WA_NUMBER}. Kirimkan detail aplikasi Anda (nama, deskripsi, kategori), logo aplikasi (max 2MB), dan file APK (max 200MB). Setelah itu lakukan pembayaran Rp10.000 via QRIS, dan admin akan mengupload aplikasi Anda ke katalog Mobix.`,
  },
  {
    question: "Berapa biaya listing aplikasi di Mobix?",
    answer:
      "Biaya listing aplikasi di Mobix hanya Rp10.000 SEKALI untuk seumur hidup. Tidak ada biaya berulang, tidak ada potongan dari aplikasi Anda. Cukup bayar sekali via QRIS, aplikasi Anda akan tampil selamanya.",
  },
  {
    question: "Apakah ada batasan jumlah aplikasi yang bisa didaftarkan?",
    answer:
      "Tidak ada batasan. Anda bisa mendaftarkan banyak aplikasi dengan biaya Rp10.000 per aplikasi. Setiap aplikasi akan mendapatkan halaman detail sendiri dengan sistem rating dan ulasan.",
  },
  {
    question: "Bagaimana cara pengguna mendownload aplikasi saya?",
    answer:
      "Pengguna cukup membuka halaman aplikasi Anda di Mobix, klik tombol 'Install Aplikasi', dan file APK akan langsung terdownload melalui CDN. Tidak ada link shortener, tidak ada iklan pop-up, langsung download.",
  },
  {
    question: "Apakah aplikasi saya akan aman di Mobix?",
    answer:
      "Ya. Mobix menyediakan enkripsi data dalam transit, sistem rating dan ulasan untuk membangun kepercayaan, serta informasi data safety yang transparan.",
  },
];

export default function DevelopersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-store/15 shadow-sm border border-store/20">
          <Send className="size-7 text-store" />
        </div>
        <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          Daftarkan Aplikasi Android <span className="text-store">Anda di Mobix</span>
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Punya aplikasi Android tapi bingung cara mempromosikannya? Admin Mobix akan membantu 
          mendaftarkan dan menampilkan aplikasi Anda di platform kami. Cukup Rp10.000 sekali untuk listing seumur hidup.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 min-h-[48px] rounded-full bg-store px-8 py-3 text-base font-bold text-white transition-all hover:bg-store-light active:scale-95 shadow-lg shadow-store/20"
          >
            <MessageCircle className="size-5" />
            Hubungi Admin via WhatsApp <ArrowRight className="size-5" />
          </a>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 min-h-[48px] rounded-full border border-gray-200 bg-white px-8 py-3 text-base font-bold text-gray-700 transition-all hover:border-store/30 hover:bg-store/5 active:scale-95 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-store/30"
          >
            Pelajari Lebih Lanjut
          </Link>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="mb-16 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: DollarSign, title: "Bayar Sekali, Selamanya", desc: "Cukup Rp10.000 sekali saja untuk listing aplikasi Anda seumur hidup. Tanpa biaya berulang atau potongan." },
          { icon: Users, title: "Jangkau Ribuan Pengguna", desc: "Aplikasi Anda akan tampil di katalog publik Mobix yang dikunjungi ribuan pengguna Android Indonesia." },
          { icon: Zap, title: "Download Cepat via CDN", desc: "File APK Anda dihosting langsung tanpa link shortener atau iklan. Pengguna download dengan kecepatan penuh." },
          { icon: Smartphone, title: "Halaman Detail Profesional", desc: "Setiap aplikasi mendapat halaman detail dengan logo, screenshot, deskripsi, rating, dan ulasan pengguna." },
          { icon: Shield, title: "Aman & Transparan", desc: "Data safety, sistem rating, dan ulasan membangun kepercayaan pengguna terhadap aplikasi Anda." },
          { icon: CheckCircle, title: "Mudah & Cepat", desc: "Cukup hubungi kami, kirim APK, dan tim Mobix yang akan mengurus sisanya." },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 hover:shadow-md transition">
            <div className="mb-3 sm:mb-4 flex size-10 sm:size-11 items-center justify-center rounded-xl bg-store/10 text-store">
              <item.icon className="size-5" />
            </div>
            <h3 className="mb-1.5 sm:mb-2 text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="mb-16 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-6 text-center text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          Cara Daftarkan Aplikasi di <span className="text-store">Mobix</span>
        </h2>
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-4">
          {[
            { step: "1", title: "Chat WhatsApp", desc: `Hubungi admin di ${WA_NUMBER} via WhatsApp.` },
            { step: "2", title: "Kirim Data APK", desc: "Kirim nama, deskripsi, kategori, logo, dan file APK." },
            { step: "3", title: "Bayar via QRIS", desc: "Transfer Rp10.000 via QRIS untuk listing seumur hidup." },
            { step: "4", title: "Admin Upload", desc: "Admin akan upload aplikasi Anda ke katalog Mobix." },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-store text-lg font-bold text-white">
                {item.step}
              </div>
              <h3 className="mb-1 font-bold text-gray-900 dark:text-gray-100">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section with Schema */}
      <div className="mb-16">
        <h2 className="mb-6 text-center text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          Pertanyaan Umum Developer
        </h2>
        <div className="space-y-3">
          {faqData.map((faq, i) => (
            <details
              key={i}
              className="group rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <summary className="flex cursor-pointer items-center justify-between text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <svg
                  className="size-4 shrink-0 text-gray-400 transition group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{faq.answer}</p>
            </details>
          ))}
        </div>

        {/* FAQ JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqData.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </div>

      {/* Contact CTA */}
      <div className="text-center">
        <div className="rounded-2xl border border-store/20 bg-store/5 p-8 sm:p-10">
          <h2 className="mb-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Punya Aplikasi yang Ingin Didaftarkan?
          </h2>
          <p className="mb-6 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Hubungi admin via WhatsApp sekarang. Kirim data aplikasi Anda, lakukan pembayaran via QRIS, dan admin akan menguploadnya ke katalog Mobix.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-[48px] rounded-full bg-store px-8 py-3 text-base font-bold text-white transition-all hover:bg-store-light active:scale-95 shadow-lg shadow-store/20"
            >
              <MessageCircle className="size-5" />
              Hubungi Admin via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
