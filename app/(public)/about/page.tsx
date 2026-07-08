import { Smartphone, Shield, Users, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-blue-100">
          <Smartphone className="size-8 text-blue-600" />
        </div>
        <h1 className="mb-3 text-3xl font-bold text-gray-900">Tentang Mobix</h1>
        <p className="mx-auto max-w-2xl text-gray-500">
          Mobix adalah platform distribusi aplikasi mobile berbasis komunitas. 
          Tempat di mana developer dan pengguna bertemu dalam satu ekosistem 
          yang terbuka, gratis, dan tanpa iklan.
        </p>
      </div>

      <div className="mb-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-100 p-6">
          <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-blue-100">
            <Shield className="size-5 text-blue-600" />
          </div>
          <h3 className="mb-2 font-semibold text-gray-900">Misi Kami</h3>
          <p className="text-sm text-gray-500">
            Memberikan platform yang aman dan mudah bagi pengembang untuk membagikan 
            karya mereka langsung kepada pengguna, tanpa perantara yang rumit.
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 p-6">
          <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-green-100">
            <Users className="size-5 text-green-600" />
          </div>
          <h3 className="mb-2 font-semibold text-gray-900">Komunitas</h3>
          <p className="text-sm text-gray-500">
            Mobix digerakkan oleh komunitas. Setiap aplikasi yang tersedia diunggah 
            oleh pengguna terdaftar, menciptakan katalog yang beragam dan terus berkembang.
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 p-6">
          <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-purple-100">
            <Zap className="size-5 text-purple-600" />
          </div>
          <h3 className="mb-2 font-semibold text-gray-900">Transparan</h3>
          <p className="text-sm text-gray-500">
            Statistik download, riwayat versi, dan informasi developer ditampilkan 
            secara terbuka untuk setiap aplikasi.
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 p-6">
          <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-orange-100">
            <Smartphone className="size-5 text-orange-600" />
          </div>
          <h3 className="mb-2 font-semibold text-gray-900">Gratis Selamanya</h3>
          <p className="text-sm text-gray-500">
            Tidak ada biaya untuk upload maupun download. Mobix tetap gratis 
            untuk seluruh pengguna.
          </p>
        </div>
      </div>
    </div>
  );
}
