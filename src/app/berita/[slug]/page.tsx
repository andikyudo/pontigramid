import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Calendar, User, Tag, ArrowLeft, Clock } from 'lucide-react';
// import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SocialShareButtons from '@/components/SocialShareButtons';

interface NewsDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

async function getNews(slug: string): Promise<NewsItem | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/news/slug/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
}

const categoryColors: { [key: string]: string } = {
  politik: 'bg-red-100 text-red-800',
  ekonomi: 'bg-green-100 text-green-800',
  olahraga: 'bg-blue-100 text-blue-800',
  teknologi: 'bg-purple-100 text-purple-800',
  hiburan: 'bg-pink-100 text-pink-800',
  kesehatan: 'bg-yellow-100 text-yellow-800',
  pendidikan: 'bg-indigo-100 text-indigo-800',
  umum: 'bg-gray-100 text-gray-800'
};

export default async function NewsDetail({ params }: NewsDetailProps) {
  const { slug } = await params;
  const news = await getNews(slug);

  if (!news) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const currentUrl = `${baseUrl}/berita/${slug}`;
  const readingTime = Math.ceil(news.content.split(' ').length / 200);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentCategory={news.category} />

      {/* Social Share Buttons */}
      <SocialShareButtons
        url={currentUrl}
        title={news.title}
        description={news.excerpt}
      />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Kembali ke Beranda</span>
          </Link>
        </div>

        <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Featured Image */}
          {news.imageUrl && (
            <div className="relative h-64 sm:h-80 md:h-96">
              <Image
                src={news.imageUrl}
                alt={news.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* Category Badge */}
            <div className="mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryColors[news.category] || categoryColors.umum}`}>
                <Tag className="w-3 h-3 mr-1" />
                {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {news.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {news.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>Oleh <strong className="text-gray-700">{news.author}</strong></span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(news.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{readingTime} menit baca</span>
              </div>
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />

            {/* Article Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  Terakhir diperbarui: {formatDate(news.updatedAt)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Bagikan:</span>
                  <div className="flex space-x-2 lg:hidden">
                    {/* Mobile share buttons are handled by SocialShareButtons component */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles Section */}
        <section className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
            Berita Terkait
          </h2>
          <div className="text-center py-8 text-gray-500">
            <p>Fitur berita terkait akan segera hadir...</p>
          </div>
        </section>
      </main>

      {/* Add bottom padding for mobile share buttons */}
      <div className="lg:hidden h-20"></div>

      <Footer />
    </div>
  );
}

export async function generateMetadata({ params }: NewsDetailProps) {
  const { slug } = await params;
  const news = await getNews(slug);

  if (!news) {
    return {
      title: 'Berita Tidak Ditemukan - PontigramID',
      description: 'Halaman berita yang Anda cari tidak ditemukan.'
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const currentUrl = `${baseUrl}/berita/${slug}`;

  return {
    title: `${news.title} - PontigramID`,
    description: news.excerpt,
    keywords: `${news.category}, berita, ${news.title}`,
    authors: [{ name: news.author }],
    openGraph: {
      title: news.title,
      description: news.excerpt,
      url: currentUrl,
      siteName: 'PontigramID',
      images: news.imageUrl ? [
        {
          url: news.imageUrl,
          width: 1200,
          height: 630,
          alt: news.title,
        }
      ] : [],
      locale: 'id_ID',
      type: 'article',
      publishedTime: news.createdAt,
      modifiedTime: news.updatedAt,
      section: news.category,
      authors: [news.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description: news.excerpt,
      images: news.imageUrl ? [news.imageUrl] : [],
      creator: '@pontigramid',
    },
    alternates: {
      canonical: currentUrl,
    },
  };
}
