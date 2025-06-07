import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import { Rss, Download, Copy, ExternalLink, Smartphone, Globe, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'RSS Feed - PontigramID',
  description: 'Berlangganan RSS feed PontigramID untuk mendapatkan update berita terbaru langsung di aplikasi pembaca RSS favorit Anda.',
  keywords: 'rss feed, berlangganan, update berita, xml, feed reader, pontigramid',
  openGraph: {
    title: 'RSS Feed - PontigramID',
    description: 'Berlangganan RSS feed PontigramID untuk mendapatkan update berita terbaru langsung di aplikasi pembaca RSS favorit Anda.',
    type: 'website',
  },
};

const rssFeeds = [
  {
    title: 'Semua Berita',
    description: 'Feed lengkap semua berita terbaru dari PontigramID',
    url: 'https://pontigramid.com/rss/all.xml',
    icon: Globe
  },
  {
    title: 'Berita Politik',
    description: 'Update terbaru seputar politik dan pemerintahan',
    url: 'https://pontigramid.com/rss/politik.xml',
    icon: BookOpen
  },
  {
    title: 'Berita Ekonomi',
    description: 'Informasi ekonomi, bisnis, dan keuangan',
    url: 'https://pontigramid.com/rss/ekonomi.xml',
    icon: BookOpen
  },
  {
    title: 'Berita Teknologi',
    description: 'Perkembangan teknologi dan digital terkini',
    url: 'https://pontigramid.com/rss/teknologi.xml',
    icon: BookOpen
  },
  {
    title: 'Berita Olahraga',
    description: 'Update hasil pertandingan dan berita olahraga',
    url: 'https://pontigramid.com/rss/olahraga.xml',
    icon: BookOpen
  }
];

const rssReaders = [
  {
    name: 'Feedly',
    description: 'RSS reader populer dengan interface yang clean',
    url: 'https://feedly.com',
    platform: 'Web, iOS, Android'
  },
  {
    name: 'Inoreader',
    description: 'RSS reader dengan fitur lengkap dan powerful',
    url: 'https://inoreader.com',
    platform: 'Web, iOS, Android'
  },
  {
    name: 'NewsBlur',
    description: 'RSS reader dengan fitur social dan filtering',
    url: 'https://newsblur.com',
    platform: 'Web, iOS, Android'
  },
  {
    name: 'The Old Reader',
    description: 'RSS reader sederhana dengan tampilan klasik',
    url: 'https://theoldreader.com',
    platform: 'Web'
  }
];

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export default function RSS() {
  return (
    <PageLayout
      title="RSS Feed"
      description="Berlangganan RSS feed PontigramID untuk mendapatkan update berita terbaru langsung di aplikasi pembaca RSS favorit Anda."
      breadcrumbs={[
        { label: 'RSS Feed' }
      ]}
    >
      <div className="space-y-12">
        {/* Introduction */}
        <div className="text-center">
          <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Rss className="h-10 w-10 text-orange-600" />
          </div>
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Tetap update dengan berita terbaru dari PontigramID melalui RSS feed. 
            Berlangganan sekarang dan dapatkan notifikasi langsung di aplikasi RSS reader favorit Anda.
          </p>
        </div>

        {/* What is RSS */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Apa itu RSS?</h2>
          <p className="text-gray-700 mb-4">
            RSS (Really Simple Syndication) adalah format yang memungkinkan Anda berlangganan 
            update konten dari website favorit tanpa harus mengunjungi situs tersebut secara manual. 
            Dengan RSS, Anda akan mendapatkan notifikasi otomatis setiap ada artikel baru.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <Smartphone className="h-4 w-4 text-blue-600 mr-2" />
              <span>Akses di semua perangkat</span>
            </div>
            <div className="flex items-center">
              <Download className="h-4 w-4 text-blue-600 mr-2" />
              <span>Update otomatis</span>
            </div>
            <div className="flex items-center">
              <Globe className="h-4 w-4 text-blue-600 mr-2" />
              <span>Tanpa iklan</span>
            </div>
          </div>
        </div>

        {/* RSS Feeds */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Feed yang Tersedia</h2>
          <div className="space-y-4">
            {rssFeeds.map((feed, index) => {
              const IconComponent = feed.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <IconComponent className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{feed.title}</h3>
                        <p className="text-gray-600 text-sm">{feed.description}</p>
                        <p className="text-gray-500 text-xs mt-1 font-mono">{feed.url}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(feed.url)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy URL"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <a
                        href={feed.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Open Feed"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How to Subscribe */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Cara Berlangganan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pilih RSS Reader</h3>
              <p className="text-sm text-gray-600">
                Download aplikasi RSS reader atau gunakan layanan web RSS reader
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Copy URL Feed</h3>
              <p className="text-sm text-gray-600">
                Salin URL feed yang ingin Anda langgani dari daftar di atas
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tambahkan Feed</h3>
              <p className="text-sm text-gray-600">
                Paste URL di aplikasi RSS reader dan mulai menerima update
              </p>
            </div>
          </div>
        </div>

        {/* Recommended RSS Readers */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">RSS Reader Rekomendasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rssReaders.map((reader, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{reader.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{reader.description}</p>
                    <p className="text-gray-500 text-xs">Platform: {reader.platform}</p>
                  </div>
                  <a
                    href={reader.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alternative Options */}
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Alternatif Lain</h2>
          <p className="text-gray-700 mb-4">
            Selain RSS, Anda juga bisa mendapatkan update berita PontigramID melalui:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <h3 className="font-medium text-gray-900 mb-1">Newsletter Email</h3>
              <p className="text-sm text-gray-600">Berlangganan newsletter mingguan kami</p>
            </div>
            <div className="text-center">
              <h3 className="font-medium text-gray-900 mb-1">Media Sosial</h3>
              <p className="text-sm text-gray-600">Follow akun resmi di Facebook, Twitter, Instagram</p>
            </div>
            <div className="text-center">
              <h3 className="font-medium text-gray-900 mb-1">Push Notification</h3>
              <p className="text-sm text-gray-600">Aktifkan notifikasi browser untuk update real-time</p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Butuh Bantuan?</h2>
          <p className="text-gray-600 mb-6">
            Jika Anda mengalami kesulitan dalam berlangganan RSS feed, jangan ragu untuk menghubungi tim support kami.
          </p>
          <a
            href="/kontak"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Hubungi Support
          </a>
        </div>
      </div>
    </PageLayout>
  );
}
