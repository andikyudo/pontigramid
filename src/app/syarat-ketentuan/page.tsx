import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import { FileText, AlertTriangle, CheckCircle, XCircle, Scale, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan - PontigramID',
  description: 'Syarat dan ketentuan penggunaan layanan PontigramID yang mengatur hak dan kewajiban pengguna serta penyedia layanan.',
  keywords: 'syarat ketentuan, terms of service, aturan penggunaan, hukum, pontigramid',
  openGraph: {
    title: 'Syarat & Ketentuan - PontigramID',
    description: 'Syarat dan ketentuan penggunaan layanan PontigramID yang mengatur hak dan kewajiban pengguna serta penyedia layanan.',
    type: 'website',
  },
};

const userRights = [
  'Mengakses dan membaca konten berita secara gratis',
  'Berbagi artikel melalui media sosial dengan mencantumkan sumber',
  'Memberikan komentar dan feedback yang konstruktif',
  'Berlangganan newsletter dan update berita',
  'Menghubungi redaksi untuk tips berita atau pertanyaan'
];

const userObligations = [
  'Tidak menyebarkan informasi palsu atau menyesatkan',
  'Menghormati hak cipta dan kekayaan intelektual',
  'Tidak melakukan aktivitas yang dapat merusak sistem',
  'Menggunakan bahasa yang sopan dalam interaksi',
  'Tidak melanggar hukum yang berlaku di Indonesia'
];

const prohibitedActivities = [
  {
    icon: XCircle,
    title: 'Konten Ilegal',
    description: 'Menyebarkan konten yang melanggar hukum, termasuk ujaran kebencian, pornografi, atau konten yang merugikan.'
  },
  {
    icon: XCircle,
    title: 'Spam dan Malware',
    description: 'Mengirim spam, virus, malware, atau kode berbahaya lainnya melalui platform kami.'
  },
  {
    icon: XCircle,
    title: 'Pelanggaran Privasi',
    description: 'Mengumpulkan atau menyalahgunakan informasi pribadi pengguna lain tanpa izin.'
  },
  {
    icon: XCircle,
    title: 'Manipulasi Sistem',
    description: 'Mencoba mengakses, memodifikasi, atau merusak sistem dan infrastruktur kami.'
  }
];

