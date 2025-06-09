'use client';


import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Calendar, User, Tag, ArrowLeft, Clock, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SocialShareButtons from '@/components/SocialShareButtons';
import RelatedNews from '@/components/RelatedNews';
import { useNewsArticle } from '@/hooks/useNews';
import { useParams } from 'next/navigation';



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

export default function NewsDetail() {
  const resolvedParams = useParams();
  const slug = resolvedParams.slug as string;

  const { data: news, isLoading, isError } = useNewsArticle(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Memuat artikel...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !news) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Artikel Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-8">Artikel yang Anda cari tidak ditemukan atau telah dihapus.</p>
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pontigram.id';
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
              {news.imageUrl.startsWith('data:') ? (
                // Handle base64 images with regular img tag
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                // Handle regular URLs with Next.js Image
                <Image
                  src={news.imageUrl}
                  alt={news.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              )}
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
                  <div className="flex space-x-2 lg:hidden">
                    {/* Mobile share buttons are handled by SocialShareButtons component */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles Section */}
        <RelatedNews
          category={news.category}
          currentSlug={slug}
          limit={6}
        />
      </main>

      {/* Add bottom padding for mobile share buttons */}
      <div className="lg:hidden h-20"></div>

      <Footer />
    </div>
  );
}


