import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Shield, Users, Zap, Heart, Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Mobix — Platform Distribusi Aplikasi Android Komunitas",
  description:
    "Mobix adalah platform distribusi aplikasi mobile berbasis komunitas untuk developer Indonesia. Upload dan download APK Android gratis, cepat, dan aman.",
  openGraph: {
    title: "Tentang Mobix — Platform Aplikasi Komunitas Indonesia",
    description:
      "Platform distribusi aplikasi mobile berbasis komunitas. Upload dan download aplikasi Android buatan komunitas Indonesia.",
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Header Section */}
      <div className="mb-14 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-store/15 shadow-sm border border-store/20">
            <Image
              src="/images/logo_mobix_transparent.png"
              alt="Mobix Logo"
              width={40}
              height={40}
              className="object-contain"
              style={{ width: "auto", height: "auto" }}
            />
        </div>
        <h1 className="mb-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          Tentang <span className="text-store">Mobix</span>
        </h1>
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-gray-600 dark:text-gray-400 dark:text-gray-500 leading-relaxed">
          Mobix adalah platform distribusi aplikasi mobile berbasis komunitas. 
          Tempat di mana developer dan pengguna bertemu dalam satu ekosistem 
          yang terbuka, cepat, dan 100% tanpa iklan pop-up.
        </p>
      </div>

      {/* Value Proposition Grid */}
      <div className="mb-12 sm:mb-16 grid gap-4 sm:gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 hover:shadow-md transition">
          <div className="mb-3 sm:mb-4 flex size-10 sm:size-11 items-center justify-center rounded-xl bg-store/10 text-store font-bold">
            <Shield className="size-5" />
          </div>
          <h3 className="mb-1.5 sm:mb-2 text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">Misi Kami</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 leading-relaxed">
            Memberikan platform yang aman, transparan, dan mudah bagi pengembang untuk membagikan 
            karya mereka langsung kepada pengguna, tanpa perantara yang rumit atau potongan biaya.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 hover:shadow-md transition">
          <div className="mb-3 sm:mb-4 flex size-10 sm:size-11 items-center justify-center rounded-xl bg-store/10 text-store font-bold">
            <Users className="size-5" />
          </div>
          <h3 className="mb-1.5 sm:mb-2 text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">Digerakkan Komunitas</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 leading-relaxed">
            Mobix sepenuhnya digerakkan oleh komunitas. Setiap aplikasi yang tersedia diunggah 
            oleh pengguna terdaftar, menciptakan katalog yang beragam dan terus berkembang.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 hover:shadow-md transition">
          <div className="mb-3 sm:mb-4 flex size-10 sm:size-11 items-center justify-center rounded-xl bg-store/10 text-store font-bold">
            <Zap className="size-5" />
          </div>
          <h3 className="mb-1.5 sm:mb-2 text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">Direct Download & CDN</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 leading-relaxed">
            Statistik download, riwayat versi, dan informasi developer ditampilkan 
            secara terbuka dengan kecepatan unduh tinggi langsung tanpa link shortener.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 hover:shadow-md transition">
          <div className="mb-3 sm:mb-4 flex size-10 sm:size-11 items-center justify-center rounded-xl bg-store/10 text-store font-bold">
            <Sparkles className="size-5" />
          </div>
          <h3 className="mb-1.5 sm:mb-2 text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">Bayar Sekali, Selamanya</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Cukup Rp10.000 sekali saja, Anda bisa upload dan menampilkan aplikasi 
            mobile Anda disini untuk selamanya. Tanpa biaya berulang, tanpa potongan, 
            untuk kebutuhan apapun.
          </p>
        </div>
      </div>

      {/* Developer CTA */}
      <div className="mb-12 text-center rounded-2xl border border-store/20 bg-store/5 p-6 sm:p-8">
        <h2 className="mb-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
          Punya Aplikasi Android Buatanmu?
        </h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Daftarkan aplikasi mobile Anda ke komunitas Indonesia. Cukup Rp10.000 sekali untuk listing seumur hidup.
        </p>
        <Link
          href="/developers"
          className="inline-flex items-center gap-2 min-h-[44px] rounded-full bg-store px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-store-light active:scale-95 shadow-md shadow-store/20"
        >
          Pelajari Cara Daftar <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Donasi QRIS Section (Khusus Untuk Donasi Saja) */}
      <div className="rounded-xl border border-store/20 bg-store/5 dark:bg-store/10 p-6 text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-store">
          <Heart className="size-3 fill-store text-store" />
          <span>DONASI UNTUK PENGEMBANGAN</span>
        </div>

        <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
          Donasi Pengembangan <span className="text-store">Mobix</span>
        </h2>
        <p className="mx-auto mb-4 max-w-md text-sm text-gray-600 dark:text-gray-400">
          Bantu kami menjaga operasional server dan CDN dengan donasi melalui QRIS.
        </p>

        {/* QRIS - Simplified */}
        <div className="mx-auto w-full max-w-xs">
          <div className="relative mx-auto w-max">
            <Image
              src="/assets/qris.png"
              alt="QRIS Donasi Mobix"
              width={240}
              height={240}
              priority
              className="object-contain"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Terima kasih atas kontribusi Anda! 💚
        </p>
      </div>
    </div>
  );
}