export default function SyaratKetentuan() {
  return (
    <PageLayout
      title="Syarat & Ketentuan"
      description="Syarat dan ketentuan ini mengatur penggunaan layanan PontigramID. Dengan mengakses situs ini, Anda menyetujui untuk mematuhi ketentuan yang berlaku."
      breadcrumbs={[
        { label: 'Syarat & Ketentuan' }
      ]}
    >
      <div className="prose prose-lg max-w-none space-y-8">
        {/* Introduction */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 m-0">Perjanjian Penggunaan</h2>
          </div>
          <p className="text-gray-700 m-0">
            Dengan mengakses dan menggunakan situs web PontigramID, Anda menyetujui untuk terikat 
            oleh syarat dan ketentuan yang ditetapkan di bawah ini. Jika Anda tidak menyetujui 
            ketentuan ini, mohon untuk tidak menggunakan layanan kami.
          </p>
        </div>

        <p className="text-sm text-gray-600">
          <strong>Terakhir diperbarui:</strong> 7 Juni 2024
        </p>

        {/* Acceptance of Terms */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Penerimaan Ketentuan</h2>
          <p>
            Syarat dan ketentuan ini merupakan perjanjian hukum antara Anda sebagai pengguna 
            dengan PT. PontigramID sebagai penyedia layanan. Dengan menggunakan situs web ini, 
            Anda menyatakan bahwa:
          </p>
          <ul className="space-y-2">
            <li>Anda telah membaca dan memahami seluruh ketentuan ini</li>
            <li>Anda berusia minimal 18 tahun atau memiliki izin dari orang tua/wali</li>
            <li>Anda memiliki kapasitas hukum untuk mengikat diri dalam perjanjian</li>
            <li>Informasi yang Anda berikan adalah akurat dan terkini</li>
          </ul>
        </div>

        {/* Service Description */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Deskripsi Layanan</h2>
          <p>
            PontigramID adalah portal berita digital yang menyediakan informasi terkini dari 
            berbagai kategori termasuk politik, ekonomi, olahraga, teknologi, hiburan, kesehatan, 
            dan pendidikan. Layanan kami meliputi:
          </p>
          <ul className="space-y-2">
            <li>Artikel berita dan analisis</li>
            <li>Konten multimedia (foto, video, infografis)</li>
            <li>Newsletter dan notifikasi berita</li>
            <li>Fitur berbagi dan komentar</li>
            <li>Arsip berita dan pencarian</li>
          </ul>
        </div>

        {/* User Rights and Obligations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              Hak Pengguna
            </h2>
            <ul className="space-y-3">
              {userRights.map((right, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{right}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              Kewajiban Pengguna
            </h2>
            <ul className="space-y-3">
              {userObligations.map((obligation, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{obligation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Prohibited Activities */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Aktivitas yang Dilarang</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prohibitedActivities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <IconComponent className="h-5 w-5 text-red-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 m-0">{activity.title}</h3>
                  </div>
                  <p className="text-gray-700 text-sm m-0">{activity.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Intellectual Property */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hak Kekayaan Intelektual</h2>
          <p>
            Seluruh konten yang tersedia di PontigramID, termasuk namun tidak terbatas pada 
            artikel, foto, video, logo, dan desain, dilindungi oleh hak cipta dan merupakan 
            kekayaan intelektual PT. PontigramID atau pihak ketiga yang telah memberikan lisensi.
          </p>
          <p>
            Anda diperbolehkan untuk:
          </p>
          <ul className="space-y-2">
            <li>Membaca dan mengakses konten untuk penggunaan pribadi</li>
            <li>Berbagi artikel dengan mencantumkan sumber dan link asli</li>
            <li>Mengutip sebagian konten untuk tujuan pendidikan atau jurnalistik</li>
          </ul>
          <p>
            Anda tidak diperbolehkan untuk:
          </p>
          <ul className="space-y-2">
            <li>Menyalin, memodifikasi, atau mendistribusikan konten tanpa izin</li>
            <li>Menggunakan konten untuk tujuan komersial tanpa lisensi</li>
            <li>Menghapus atau mengubah pemberitahuan hak cipta</li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Penafian Tanggung Jawab</h2>
          <p>
            PontigramID berusaha menyajikan informasi yang akurat dan terkini, namun kami 
            tidak dapat menjamin keakuratan, kelengkapan, atau ketepatan waktu dari semua 
            informasi yang disajikan. Penggunaan informasi dari situs ini sepenuhnya menjadi 
            risiko Anda sendiri.
          </p>
          <p>
            Kami tidak bertanggung jawab atas:
          </p>
          <ul className="space-y-2">
            <li>Kerugian yang timbul dari penggunaan informasi di situs ini</li>
            <li>Gangguan teknis atau ketidaktersediaan layanan</li>
            <li>Konten dari situs web pihak ketiga yang terhubung</li>
            <li>Tindakan pengguna lain di platform kami</li>
          </ul>
        </div>

        {/* Privacy */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Privasi</h2>
          <p>
            Pengumpulan dan penggunaan informasi pribadi Anda diatur dalam 
            <a href="/kebijakan-privasi" className="text-blue-600 hover:text-blue-700 mx-1">
              Kebijakan Privasi
            </a>
            kami yang merupakan bagian integral dari syarat dan ketentuan ini.
          </p>
        </div>

        {/* Termination */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Penghentian Layanan</h2>
          <p>
            Kami berhak untuk menghentikan atau membatasi akses Anda ke layanan kami tanpa 
            pemberitahuan sebelumnya jika Anda melanggar ketentuan ini atau melakukan aktivitas 
            yang merugikan. Anda juga dapat menghentikan penggunaan layanan kami kapan saja.
          </p>
        </div>

        {/* Governing Law */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hukum yang Berlaku</h2>
          <p>
            Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik 
            Indonesia. Setiap sengketa yang timbul akan diselesaikan melalui pengadilan yang 
            berwenang di Jakarta, Indonesia.
          </p>
        </div>

        {/* Changes to Terms */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perubahan Ketentuan</h2>
          <p>
            Kami berhak untuk mengubah syarat dan ketentuan ini kapan saja. Perubahan akan 
            dinotifikasikan melalui situs web kami dan mulai berlaku sejak tanggal publikasi. 
            Penggunaan layanan yang berkelanjutan setelah perubahan dianggap sebagai persetujuan 
            terhadap ketentuan yang baru.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <Scale className="h-6 w-6 text-gray-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 m-0">Kontak Hukum</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi 
            tim legal kami:
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> legal@pontigramid.com</p>
            <p><strong>Telepon:</strong> +62 21-1234-5678</p>
            <p><strong>Alamat:</strong> Jl. Sudirman No. 123, Jakarta Pusat 10220, Indonesia</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
