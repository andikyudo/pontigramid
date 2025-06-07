import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import { Briefcase, Users, Heart, Zap, Mail, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Karir - PontigramID',
  description: 'Bergabunglah dengan tim PontigramID dan kembangkan karir Anda di industri media digital. Berbagai posisi menarik menanti Anda.',
  keywords: 'karir pontigramid, lowongan kerja, jurnalis, editor, developer, media digital',
  openGraph: {
    title: 'Karir - PontigramID',
    description: 'Bergabunglah dengan tim PontigramID dan kembangkan karir Anda di industri media digital. Berbagai posisi menarik menanti Anda.',
    type: 'website',
  },
};

const benefits = [
  {
    icon: Heart,
    title: 'Work-Life Balance',
    description: 'Kami percaya pada keseimbangan antara kehidupan kerja dan pribadi yang sehat.'
  },
  {
    icon: Zap,
    title: 'Pengembangan Karir',
    description: 'Program pelatihan berkelanjutan dan jalur karir yang jelas untuk setiap karyawan.'
  },
  {
    icon: Users,
    title: 'Tim yang Solid',
    description: 'Bekerja dengan tim profesional yang saling mendukung dan menginspirasi.'
  },
  {
    icon: Briefcase,
    title: 'Kompensasi Kompetitif',
    description: 'Gaji yang kompetitif dengan berbagai tunjangan dan benefit menarik.'
  }
];

const openPositions = [
  {
    title: 'Senior Journalist',
    department: 'Editorial',
    type: 'Full-time',
    location: 'Jakarta',
    description: 'Mencari jurnalis senior dengan pengalaman 5+ tahun untuk meliput berita politik dan ekonomi.',
    requirements: [
      'S1 Jurnalistik/Komunikasi atau bidang terkait',
      'Pengalaman minimal 5 tahun di media massa',
      'Kemampuan menulis yang excellent',
      'Jaringan narasumber yang luas'
    ]
  },
  {
    title: 'Frontend Developer',
    department: 'Technology',
    type: 'Full-time',
    location: 'Jakarta',
    description: 'Mengembangkan dan memelihara platform digital PontigramID dengan teknologi terdepan.',
    requirements: [
      'S1 Teknik Informatika atau bidang terkait',
      'Pengalaman 3+ tahun dengan React/Next.js',
      'Familiar dengan TypeScript dan Tailwind CSS',
      'Pemahaman tentang SEO dan web performance'
    ]
  },
  {
    title: 'Content Creator',
    department: 'Digital Marketing',
    type: 'Full-time',
    location: 'Jakarta',
    description: 'Membuat konten kreatif untuk berbagai platform digital dan social media.',
    requirements: [
      'S1 DKV, Marketing, atau bidang terkait',
      'Pengalaman 2+ tahun dalam content creation',
      'Mahir menggunakan tools design dan video editing',
      'Pemahaman tentang social media trends'
    ]
  },
  {
    title: 'Data Analyst',
    department: 'Business Intelligence',
    type: 'Full-time',
    location: 'Jakarta',
    description: 'Menganalisis data pembaca dan performa konten untuk optimasi strategi editorial.',
    requirements: [
      'S1 Statistik, Matematika, atau bidang terkait',
      'Pengalaman dengan SQL, Python, atau R',
      'Familiar dengan Google Analytics dan tools BI',
      'Kemampuan visualisasi data yang baik'
    ]
  }
];

export default function Karir() {
  return (
    <PageLayout
      title="Karir"
      description="Bergabunglah dengan tim PontigramID dan jadilah bagian dari revolusi media digital Indonesia. Kembangkan karir Anda bersama kami."
      breadcrumbs={[
        { label: 'Karir' }
      ]}
    >
      <div className="space-y-12">
        {/* Introduction */}
        <div className="text-center">
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8">
            Di PontigramID, kami percaya bahwa karyawan adalah aset terbesar. Bergabunglah dengan 
            tim yang passionate dalam menyajikan informasi berkualitas untuk Indonesia.
          </p>
        </div>

        {/* Why Join Us */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Mengapa Bergabung dengan Kami?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Company Culture */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Budaya Kerja Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Inovasi</h3>
              <p className="text-sm opacity-90">
                Kami mendorong kreativitas dan inovasi dalam setiap aspek pekerjaan.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Kolaborasi</h3>
              <p className="text-sm opacity-90">
                Kerja tim yang solid adalah kunci kesuksesan kami.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Integritas</h3>
              <p className="text-sm opacity-90">
                Kami menjunjung tinggi nilai-nilai etika dan profesionalisme.
              </p>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Posisi yang Tersedia</h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{position.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {position.department}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {position.type}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {position.location}
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Lamar Sekarang
                  </button>
                </div>
                
                <p className="text-gray-700 mb-4">{position.description}</p>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Persyaratan:</h4>
                  <ul className="space-y-1">
                    {position.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-start text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Package */}
        <div className="bg-green-50 p-8 rounded-lg border border-green-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Paket Benefit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Kesehatan</h3>
              <p className="text-sm text-gray-600">Asuransi kesehatan untuk karyawan dan keluarga</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Cuti</h3>
              <p className="text-sm text-gray-600">Cuti tahunan, sakit, dan cuti khusus lainnya</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Pelatihan</h3>
              <p className="text-sm text-gray-600">Program pelatihan dan sertifikasi profesional</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Bonus</h3>
              <p className="text-sm text-gray-600">Bonus kinerja dan THR sesuai pencapaian</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Fleksibilitas</h3>
              <p className="text-sm text-gray-600">Jam kerja fleksibel dan work from home</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Fasilitas</h3>
              <p className="text-sm text-gray-600">Kantor modern dengan fasilitas lengkap</p>
            </div>
          </div>
        </div>

        {/* Application Process */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Proses Rekrutmen</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Aplikasi</h3>
              <p className="text-sm text-gray-600">Kirim CV dan portfolio Anda</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Screening</h3>
              <p className="text-sm text-gray-600">Review dokumen dan tes awal</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Interview</h3>
              <p className="text-sm text-gray-600">Wawancara dengan tim HR dan user</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Onboarding</h3>
              <p className="text-sm text-gray-600">Orientasi dan mulai bekerja</p>
            </div>
          </div>
        </div>

        {/* Contact HR */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tidak Menemukan Posisi yang Sesuai?</h2>
          <p className="text-gray-600 mb-6">
            Kirim CV Anda kepada kami. Kami akan menghubungi Anda jika ada posisi yang sesuai dengan profil Anda.
          </p>
          <a 
            href="mailto:hr@pontigramid.com" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="h-5 w-5 mr-2" />
            hr@pontigramid.com
          </a>
        </div>
      </div>
    </PageLayout>
  );
}
