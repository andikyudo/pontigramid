import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import { AlertTriangle, Info, Shield, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Disclaimer - PontigramID',
  description: 'Disclaimer PontigramID mengenai penggunaan informasi, tanggung jawab konten, dan batasan layanan yang disediakan.',
  keywords: 'disclaimer, penafian, tanggung jawab, batasan layanan, pontigramid',
  openGraph: {
    title: 'Disclaimer - PontigramID',
    description: 'Disclaimer PontigramID mengenai penggunaan informasi, tanggung jawab konten, dan batasan layanan yang disediakan.',
    type: 'website',
  },
};

export default function Disclaimer() {
  return (
    <PageLayout
      title="Disclaimer"
      description="Penafian dan batasan tanggung jawab terkait penggunaan layanan dan informasi yang disediakan oleh PontigramID."
      breadcrumbs={[
        { label: 'Disclaimer' }
      ]}
    >
      <div className="prose prose-lg max-w-none space-y-8">
        {/* Main Disclaimer */}
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 m-0">Penafian Umum</h2>
          </div>
          <p className="text-gray-700 m-0">
            Informasi yang disajikan di PontigramID dimaksudkan untuk tujuan informasi umum. 
            Meskipun kami berusaha menyajikan informasi yang akurat dan terkini, kami tidak 
            memberikan jaminan atau representasi mengenai keakuratan, kelengkapan, atau 
            kesesuaian informasi untuk tujuan tertentu.
          </p>
        </div>

        <p className="text-sm text-gray-600">
          <strong>Terakhir diperbarui:</strong> 7 Juni 2024
        </p>

        {/* Information Accuracy */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Info className="h-6 w-6 text-blue-600 mr-3" />
            Keakuratan Informasi
          </h2>
          <p>
            PontigramID berkomitmen untuk menyajikan berita dan informasi yang akurat. Namun, 
            kami tidak dapat menjamin bahwa semua informasi yang disajikan bebas dari kesalahan 
            atau selalu merupakan informasi terbaru. Situasi dan fakta dapat berubah dengan cepat, 
            dan kami mungkin tidak selalu dapat memperbarui informasi secara real-time.
          </p>
          <p>
            Pembaca disarankan untuk:
          </p>
          <ul className="space-y-2">
            <li>Memverifikasi informasi penting dari sumber lain</li>
            <li>Tidak mengandalkan informasi tunggal untuk keputusan penting</li>
            <li>Memahami bahwa berita dapat berkembang seiring waktu</li>
            <li>Melaporkan kesalahan yang ditemukan kepada tim redaksi</li>
          </ul>
        </div>

        {/* Editorial Independence */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Independensi Editorial</h2>
          <p>
            Konten editorial di PontigramID diproduksi secara independen oleh tim redaksi kami. 
            Meskipun kami berusaha menjaga objektivitas, setiap artikel dapat mengandung sudut 
            pandang atau interpretasi tertentu dari penulis atau editor.
          </p>
          <p>
            Opini yang diekspresikan dalam artikel, komentar, atau konten lainnya adalah milik 
            penulis masing-masing dan tidak selalu mencerminkan pandangan resmi PontigramID 
            sebagai organisasi.
          </p>
        </div>

        {/* Third Party Content */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <ExternalLink className="h-6 w-6 text-purple-600 mr-3" />
            Konten Pihak Ketiga
          </h2>
          <p>
            Situs kami mungkin berisi link ke situs web pihak ketiga atau konten yang berasal 
            dari sumber eksternal. PontigramID tidak bertanggung jawab atas:
          </p>
          <ul className="space-y-2">
            <li>Keakuratan atau keandalan konten dari situs pihak ketiga</li>
            <li>Kebijakan privasi atau praktik keamanan situs eksternal</li>
            <li>Ketersediaan atau fungsionalitas link eksternal</li>
            <li>Konten iklan atau promosi dari pihak ketiga</li>
          </ul>
          <p>
            Penggunaan link eksternal dan interaksi dengan situs pihak ketiga sepenuhnya 
            menjadi risiko dan tanggung jawab pengguna.
          </p>
        </div>

        {/* Medical and Health Information */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Informasi Kesehatan</h2>
          <p>
            Informasi kesehatan yang disajikan di PontigramID dimaksudkan untuk tujuan edukasi 
            dan informasi umum. Informasi ini tidak dimaksudkan sebagai pengganti konsultasi 
            medis profesional, diagnosis, atau pengobatan.
          </p>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-800 font-medium m-0">
              Selalu konsultasikan dengan dokter atau tenaga medis profesional untuk masalah 
              kesehatan Anda. Jangan mengabaikan nasihat medis atau menunda mencari bantuan 
              medis karena informasi yang Anda baca di situs ini.
            </p>
          </div>
        </div>

        {/* Financial Information */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Informasi Keuangan</h2>
          <p>
            Informasi ekonomi dan keuangan yang disajikan dimaksudkan untuk tujuan informasi 
            umum dan tidak boleh dianggap sebagai nasihat investasi atau keuangan. Keputusan 
            investasi atau keuangan harus dibuat berdasarkan konsultasi dengan penasihat 
            keuangan profesional.
          </p>
          <p>
            PontigramID tidak bertanggung jawab atas kerugian finansial yang mungkin timbul 
            dari keputusan yang dibuat berdasarkan informasi di situs ini.
          </p>
        </div>

        {/* Technical Limitations */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Keterbatasan Teknis</h2>
          <p>
            Meskipun kami berusaha menjaga situs web agar selalu dapat diakses, kami tidak 
            dapat menjamin bahwa layanan akan selalu tersedia tanpa gangguan. Situs dapat 
            mengalami downtime karena:
          </p>
          <ul className="space-y-2">
            <li>Pemeliharaan sistem dan server</li>
            <li>Masalah teknis yang tidak terduga</li>
            <li>Gangguan jaringan internet</li>
            <li>Serangan cyber atau masalah keamanan</li>
            <li>Bencana alam atau force majeure</li>
          </ul>
        </div>

        {/* User Generated Content */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Konten Pengguna</h2>
          <p>
            Komentar, feedback, atau konten lain yang dibuat oleh pengguna tidak mencerminkan 
            pandangan PontigramID. Kami tidak bertanggung jawab atas konten yang dibuat oleh 
            pengguna, meskipun kami berhak untuk memoderasi atau menghapus konten yang tidak 
            sesuai dengan kebijakan kami.
          </p>
        </div>

        {/* Limitation of Liability */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Shield className="h-6 w-6 text-gray-600 mr-3" />
            Batasan Tanggung Jawab
          </h2>
          <p>
            Dalam batas maksimal yang diizinkan oleh hukum, PontigramID tidak bertanggung jawab 
            atas kerugian langsung, tidak langsung, insidental, khusus, atau konsekuensial yang 
            timbul dari:
          </p>
          <ul className="space-y-2">
            <li>Penggunaan atau ketidakmampuan menggunakan situs web</li>
            <li>Ketergantungan pada informasi yang disajikan</li>
            <li>Gangguan atau kesalahan dalam layanan</li>
            <li>Kehilangan data atau informasi</li>
            <li>Tindakan pihak ketiga</li>
          </ul>
        </div>

        {/* Updates and Changes */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pembaruan Disclaimer</h2>
          <p>
            Disclaimer ini dapat diperbarui dari waktu ke waktu untuk mencerminkan perubahan 
            dalam layanan kami atau persyaratan hukum. Versi terbaru akan selalu tersedia di 
            halaman ini dengan tanggal pembaruan yang jelas.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pertanyaan dan Klarifikasi</h2>
          <p className="text-gray-700 mb-4">
            Jika Anda memiliki pertanyaan tentang disclaimer ini atau memerlukan klarifikasi 
            mengenai informasi tertentu, silakan hubungi kami:
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> info@pontigramid.com</p>
            <p><strong>Telepon:</strong> +62 21-1234-5678</p>
            <p><strong>Alamat:</strong> Jl. Sudirman No. 123, Jakarta Pusat 10220, Indonesia</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
