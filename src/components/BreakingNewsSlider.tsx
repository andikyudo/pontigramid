'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Calendar, Tag, Loader2 } from 'lucide-react';
import { formatDateShort } from '@/lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface NewsItem {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  imageUrl?: string;
  isBreakingNews?: boolean;
  createdAt: string;
  slug: string;
}

const categoryColors: { [key: string]: string } = {
  politik: 'bg-red-500 text-white',
  ekonomi: 'bg-green-500 text-white',
  olahraga: 'bg-blue-500 text-white',
  teknologi: 'bg-purple-500 text-white',
  hiburan: 'bg-pink-500 text-white',
  kesehatan: 'bg-yellow-500 text-black',
  pendidikan: 'bg-indigo-500 text-white',
  umum: 'bg-gray-500 text-white'
};

export default function BreakingNewsSlider() {
  const [headlines, setHeadlines] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHeadlines();
  }, []);

  const fetchHeadlines = async () => {
    try {
      // First try to get breaking news
      const breakingResponse = await fetch('/api/news?published=true&isBreakingNews=true&limit=5&sort=createdAt');
      const breakingData = await breakingResponse.json();

      let allHeadlines = [];

      if (breakingData.success && breakingData.news && Array.isArray(breakingData.news)) {
        allHeadlines = breakingData.news;
      }

      // If we don't have enough breaking news, fill with regular news
      if (allHeadlines.length < 5) {
        const regularResponse = await fetch(`/api/news?published=true&limit=${5 - allHeadlines.length}&sort=createdAt`);
        const regularData = await regularResponse.json();

        if (regularData.success && regularData.news && Array.isArray(regularData.news)) {
          // Filter out any news that are already in breaking news
          const breakingIds = allHeadlines.map((news: NewsItem) => news._id);
          const filteredRegular = regularData.news.filter((news: NewsItem) => !breakingIds.includes(news._id));
          allHeadlines = [...allHeadlines, ...filteredRegular];
        }
      }

      if (allHeadlines.length > 0) {
        setHeadlines(allHeadlines);
      } else {
        setError('Gagal memuat berita headline');
        setHeadlines([]);
      }
    } catch (error) {
      console.error('Error fetching breaking news:', error);
      setError('Terjadi kesalahan saat memuat berita');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative h-96 bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Memuat berita terbaru...</p>
        </div>
      </section>
    );
  }

  if (error || headlines.length === 0) {
    return (
      <section className="relative h-96 bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-lg">{error || 'Tidak ada berita headline tersedia'}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gray-900 overflow-hidden">
      {/* Breaking News Label */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide">
          🔥 Breaking News
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: '.swiper-button-prev-custom',
          nextEl: '.swiper-button-next-custom',
        }}
        pagination={{
          el: '.swiper-pagination-custom',
          clickable: true,
          bulletClass: 'swiper-pagination-bullet-custom',
          bulletActiveClass: 'swiper-pagination-bullet-active-custom',
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        loop={true}
        className="h-80 sm:h-96 md:h-[450px] lg:h-[500px]"
      >
        {headlines.map((news) => (
          <SwiperSlide key={news._id}>
            <div className="relative h-full w-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                {news.imageUrl ? (
                  <>
                    <Image
                      src={news.imageUrl}
                      alt={news.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="100vw"
                      quality={85}
                      onError={(e) => {
                        // Fallback to gradient if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full bg-gradient-to-br from-gray-800 to-gray-900';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                    {/* Enhanced Gradient Overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
                  </>
                ) : (
                  <>
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
                    {/* Pattern overlay for fallback */}
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />
                  </>
                )}
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-end">
                <div className="container mx-auto px-3 sm:px-4 pb-6 sm:pb-8 md:pb-12">
                  <div className="max-w-4xl">
                    {/* Category Badge & Breaking News Badge */}
                    <div className="mb-3 sm:mb-4 flex items-center gap-2 flex-wrap">
                      {news.isBreakingNews && (
                        <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-red-600 text-white animate-pulse">
                          🔥 BREAKING
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${categoryColors[news.category] || categoryColors.umum}`}>
                        <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                        {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
                      </span>
                    </div>

                    {/* Title with enhanced readability */}
                    <Link href={`/berita/${news.slug}`}>
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight hover:text-blue-300 transition-colors cursor-pointer line-clamp-3 sm:line-clamp-none drop-shadow-lg text-shadow-lg">
                        {news.title}
                      </h2>
                    </Link>

                    {/* Excerpt with enhanced background */}
                    <div className="hidden sm:block bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 max-w-3xl">
                      <p className="text-gray-100 text-base sm:text-lg md:text-xl line-clamp-2 leading-relaxed">
                        {news.excerpt}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center text-gray-300 text-xs sm:text-sm">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span>{formatDateShort(news.createdAt)}</span>
                      <span className="mx-1 sm:mx-2">•</span>
                      <span className="truncate">Oleh {news.author}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        className="swiper-button-prev-custom group absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white border-opacity-20 hover:border-opacity-40 shadow-lg hover:shadow-xl"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-200" />
      </button>

      <button
        className="swiper-button-next-custom group absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white border-opacity-20 hover:border-opacity-40 shadow-lg hover:shadow-xl"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-200" />
      </button>

      {/* Custom Pagination */}
      <div className="swiper-pagination-custom absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-1.5 sm:space-x-2"></div>

      <style jsx global>{`
        .swiper-pagination-bullet-custom {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active-custom {
          background: white;
          transform: scale(1.2);
        }

        .swiper-pagination-bullet-custom:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        /* Enhanced navigation button styles */
        .swiper-button-prev-custom,
        .swiper-button-next-custom {
          opacity: 0.8;
          transition: all 0.3s ease;
        }

        .swiper-button-prev-custom:hover,
        .swiper-button-next-custom:hover {
          opacity: 1;
          transform: translateY(-50%) scale(1.05);
        }

        /* Mobile responsiveness for navigation */
        @media (max-width: 640px) {
          .swiper-button-prev-custom,
          .swiper-button-next-custom {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            padding: 8px;
          }
        }

        /* Ensure arrows are always visible */
        .swiper-button-prev-custom:not(:hover),
        .swiper-button-next-custom:not(:hover) {
          background: rgba(0, 0, 0, 0.4) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }

        /* Enhanced text readability */
        .text-shadow-lg {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.6);
        }

        /* Smooth image loading */
        .swiper-slide img {
          transition: opacity 0.3s ease-in-out;
        }

        .swiper-slide img[data-loaded="false"] {
          opacity: 0;
        }

        .swiper-slide img[data-loaded="true"] {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
