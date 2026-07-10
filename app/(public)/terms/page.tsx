import type { Metadata } from "next";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan — Mobix",
  description: "Syarat dan ketentuan penggunaan platform Mobix.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-store/15 shadow-sm border border-store/20">
          <FileText className="size-7 text-store" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          Syarat & Ketentuan
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Terakhir diperbarui: 10 Juli 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">1. Penerimaan Syarat</h2>
          <p>
            Dengan menggunakan platform Mobix, Anda menyetujui syarat dan ketentuan ini. 
            Jika Anda tidak setuju, jangan gunakan layanan kami.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">2. Deskripsi Layanan</h2>
          <p>
            Mobix adalah platform distribusi aplikasi Android berbasis komunitas. 
            Pengguna dapat mengunduh aplikasi gratis. Developer dapat mendaftarkan aplikasi 
            mereka dengan biaya Rp10.000 per aplikasi (sekali bayar, seumur hidup).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">3. Pendaftaran Akun</h2>
          <p>Untuk mengakses fitur tertentu, Anda perlu mendaftar akun. Anda bertanggung jawab menjaga kerahasiaan kredensial akun Anda.</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">4. Tanggung Jawab Pengguna</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Tidak menyalahgunakan platform untuk aktivitas ilegal</li>
            <li>Tidak mengunggah konten yang melanggar hak cipta</li>
            <li>Tidak menyebarkan malware atau kode berbahaya</li>
            <li>Tidak melakukan serangan terhadap infrastruktur platform</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">5. Aplikasi Pihak Ketiga</h2>
          <p>
            Aplikasi yang tersedia di Mobix dibuat oleh pihak ketiga. Mobix tidak bertanggung jawab 
            atas konten, fungsi, atau keamanan aplikasi tersebut. Pengguna mengunduh aplikasi 
            dengan risiko sendiri.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">6. Pembayaran Developer</h2>
          <p>
            Biaya pendaftaran aplikasi adalah Rp10.000 per aplikasi, dibayarkan sekali melalui 
            QRIS. Pembayaran bersifat final dan tidak dapat dikembalikan (non-refundable).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">7. Pembatasan Tanggung Jawab</h2>
          <p>
            Mobix tidak bertanggung jawab atas kerugian langsung atau tidak langsung yang timbul 
            dari penggunaan platform ini. Platform disediakan &quot;sebagaimana adanya&quot; (as-is).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">8. Perubahan Syarat</h2>
          <p>
            Kami dapat memperbarui syarat ini sewaktu-waktu. Perubahan akan diumumkan melalui 
            platform. Penggunaan lanjutan setelah perubahan berarti persetujuan Anda.
          </p>
        </section>
      </div>
    </div>
  );
}
