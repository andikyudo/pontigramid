import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import { Users, Target, Award, Globe, Heart, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tentang Kami - PontigramID',
  description: 'Mengenal lebih dekat PontigramID, portal berita terpercaya yang berkomitmen menyajikan informasi akurat dan terkini untuk masyarakat Indonesia.',
  keywords: 'tentang pontigramid, profil perusahaan, sejarah, visi misi, portal berita indonesia',
  openGraph: {
    title: 'Tentang Kami - PontigramID',
    description: 'Mengenal lebih dekat PontigramID, portal berita terpercaya yang berkomitmen menyajikan informasi akurat dan terkini untuk masyarakat Indonesia.',
    type: 'website',
  },
};

const values = [
  {
    icon: Shield,
    title: 'Integritas',
    description: 'Kami berkomitmen untuk menyajikan berita yang akurat, berimbang, dan dapat dipertanggungjawabkan.'
  },
  {
    icon: Heart,
    title: 'Kepedulian',
    description: 'Kami peduli terhadap kepentingan masyarakat dan berusaha memberikan informasi yang bermanfaat.'
  },
  {
    icon: Globe,
    title: 'Profesionalisme',
    description: 'Kami menjunjung tinggi standar jurnalistik profesional dalam setiap pemberitaan.'
  },
  {
    icon: Award,
    title: 'Kualitas',
    description: 'Kami selalu berusaha memberikan konten berkualitas tinggi yang informatif dan mudah dipahami.'
  }
];

const milestones = [
  {
    year: '2020',
    title: 'Pendirian PontigramID',
    description: 'PontigramID didirikan dengan visi menjadi portal berita terpercaya di Indonesia.'
  },
  {
    year: '2021',
    title: 'Ekspansi Konten',
    description: 'Memperluas cakupan berita ke berbagai kategori: politik, ekonomi, olahraga, teknologi, dan hiburan.'
  },
  {
    year: '2022',
    title: 'Platform Digital',
    description: 'Meluncurkan platform digital yang responsif dan user-friendly untuk semua perangkat.'
  },
  {
    year: '2023',
    title: 'Tim Redaksi Profesional',
    description: 'Membangun tim redaksi yang terdiri dari jurnalis berpengalaman dan profesional.'
  },
  {
    year: '2024',
    title: 'Inovasi Teknologi',
    description: 'Mengimplementasikan teknologi AI untuk meningkatkan kualitas dan kecepatan pemberitaan.'
  }
];

export default function TentangKami() {
  return (
    <PageLayout
      title="Tentang Kami"
      description="Mengenal lebih dekat PontigramID, portal berita terpercaya yang berkomitmen menyajikan informasi akurat dan terkini untuk masyarakat Indonesia."
      breadcrumbs={[
        { label: 'Tentang Kami' }
      ]}
    >
      <div className="prose prose-lg max-w-none">
        {/* Introduction */}
        <div className="mb-12">
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            PontigramID adalah portal berita digital yang berkomitmen untuk menyajikan informasi terkini, 
            akurat, dan terpercaya kepada masyarakat Indonesia. Kami hadir sebagai jembatan informasi 
            yang menghubungkan berbagai peristiwa penting dengan pembaca di seluruh nusantara.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            Sejak didirikan, kami telah konsisten dalam menjaga kualitas jurnalistik dan integritas 
            dalam setiap pemberitaan. Tim redaksi kami terdiri dari jurnalis berpengalaman yang 
            memahami dinamika media digital dan kebutuhan informasi masyarakat modern.
          </p>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <Target className="h-6 w-6 mr-3 text-blue-600" />
            Nilai-Nilai Kami
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <Users className="h-6 w-6 mr-3 text-blue-600" />
            Perjalanan Kami
          </h2>
          
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm mr-6 flex-shrink-0">
                  {milestone.year}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Komitmen Kami</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            PontigramID berkomitmen untuk terus berinovasi dalam menyajikan berita yang tidak hanya 
            informatif, tetapi juga edukatif dan inspiratif. Kami percaya bahwa informasi yang 
            berkualitas adalah hak setiap warga negara.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Dengan dukungan teknologi terdepan dan tim redaksi yang profesional, kami akan terus 
            menjadi sumber informasi terpercaya yang dapat diandalkan oleh masyarakat Indonesia 
            dalam menghadapi berbagai tantangan dan peluang di era digital.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
