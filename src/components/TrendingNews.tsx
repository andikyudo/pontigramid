'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp, Calendar, User, Eye } from 'lucide-react';
import { formatDateShort } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { useTrendingNews } from '@/hooks/useNews';
import { TrendingNewsSkeleton } from '@/components/LoadingSkeleton';

interface NewsItem {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  imageUrl?: string;
  createdAt: string;
  slug: string;
  views?: number;
}

const categoryColors: { [key: string]: string } = {
  politik: 'bg-red-100 text-red-800',
  ekonomi: 'bg-green-100 text-green-800',
  olahraga: 'bg-blue-100 text-blue-800',
  teknologi: 'bg-purple-100 text-purple-800',
  hiburan: 'bg-pink-100 text-pink-800',
  kesehatan: 'bg-yellow-100 text-yellow-800',
  pendidikan: 'bg-indigo-100 text-indigo-800',
  umum: 'bg-gray-100 text-gray-800',
  hukum: 'bg-amber-100 text-amber-800'
};

export default function TrendingNews() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Use React Query hook with conditional fetching
  const { data: trendingNews = [], isLoading: loading, isError, error } = useTrendingNews(6);

  const handleImageError = (slug: string) => {
    setImageErrors(prev => ({ ...prev, [slug]: true }));
  };



  return (
    <section ref={ref} className="py-8 sm:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 mr-2 sm:mr-3" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Berita Trending
            </h2>
          </div>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Berita paling populer dan banyak dibaca hari ini
          </p>
          <div className="mt-3 sm:mt-4 w-16 sm:w-24 h-1 bg-red-500 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        {loading ? (
          <TrendingNewsSkeleton />
        ) : isError ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <TrendingUp className="h-16 w-16 mx-auto opacity-50" />
            </div>
            <p className="text-gray-600 text-lg">{error?.message || 'Terjadi kesalahan'}</p>
          </div>
        ) : (
          <>
            {/* Mobile: First 2 news in featured layout */}
            <div className="block sm:hidden mb-6">
              <div className="space-y-4">
                {trendingNews && trendingNews.length > 0 && trendingNews.slice(0, 2).map((news, index) => (
                  <article
                    key={news._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex">
                      {/* Image */}
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <div className="absolute top-1 left-1 z-10">
                          <div className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold flex items-center">
                            <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                            #{index + 1}
                          </div>
                        </div>
                        <Link href={`/berita/${news.slug}`}>
                          {news.imageUrl && !imageErrors[news.slug] ? (
                            news.imageUrl.startsWith('data:') ? (
                              <img
                                src={news.imageUrl}
                                alt={news.title}
                                className="w-full h-full object-cover rounded-l-lg"
                                onError={() => handleImageError(news.slug)}
                                loading="lazy"
                              />
                            ) : (
                              <Image
                                src={news.imageUrl}
                                alt={news.title}
                                fill
                                className="object-cover rounded-l-lg"
                                sizes="96px"
                                onError={() => handleImageError(news.slug)}
                                priority={false}
                              />
                            )
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-l-lg flex items-center justify-center">
                              <div className="text-gray-400">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </Link>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-3">
                        <div className="mb-1">
                          <span className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[news.category] || categoryColors.umum}`}>
                            {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
                          </span>
                        </div>
                        <Link href={`/berita/${news.slug}`}>
                          <h3 className="font-bold text-sm mb-1 line-clamp-2 hover:text-blue-600 transition-colors">
                            {news.title}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{formatDateShort(news.createdAt)}</span>
                          </div>
                          <div className="flex items-center text-red-500 font-medium">
                            <Eye className="w-3 h-3 mr-1" />
                            <span>{news.views?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Remaining news in compact list */}
              {trendingNews && trendingNews.length > 2 && (
                <div className="mt-4 space-y-2">
                  {trendingNews.slice(2).map((news, index) => (
                    <Link key={news._id} href={`/berita/${news.slug}`}>
                      <div className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 flex items-center">
                        <div className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold mr-3 flex items-center">
                          #{index + 3}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-1 mb-1">{news.title}</h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${categoryColors[news.category] || categoryColors.umum} mr-2`}>
                              {news.category}
                            </span>
                            <Eye className="w-3 h-3 mr-1" />
                            <span>{news.views?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: Original grid layout */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {trendingNews && trendingNews.length > 0 && trendingNews.map((news, index) => (
              <article 
                key={news._id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                {/* Trending Badge */}
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      #{index + 1}
                    </div>
                  </div>
                  
                  {/* Image */}
                  <Link href={`/berita/${news.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      {news.imageUrl && !imageErrors[news.slug] ? (
                        news.imageUrl.startsWith('data:') ? (
                          <img
                            src={news.imageUrl}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={() => handleImageError(news.slug)}
                            loading="lazy"
                          />
                        ) : (
                          <Image
                            src={news.imageUrl}
                            alt={news.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={() => handleImageError(news.slug)}
                            priority={index < 2}
                          />
                        )
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <div className="text-gray-400 text-center">
                            <div className="w-16 h-16 mx-auto mb-2 bg-gray-400 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                    </div>
                  </Link>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Category */}
                  <div className="mb-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColors[news.category] || categoryColors.umum}`}>
                      {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
                    </span>
                  </div>

                  {/* Title */}
                  <Link href={`/berita/${news.slug}`}>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer group-hover:text-blue-600">
                      {news.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {news.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{formatDateShort(news.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        <span>{news.author}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-red-500 font-medium">
                      <Eye className="w-3 h-3 mr-1" />
                      <span>{news.views?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
            </div>
          </>
        )}

        {/* View All Button */}
        {!loading && !error && (
          <div className="text-center mt-10">
            <Link
              href="/?trending=true"
              className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Lihat Semua Berita Trending
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
