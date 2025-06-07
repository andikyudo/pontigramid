import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import { Mail, Linkedin, Twitter, Award, Users, BookOpen } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Tim Redaksi - PontigramID',
  description: 'Berkenalan dengan tim redaksi profesional PontigramID yang terdiri dari jurnalis berpengalaman dan ahli di berbagai bidang.',
  keywords: 'tim redaksi pontigramid, jurnalis, editor, penulis, redaktur, tim editorial',
  openGraph: {
    title: 'Tim Redaksi - PontigramID',
    description: 'Berkenalan dengan tim redaksi profesional PontigramID yang terdiri dari jurnalis berpengalaman dan ahli di berbagai bidang.',
    type: 'website',
  },
};

const leadership = [
  {
    name: 'Dr. Ahmad Wijaya',
    position: 'Pemimpin Redaksi',
    bio: 'Jurnalis senior dengan pengalaman 20+ tahun di media nasional. Lulusan Ilmu Komunikasi UI dan meraih gelar doktor dari UGM.',
    email: 'ahmad.wijaya@pontigramid.com',
    linkedin: 'https://linkedin.com/in/ahmadwijaya',
    twitter: 'https://twitter.com/ahmadwijaya',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: 'Sari Indrawati, M.Si',
    position: 'Wakil Pemimpin Redaksi',
    bio: 'Spesialis jurnalisme investigasi dengan fokus pada isu politik dan ekonomi. Berpengalaman 15 tahun di berbagai media terkemuka.',
    email: 'sari.indrawati@pontigramid.com',
    linkedin: 'https://linkedin.com/in/sariindrawati',
    twitter: 'https://twitter.com/sariindrawati',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
  }
];

const editors = [
  {
    name: 'Budi Santoso',
    position: 'Editor Politik',
    specialization: 'Politik & Pemerintahan',
    experience: '12 tahun',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
  },
  {
    name: 'Maya Kusuma',
    position: 'Editor Ekonomi',
    specialization: 'Ekonomi & Bisnis',
    experience: '10 tahun',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face'
  },
  {
    name: 'Rizki Pratama',
    position: 'Editor Teknologi',
    specialization: 'Teknologi & Digital',
    experience: '8 tahun',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face'
  },
  {
    name: 'Dewi Lestari',
    position: 'Editor Olahraga',
    specialization: 'Olahraga & Lifestyle',
    experience: '9 tahun',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face'
  },
  {
    name: 'Andi Firmansyah',
    position: 'Editor Hiburan',
    specialization: 'Hiburan & Budaya',
    experience: '7 tahun',
    image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=300&h=300&fit=crop&crop=face'
  },
  {
    name: 'Dr. Fitri Handayani',
    position: 'Editor Kesehatan',
    specialization: 'Kesehatan & Medis',
    experience: '11 tahun',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face'
  }
];

const achievements = [
  {
    icon: Award,
    title: 'Penghargaan Jurnalistik',
    description: 'Tim kami telah meraih berbagai penghargaan jurnalistik tingkat nasional'
  },
  {
    icon: Users,
    title: 'Tim Berpengalaman',
    description: 'Rata-rata pengalaman tim redaksi kami adalah 10+ tahun di bidang jurnalistik'
  },
  {
    icon: BookOpen,
    title: 'Pendidikan Berkelanjutan',
    description: 'Kami berkomitmen pada pengembangan profesional melalui pelatihan berkala'
  }
];

export default function TimRedaksi() {
  return (
    <PageLayout
      title="Tim Redaksi"
      description="Berkenalan dengan tim redaksi profesional PontigramID yang terdiri dari jurnalis berpengalaman dan ahli di berbagai bidang."
      breadcrumbs={[
        { label: 'Tim Redaksi' }
      ]}
    >
      <div className="space-y-12">
        {/* Introduction */}
        <div className="text-center">
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Tim redaksi PontigramID terdiri dari jurnalis profesional dan berpengalaman yang berkomitmen 
            untuk menyajikan berita berkualitas tinggi dengan standar jurnalistik yang ketat.
          </p>
        </div>

        {/* Leadership Team */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Pimpinan Redaksi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leadership.map((leader, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      className="object-cover rounded-full"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{leader.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{leader.position}</p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{leader.bio}</p>
                    <div className="flex space-x-3">
                      <a href={`mailto:${leader.email}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Mail className="h-4 w-4" />
                      </a>
                      <a href={leader.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Linkedin className="h-4 w-4" />
                      </a>
                      <a href={leader.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Team */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Tim Editor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {editors.map((editor, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={editor.image}
                    alt={editor.name}
                    fill
                    className="object-cover rounded-full"
                    sizes="96px"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{editor.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{editor.position}</p>
                <p className="text-gray-600 text-sm mb-2">{editor.specialization}</p>
                <p className="text-gray-500 text-xs">Pengalaman: {editor.experience}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Pencapaian Tim</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{achievement.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hubungi Redaksi</h2>
          <p className="text-gray-600 mb-6">
            Memiliki tips berita, kritik, atau saran? Tim redaksi kami siap mendengarkan Anda.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <a href="mailto:redaksi@pontigramid.com" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
              <Mail className="h-4 w-4 mr-2" />
              redaksi@pontigramid.com
            </a>
            <span className="hidden sm:block text-gray-400">•</span>
            <span className="text-gray-600">Telepon: +62 21-1234-5678</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
