'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import { Mail, Linkedin, Twitter, Award, Users, BookOpen, Phone, Facebook, Instagram } from 'lucide-react';
import Image from 'next/image';

interface TeamMember {
  _id: string;
  name: string;
  position: string;
  bio: string;
  photo?: string;
  email?: string;
  phone?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function TeamRedaksi() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/team');
      const data = await response.json();

      if (data.success) {
        setTeamMembers(data.teamMembers);
      } else {
        console.error('Failed to fetch team members:', data.error);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return Facebook;
      case 'twitter': return Twitter;
      case 'instagram': return Instagram;
      case 'linkedin': return Linkedin;
      default: return null;
    }
  };

  if (loading) {
    return (
      <PageLayout
        title="Tim Redaksi"
        description="Berkenalan dengan tim redaksi profesional Pontigram yang terdiri dari jurnalis berpengalaman dan ahli di berbagai bidang."
        breadcrumbs={[{ label: 'Tim Redaksi' }]}
      >
        <div className="space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data tim redaksi...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

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

  return (
    <PageLayout
      title="Tim Redaksi"
      description="Berkenalan dengan tim redaksi profesional Pontigram yang terdiri dari jurnalis berpengalaman dan ahli di berbagai bidang."
      breadcrumbs={[
        { label: 'Tim Redaksi' }
      ]}
    >
      <div className="space-y-12">
        {/* Introduction */}
        <div className="text-center">
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Tim redaksi Pontigram terdiri dari jurnalis profesional dan berpengalaman yang berkomitmen
            untuk menyajikan berita berkualitas tinggi dengan standar jurnalistik yang ketat.
          </p>
        </div>

        {/* Team Members */}
        {teamMembers.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Tim Redaksi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          fill
                          className="object-cover rounded-full"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                          <Users className="h-12 w-12 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>

                    {/* Contact & Social Media */}
                    <div className="flex justify-center space-x-3 mb-4">
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="text-gray-400 hover:text-blue-600 transition-colors" title="Email">
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                      {member.phone && (
                        <a href={`tel:${member.phone}`} className="text-gray-400 hover:text-green-600 transition-colors" title="Telepon">
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                      {member.socialMedia && Object.entries(member.socialMedia).map(([platform, url]) => {
                        if (!url) return null;
                        const IconComponent = getSocialIcon(platform);
                        if (!IconComponent) return null;

                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                          >
                            <IconComponent className="h-4 w-4" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Tim redaksi sedang dalam proses pembentukan</p>
          </div>
        )}

        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Pencapaian Tim</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Penghargaan Jurnalistik</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Tim kami telah meraih berbagai penghargaan jurnalistik tingkat nasional</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tim Berpengalaman</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Rata-rata pengalaman tim redaksi kami adalah 10+ tahun di bidang jurnalistik</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pendidikan Berkelanjutan</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Kami berkomitmen pada pengembangan profesional melalui pelatihan berkala</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hubungi Redaksi</h2>
          <p className="text-gray-600 mb-6">
            Memiliki tips berita, kritik, atau saran? Tim redaksi kami siap mendengarkan Anda.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <a href="mailto:redaksi@pontigram.com" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
              <Mail className="h-4 w-4 mr-2" />
              redaksi@pontigram.com
            </a>
            <span className="hidden sm:block text-gray-400">•</span>
            <span className="text-gray-600">Telepon: +62 21-1234-5678</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default function TimRedaksi() {
  return <TeamRedaksi />;
}
