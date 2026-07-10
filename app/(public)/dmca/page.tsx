import type { Metadata } from "next";
import { Copyright } from "lucide-react";

export const metadata: Metadata = {
  title: "DMCA & Copyright — Mobix",
  description: "Kebijakan DMCA dan hak cipta Mobix.",
};

export default function DMCAPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-store/15 shadow-sm border border-store/20">
          <Copyright className="size-7 text-store" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          DMCA & Copyright
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Terakhir diperbarui: 10 Juli 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">Kebijakan Hak Cipta</h2>
          <p>
            Mobix menghormati hak kekayaan intelektual pihak lain. Jika Anda yakin bahwa 
            konten yang tersedia di Mobix melanggar hak cipta Anda, silakan hubungi kami 
            dengan informasi berikut:
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">Cara Melaporkan Pelanggaran</h2>
          <p>Kirim DMCA Notice ke kontak kami dengan menyertakan:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Identifikasi karya berhak cipta yang dilanggar</li>
            <li>Identifikasi konten yang melanggar di platform Mobix (sertakan URL)</li>
            <li>Nama, alamat, nomor telepon, dan email Anda</li>
            <li>Pernyataan bahwa Anda memiliki itikad baik bahwa penggunaan konten tidak sah</li>
            <li>Pernyataan bahwa informasi dalam pemberitahuan ini akurat</li>
            <li>Tanda tangan fisik atau elektronik</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">Kontak DMCA</h2>
          <p>
            Laporkan pelanggaran hak cipta melalui WhatsApp:<br />
            <span className="font-semibold text-gray-900 dark:text-gray-100">0859-3364-8537</span>
          </p>
          <p className="mt-2">
            Atau hubungi kami di:<br />
            <span className="font-semibold text-gray-900 dark:text-gray-100">Email: ardhikayanuar58@gmail.com</span>
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">Kebijakan Counter-Notice</h2>
          <p>
            Jika konten Anda dihapus karena klaim DMCA dan Anda yakin bahwa konten tersebut 
            tidak melanggar hak cipta, Anda dapat mengirimkan counter-notice. Tim Mobix akan 
            meninjau dan memulihkan konten dalam 10-14 hari kerja sesuai hukum yang berlaku.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">Pengguna Berulang</h2>
          <p>
            Mobix berhak menghentikan akun pengguna yang terbukti berulang kali melanggar 
            hak cipta pihak lain sesuai kebijakan DMCA.
          </p>
        </section>
      </div>
    </div>
  );
}
