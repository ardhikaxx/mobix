import Image from "next/image";
import { Smartphone, Shield, Users, Zap, Heart, QrCode, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Header Section */}
      <div className="mb-14 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-store/15 shadow-sm border border-store/20">
          <Smartphone className="size-8 text-store" />
        </div>
        <h1 className="mb-3 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Tentang <span className="text-store">Mobix</span>
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600 leading-relaxed">
          Mobix adalah platform distribusi aplikasi mobile berbasis komunitas. 
          Tempat di mana developer dan pengguna bertemu dalam satu ekosistem 
          yang terbuka, cepat, gratis, dan 100% tanpa iklan pop-up.
        </p>
      </div>

      {/* Value Proposition Grid */}
      <div className="mb-16 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-store/10 text-store font-bold">
            <Shield className="size-5" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">Misi Kami</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Memberikan platform yang aman, transparan, dan mudah bagi pengembang untuk membagikan 
            karya mereka langsung kepada pengguna, tanpa perantara yang rumit atau potongan biaya.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-store/10 text-store font-bold">
            <Users className="size-5" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">Digerakkan Komunitas</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Mobix sepenuhnya digerakkan oleh komunitas. Setiap aplikasi yang tersedia diunggah 
            oleh pengguna terdaftar, menciptakan katalog yang beragam dan terus berkembang.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-store/10 text-store font-bold">
            <Zap className="size-5" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">Direct Download & CDN</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Statistik download, riwayat versi, dan informasi developer ditampilkan 
            secara terbuka dengan kecepatan unduh tinggi langsung tanpa link shortener.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-store/10 text-store font-bold">
            <Sparkles className="size-5" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">Gratis Selamanya</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Tidak ada biaya untuk upload maupun download. Mobix berkomitmen untuk tetap gratis 
            dan bebas iklan yang mengganggu bagi seluruh pengguna.
          </p>
        </div>
      </div>

      {/* Donasi QRIS Section (Khusus Untuk Donasi Saja) */}
      <div className="relative overflow-hidden rounded-3xl border border-store/30 bg-gradient-to-b from-store/10 via-white to-store/5 p-8 sm:p-10 text-center shadow-xl">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-store/15 px-4 py-1.5 text-xs font-extrabold text-store tracking-wide">
          <Heart className="size-3.5 fill-store text-store animate-pulse" />
          <span>DUKUNGAN KOMUNITAS • KHUSUS DONASI SAJA</span>
        </div>

        <h2 className="mb-3 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Donasi Pengembangan <span className="text-store">Mobix</span>
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-sm sm:text-base text-gray-600 leading-relaxed">
          Mobix disediakan 100% gratis tanpa iklan bagi developer dan pengguna. 
          Untuk mendukung biaya operasional server, bandwidth CDN, serta pemeliharaan platform, 
          Anda dapat berdonasi secara sukarela melalui scan QRIS di bawah ini.
        </p>

        {/* QRIS Card Box */}
        <div className="mx-auto max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
          <div className="mb-3 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2.5">
            <QrCode className="size-4 text-store" />
            <span>QRIS Resmi Donasi Mobix</span>
          </div>

          <div className="relative mx-auto my-3 w-full max-w-[280px] aspect-[4/5] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-inner flex items-center justify-center p-2">
            <Image
              src="/assets/qris.png"
              alt="QRIS Donasi Mobix - Untuk Donasi Saja"
              width={280}
              height={360}
              priority
              className="object-contain size-full rounded-lg"
            />
          </div>

          <p className="mt-3 text-[11px] font-semibold text-gray-400">
            *Dapat dipindai/scan menggunakan semua aplikasi e-Wallet (GoPay, OVO, DANA, ShopeePay) & Mobile Banking.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-gray-500">
          <span>💚 Terima kasih atas kontribusi Anda untuk kemajuan ekosistem Android komunitas!</span>
        </div>
      </div>
    </div>
  );
}
