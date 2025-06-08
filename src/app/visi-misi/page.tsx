import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import { Eye, Target, Compass, Users, Globe, Shield, Heart, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Visi & Misi - PontigramID',
  description: 'Mengenal visi, misi, dan tujuan PontigramID dalam menyajikan informasi berkualitas untuk kemajuan bangsa Indonesia.',
  keywords: 'visi misi pontigramid, tujuan, filosofi, komitmen, portal berita indonesia',
  openGraph: {
    title: 'Visi & Misi - PontigramID',
    description: 'Mengenal visi, misi, dan tujuan PontigramID dalam menyajikan informasi berkualitas untuk kemajuan bangsa Indonesia.',
    type: 'website',
  },
};

const missionPoints = [
  {
    icon: Shield,
    title: 'Menyajikan Berita Akurat',
    description: 'Memberikan informasi yang faktual, berimbang, dan dapat dipertanggungjawabkan kepada masyarakat.'
  },
  {
    icon: Users,
    title: 'Melayani Kepentingan Publik',
    description: 'Mengutamakan kepentingan masyarakat dalam setiap pemberitaan dan tidak memihak kepada golongan tertentu.'
  },
  {
    icon: Globe,
    title: 'Memperkuat Persatuan',
    description: 'Berkontribusi dalam memperkuat persatuan dan kesatuan bangsa melalui informasi yang mendidik.'
  },
  {
    icon: Heart,
    title: 'Menginspirasi Perubahan',
    description: 'Menyajikan konten yang menginspirasi masyarakat untuk berpartisipasi dalam pembangunan bangsa.'
  }
];

const objectives = [
  {
    title: 'Jangka Pendek (2024-2025)',
    goals: [
      'Meningkatkan kualitas konten dengan standar jurnalistik internasional',
      'Memperluas jangkauan pembaca di seluruh Indonesia',
      'Mengembangkan platform digital yang lebih interaktif',
      'Membangun kemitraan strategis dengan media lokal dan nasional'
    ]
  },
  {
    title: 'Jangka Menengah (2025-2027)',
    goals: [
      'Menjadi portal berita terdepan di Indonesia',
      'Mengembangkan konten multimedia yang inovatif',
      'Membangun pusat pelatihan jurnalistik digital',
      'Ekspansi ke platform media sosial dan podcast'
    ]
  },
  {
    title: 'Jangka Panjang (2027-2030)',
    goals: [
      'Menjadi rujukan utama informasi di Asia Tenggara',
      'Mengembangkan teknologi AI untuk personalisasi konten',
      'Membangun ekosistem media digital yang berkelanjutan',
      'Berkontribusi dalam literasi digital masyarakat Indonesia'
    ]
  }
];

const principles = [
  {
    icon: Compass,
    title: 'Independensi',
    description: 'Kami menjaga independensi editorial dan tidak terpengaruh oleh kepentingan politik atau komersial tertentu.'
  },
  {
    icon: Award,
    title: 'Profesionalisme',
    description: 'Kami menjalankan praktik jurnalistik dengan standar profesional tertinggi dan etika yang ketat.'
  },
  {
    icon: Users,
    title: 'Transparansi',
    description: 'Kami berkomitmen untuk transparan dalam proses editorial dan sumber informasi yang kami gunakan.'
  },
  {
    icon: Heart,
    title: 'Empati',
    description: 'Kami memahami kebutuhan dan kepentingan masyarakat dalam mengakses informasi yang berkualitas.'
  }
];

export default function VisiMisi() {
  return (
    <PageLayout
      title="Visi & Misi"
      description="Mengenal visi, misi, dan tujuan PontigramID dalam menyajikan informasi berkualitas untuk kemajuan bangsa Indonesia."
      breadcrumbs={[
        { label: 'Visi & Misi' }
      ]}
    >
      <div className="space-y-12">
        {/* Vision Section */}
        <div className="text-center">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Visi Kami</h2>
          <div className="bg-blue-50 p-8 rounded-lg border border-blue-200 max-w-4xl mx-auto">
            <p className="text-2xl font-semibold text-gray-800 leading-relaxed">
              "              &ldquo;Menjadi portal berita digital terpercaya dan terdepan di Indonesia yang memberikan
              kontribusi positif bagi kemajuan bangsa melalui penyebaran informasi yang akurat,
              edukatif, dan inspiratif.&rdquo;"
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div>
          <div className="text-center mb-8">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Misi Kami</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Untuk mewujudkan visi tersebut, kami berkomitmen menjalankan misi-misi berikut:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {missionPoints.map((mission, index) => {
              const IconComponent = mission.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{mission.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{mission.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Objectives Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tujuan Strategis</h2>
          <div className="space-y-8">
            {objectives.map((objective, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{objective.title}</h3>
                <ul className="space-y-3">
                  {objective.goals.map((goal, goalIndex) => (
                    <li key={goalIndex} className="flex items-start">
                      <div className="bg-blue-600 w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Principles Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Prinsip Kerja</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((principle, index) => {
              const IconComponent = principle.icon;
              return (
                <div key={index} className="text-center p-6">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{principle.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{principle.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commitment Statement */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Komitmen Kami untuk Indonesia</h2>
          <p className="text-lg leading-relaxed max-w-4xl mx-auto">
            PontigramID berkomitmen untuk terus berinovasi dan berkembang dalam menyajikan informasi 
            yang tidak hanya menghibur, tetapi juga mendidik dan menginspirasi masyarakat Indonesia. 
            Kami percaya bahwa media yang berkualitas adalah fondasi penting bagi demokrasi dan 
            kemajuan bangsa.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
