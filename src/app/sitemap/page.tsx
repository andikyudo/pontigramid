import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import { Home, FileText, Users, Mail, Scale, Info } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sitemap - PontigramID',
  description: 'Peta situs PontigramID yang memudahkan navigasi dan pencarian halaman yang Anda butuhkan.',
  keywords: 'sitemap, peta situs, navigasi, halaman, pontigramid',
  openGraph: {
    title: 'Sitemap - PontigramID',
    description: 'Peta situs PontigramID yang memudahkan navigasi dan pencarian halaman yang Anda butuhkan.',
    type: 'website',
  },
};

const siteStructure = [
  {
    icon: Home,
    title: 'Halaman Utama',
    links: [
      { name: 'Beranda', href: '/' },
      { name: 'Berita Terbaru', href: '/?latest=true' },
      { name: 'Berita Trending', href: '/?trending=true' }
    ]
  },
  {
    icon: FileText,
    title: 'Kategori Berita',
    links: [
      { name: 'Politik', href: '/?category=politik' },
      { name: 'Ekonomi', href: '/?category=ekonomi' },
      { name: 'Olahraga', href: '/?category=olahraga' },
      { name: 'Teknologi', href: '/?category=teknologi' },
      { name: 'Hiburan', href: '/?category=hiburan' },
      { name: 'Kesehatan', href: '/?category=kesehatan' },
      { name: 'Pendidikan', href: '/?category=pendidikan' },
      { name: 'Lifestyle', href: '/?category=lifestyle' }
    ]
  },
  {
    icon: Users,
    title: 'Tentang Kami',
    links: [
      { name: 'Tentang Kami', href: '/tentang-kami' },
      { name: 'Tim Redaksi', href: '/redaksi' },
      { name: 'Visi & Misi', href: '/visi-misi' }
    ]
  },
  {
    icon: Mail,
    title: 'Kontak & Layanan',
    links: [
      { name: 'Kontak Kami', href: '/kontak' },
      { name: 'Iklan & Kerjasama', href: '/iklan' },
      { name: 'Karir', href: '/karir' },
      { name: 'RSS Feed', href: '/rss' }
    ]
  },
  {
    icon: Scale,
    title: 'Legal & Kebijakan',
    links: [
      { name: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
      { name: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
      { name: 'Disclaimer', href: '/disclaimer' }
    ]
  },
  {
    icon: Info,
    title: 'Informasi Tambahan',
    links: [
      { name: 'Sitemap', href: '/sitemap' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Bantuan', href: '/bantuan' }
    ]
  }
];

export default function Sitemap() {
  return (
    <PageLayout
      title="Sitemap"
      description="Peta situs lengkap PontigramID untuk memudahkan navigasi dan menemukan informasi yang Anda cari."
      breadcrumbs={[
        { label: 'Sitemap' }
      ]}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <div className="text-center">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan semua halaman dan konten di PontigramID dengan mudah melalui peta situs di bawah ini.
          </p>
        </div>

        {/* Site Structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteStructure.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.href}
                        className="text-blue-600 hover:text-blue-700 hover:underline text-sm transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Search Suggestion */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Tidak Menemukan yang Anda Cari?</h2>
          <p className="text-gray-600 mb-4">
            Gunakan fitur pencarian di header atau hubungi tim kami untuk bantuan lebih lanjut.
          </p>
          <Link 
            href="/kontak"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="h-4 w-4 mr-2" />
            Hubungi Kami
          </Link>
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500">
          <p>Sitemap terakhir diperbarui: 7 Juni 2024</p>
        </div>
      </div>
    </PageLayout>
  );
}
