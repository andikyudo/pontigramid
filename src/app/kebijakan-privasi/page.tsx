import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import { Shield, Eye, Lock, Database, UserCheck, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi - PontigramID',
  description: 'Kebijakan privasi PontigramID menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi pengguna.',
  keywords: 'kebijakan privasi, perlindungan data, privasi pengguna, keamanan informasi, pontigramid',
  openGraph: {
    title: 'Kebijakan Privasi - PontigramID',
    description: 'Kebijakan privasi PontigramID menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi pengguna.',
    type: 'website',
  },
};

const dataTypes = [
  {
    icon: UserCheck,
    title: 'Informasi Identitas',
    description: 'Nama, alamat email, nomor telepon yang Anda berikan saat mendaftar newsletter atau menghubungi kami.'
  },
  {
    icon: Eye,
    title: 'Data Penggunaan',
    description: 'Informasi tentang bagaimana Anda menggunakan situs web kami, termasuk halaman yang dikunjungi dan waktu kunjungan.'
  },
  {
    icon: Database,
    title: 'Data Teknis',
    description: 'Alamat IP, jenis browser, sistem operasi, dan informasi perangkat lainnya.'
  }
];

const protectionMeasures = [
  {
    icon: Lock,
    title: 'Enkripsi Data',
    description: 'Semua data sensitif dienkripsi menggunakan teknologi SSL/TLS terkini.'
  },
  {
    icon: Shield,
    title: 'Akses Terbatas',
    description: 'Hanya personel yang berwenang yang memiliki akses ke informasi pribadi Anda.'
  },
  {
    icon: Database,
    title: 'Penyimpanan Aman',
    description: 'Data disimpan di server yang aman dengan sistem backup dan monitoring 24/7.'
  }
];

export default function KebijakanPrivasi() {
  return (
    <PageLayout
      title="Kebijakan Privasi"
      description="Kebijakan privasi ini menjelaskan bagaimana PontigramID mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda."
      breadcrumbs={[
        { label: 'Kebijakan Privasi' }
      ]}
    >
      <div className="prose prose-lg max-w-none space-y-8">
        {/* Introduction */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 m-0">Komitmen Privasi Kami</h2>
          </div>
          <p className="text-gray-700 m-0">
            PontigramID berkomitmen untuk melindungi privasi dan keamanan informasi pribadi pengguna. 
            Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, 
            dan melindungi informasi Anda saat menggunakan layanan kami.
          </p>
        </div>

        <p className="text-sm text-gray-600">
          <strong>Terakhir diperbarui:</strong> 7 Juni 2024
        </p>

        {/* Information We Collect */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi yang Kami Kumpulkan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {dataTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <IconComponent className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 m-0">{type.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm m-0">{type.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How We Use Information */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bagaimana Kami Menggunakan Informasi</h2>
          <p>Kami menggunakan informasi yang dikumpulkan untuk tujuan berikut:</p>
          <ul className="space-y-2">
            <li>Menyediakan dan meningkatkan layanan berita dan konten</li>
            <li>Mengirimkan newsletter dan update berita (jika Anda berlangganan)</li>
            <li>Merespons pertanyaan dan permintaan dukungan</li>
            <li>Menganalisis penggunaan situs untuk meningkatkan pengalaman pengguna</li>
            <li>Mencegah aktivitas penipuan dan menjaga keamanan situs</li>
            <li>Mematuhi kewajiban hukum yang berlaku</li>
          </ul>
        </div>

        {/* Data Protection */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Perlindungan Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {protectionMeasures.map((measure, index) => {
              const IconComponent = measure.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{measure.title}</h3>
                  <p className="text-gray-600 text-sm">{measure.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cookies */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Penggunaan Cookies</h2>
          <p>
            Kami menggunakan cookies dan teknologi serupa untuk meningkatkan pengalaman browsing Anda. 
            Cookies membantu kami:
          </p>
          <ul className="space-y-2">
            <li>Mengingat preferensi dan pengaturan Anda</li>
            <li>Menganalisis lalu lintas dan penggunaan situs</li>
            <li>Menyediakan konten yang relevan</li>
            <li>Meningkatkan keamanan situs</li>
          </ul>
          <p>
            Anda dapat mengatur browser untuk menolak cookies, namun hal ini mungkin mempengaruhi 
            fungsionalitas beberapa fitur situs.
          </p>
        </div>

        {/* Third Party Services */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Layanan Pihak Ketiga</h2>
          <p>
            Kami dapat menggunakan layanan pihak ketiga untuk mendukung operasional situs, termasuk:
          </p>
          <ul className="space-y-2">
            <li><strong>Google Analytics:</strong> Untuk analisis lalu lintas dan penggunaan situs</li>
            <li><strong>Social Media Plugins:</strong> Untuk integrasi media sosial</li>
            <li><strong>Email Service Providers:</strong> Untuk mengirim newsletter</li>
            <li><strong>CDN Services:</strong> Untuk meningkatkan kecepatan loading</li>
          </ul>
          <p>
            Layanan pihak ketiga ini memiliki kebijakan privasi mereka sendiri yang mengatur 
            penggunaan informasi Anda.
          </p>
        </div>

        {/* User Rights */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hak-Hak Anda</h2>
          <p>Sebagai pengguna, Anda memiliki hak untuk:</p>
          <ul className="space-y-2">
            <li>Mengakses informasi pribadi yang kami miliki tentang Anda</li>
            <li>Meminta koreksi atau pembaruan informasi yang tidak akurat</li>
            <li>Meminta penghapusan informasi pribadi Anda</li>
            <li>Menolak atau membatasi pemrosesan informasi Anda</li>
            <li>Menarik persetujuan yang telah diberikan sebelumnya</li>
            <li>Mengajukan keluhan kepada otoritas perlindungan data</li>
          </ul>
        </div>

        {/* Data Retention */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Penyimpanan Data</h2>
          <p>
            Kami menyimpan informasi pribadi Anda selama diperlukan untuk tujuan yang dijelaskan 
            dalam kebijakan ini, atau sesuai dengan kewajiban hukum yang berlaku. Data yang tidak 
            lagi diperlukan akan dihapus secara aman.
          </p>
        </div>

        {/* Children's Privacy */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Privasi Anak-Anak</h2>
          <p>
            Layanan kami tidak ditujukan untuk anak-anak di bawah usia 13 tahun. Kami tidak 
            secara sengaja mengumpulkan informasi pribadi dari anak-anak di bawah usia tersebut. 
            Jika Anda adalah orang tua dan mengetahui bahwa anak Anda telah memberikan informasi 
            pribadi kepada kami, silakan hubungi kami.
          </p>
        </div>

        {/* Changes to Policy */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perubahan Kebijakan</h2>
          <p>
            Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan 
            dinotifikasikan melalui situs web kami dan tanggal &ldquo;terakhir diperbarui&rdquo; akan
            direvisi. Kami mendorong Anda untuk meninjau kebijakan ini secara berkala.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 m-0">Hubungi Kami</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan 
            hak-hak Anda, silakan hubungi kami:
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> privacy@pontigramid.com</p>
            <p><strong>Telepon:</strong> +62 21-1234-5678</p>
            <p><strong>Alamat:</strong> Jl. Sudirman No. 123, Jakarta Pusat 10220, Indonesia</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
