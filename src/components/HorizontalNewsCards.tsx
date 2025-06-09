'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';
import { formatDateShort } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

interface NewsItem {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  imageUrl?: string;
  createdAt: string;
  slug: string;
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

export default function HorizontalNewsCards() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      fetchNews();
    }
  }, [inView]);

  const handleImageError = (slug: string) => {
    setImageErrors(prev => ({ ...prev, [slug]: true }));
  };

  const fetchNews = async (page = 1) => {
    try {
      const response = await fetch(`/api/news?published=true&limit=10&page=${page}&sort=createdAt`);
      const data = await response.json();
      
      if (data.success && data.news && Array.isArray(data.news)) {
        if (page === 1) {
          setNews(data.news);
        } else {
          setNews(prev => [...prev, ...data.news]);
        }
        setHasMore(data.pagination?.hasNext || false);
        setError('');
      } else {
        setError('Gagal memuat berita');
        if (page === 1) {
          setNews([]);
        }
      }
    } catch (error) {
      console.error('Error fetching horizontal news:', error);
      setError('Terjadi kesalahan saat memuat berita');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchNews(nextPage);
  };

  const LoadingSkeleton = () => (
    <>
      {/* Mobile Skeleton */}
      <div className="block md:hidden">
        <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-72 animate-pulse">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-32 bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <section ref={ref} className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Berita Pilihan
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Kumpulan berita pilihan yang wajib Anda baca hari ini
          </p>
          <div className="mt-3 sm:mt-4 w-16 sm:w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ChevronRight className="h-16 w-16 mx-auto opacity-50" />
            </div>
            <p className="text-gray-600 text-lg">{error}</p>
          </div>
        ) : (
          <>
            {/* Mobile: Horizontal Scroll */}
            <div className="block md:hidden">
              <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                {news.map((item) => (
                  <Link
                    key={item._id}
                    href={`/berita/${item.slug}`}
                    className="flex-shrink-0 w-72 group"
                  >
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      {/* Image */}
                      <div className="relative h-32 overflow-hidden">
                        {item.imageUrl && !imageErrors[item.slug] ? (
                          item.imageUrl.startsWith('data:') ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={() => handleImageError(item.slug)}
                              loading="lazy"
                            />
                          ) : (
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="288px"
                              onError={() => handleImageError(item.slug)}
                            />
                          )
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <div className="text-gray-400">
                              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3">
                        {/* Category */}
                        <div className="mb-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColors[item.category] || categoryColors.umum}`}>
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>

                        {/* Date */}
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{formatDateShort(item.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Scroll indicator */}
              <div className="text-center mt-2">
                <p className="text-xs text-gray-400">← Geser untuk melihat berita lainnya →</p>
              </div>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {news.slice(0, 8).map((item) => (
                <Link
                  key={item._id}
                  href={`/berita/${item.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden">
                      {item.imageUrl && !imageErrors[item.slug] ? (
                        item.imageUrl.startsWith('data:') ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={() => handleImageError(item.slug)}
                            loading="lazy"
                          />
                        ) : (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, 25vw"
                            onError={() => handleImageError(item.slug)}
                          />
                        )
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <div className="text-gray-400">
                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Category */}
                      <div className="mb-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColors[item.category] || categoryColors.umum}`}>
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>

                      {/* Date */}
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDateShort(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button (Desktop only) */}
            {hasMore && (
              <div className="hidden md:block text-center mt-8">
                <button
                  onClick={loadMore}
                  className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-300"
                >
                  <ChevronRight className="w-5 h-5 mr-2" />
                  Muat Lebih Banyak
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
