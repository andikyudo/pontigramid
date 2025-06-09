'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { formatDateShort } from '@/lib/utils';
import { useRelatedNews } from '@/hooks/useNews';
import { NewsCardSkeleton } from '@/components/LoadingSkeleton';

interface RelatedNewsProps {
  category: string;
  currentSlug: string;
  limit?: number;
}

export default function RelatedNews({ category, currentSlug, limit = 6 }: RelatedNewsProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  const { data: relatedNews = [], isLoading, isError, error } = useRelatedNews(category, currentSlug, limit);

  const handleImageError = (slug: string) => {
    setImageErrors(prev => ({ ...prev, [slug]: true }));
  };

  const getReadingTime = (content: string) => {
    return Math.ceil(content.split(' ').length / 200);
  };

  if (isLoading) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Berita Terkait
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <NewsCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Berita Terkait
        </h2>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {error?.message || 'Gagal memuat berita terkait'}
          </p>
        </div>
      </section>
    );
  }

  if (relatedNews.length === 0) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Berita Terkait
        </h2>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <Calendar className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-500">
            Belum ada berita terkait dalam kategori {category}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Berita Terkait
        </h2>
        <Link
          href={`/?category=${category}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
        >
          Lihat Semua
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedNews.map((news) => (
          <article key={news._id} className="group">
            <Link href={`/berita/${news.slug}`} className="block">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:border-blue-300">
                {/* Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {news.imageUrl && !imageErrors[news.slug] ? (
                    news.imageUrl.startsWith('data:') ? (
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => handleImageError(news.slug)}
                      />
                    ) : (
                      <Image
                        src={news.imageUrl}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={() => handleImageError(news.slug)}
                      />
                    )
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {news.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {news.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{formatDateShort(news.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{getReadingTime(news.content)} min</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* Mobile: List layout */}
      <div className="md:hidden space-y-4">
        {relatedNews.slice(0, 4).map((news) => (
          <article key={news._id} className="group">
            <Link href={`/berita/${news.slug}`} className="block">
              <div className="flex space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 group-hover:border-blue-300">
                {/* Image */}
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {news.imageUrl && !imageErrors[news.slug] ? (
                    news.imageUrl.startsWith('data:') ? (
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(news.slug)}
                      />
                    ) : (
                      <Image
                        src={news.imageUrl}
                        alt={news.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                        onError={() => handleImageError(news.slug)}
                      />
                    )
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-sm group-hover:text-blue-600 transition-colors">
                    {news.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{formatDateShort(news.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{getReadingTime(news.content)} min</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* Show more button for mobile if there are more articles */}
      {relatedNews.length > 4 && (
        <div className="md:hidden mt-6 text-center">
          <Link
            href={`/?category=${category}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Lihat {relatedNews.length - 4} Berita Lainnya
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      )}
    </section>
  );
}
