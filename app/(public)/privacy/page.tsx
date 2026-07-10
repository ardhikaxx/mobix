import type { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — Mobix",
  description: "Kebijakan privasi Mobix — bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-store/15 shadow-sm border border-store/20">
          <Shield className="size-7 text-store" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          Kebijakan Privasi
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Terakhir diperbarui: 10 Juli 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">1. Informasi yang Kami Kumpulkan</h2>
          <p>Kami mengumpulkan informasi berikut saat Anda menggunakan Mobix:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Informasi akun (nama, email, foto profil) saat mendaftar</li>
            <li>Aplikasi yang Anda download dan request yang Anda buat</li>
            <li>Data penggunaan platform untuk analitik internal</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">2. Penggunaan Informasi</h2>
          <p>Informasi Anda digunakan untuk:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Menyediakan dan memelihara layanan platform</li>
            <li>Menampilkan riwayat download dan request Anda</li>
            <li>Meningkatkan pengalaman pengguna</li>
            <li>Berkomunikasi terkait pembaruan platform</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">3. Penyimpanan Data</h2>
          <p>
            Data Anda disimpan secara aman di Firebase (Google Cloud Platform). Kami menggunakan 
            enkripsi data dalam transit (TLS) dan mengikuti praktik keamanan standar industri.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">4. Berbagi Data</h2>
          <p>
            Kami tidak menjual data pribadi Anda ke pihak ketiga. Data hanya dibagikan dengan 
            penyedia layanan yang diperlukan untuk operasional platform (Firebase, Vercel).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">5. Hak Anda</h2>
          <p>Anda berhak untuk:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Mengakses data pribadi Anda</li>
            <li>Memperbarui atau memperbaiki data yang tidak akurat</li>
            <li>Menghapus akun dan data Anda</li>
            <li>Menolak pengumpulan data tertentu</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">6. Kontak</h2>
          <p>
            Jika ada pertanyaan tentang kebijakan privasi ini, hubungi kami melalui WhatsApp 
            di <span className="font-semibold text-gray-900 dark:text-gray-100">0859-3364-8537</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
