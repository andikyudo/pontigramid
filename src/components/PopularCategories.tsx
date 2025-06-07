'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  TrendingUp,
  Gamepad2,
  Laptop,
  Music,
  Heart,
  GraduationCap,
  Globe,
  ArrowRight
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface CategoryData {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  count: number;
}

const categoriesConfig: CategoryData[] = [
  {
    id: 'politik',
    name: 'Politik',
    description: 'Berita politik terkini dan analisis mendalam',
    icon: Briefcase,
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100',
    count: 0
  },
  {
    id: 'ekonomi',
    name: 'Ekonomi',
    description: 'Update ekonomi, bisnis, dan keuangan',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100',
    count: 0
  },
  {
    id: 'olahraga',
    name: 'Olahraga',
    description: 'Berita olahraga dan hasil pertandingan',
    icon: Gamepad2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    count: 0
  },
  {
    id: 'teknologi',
    name: 'Teknologi',
    description: 'Inovasi teknologi dan gadget terbaru',
    icon: Laptop,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
    count: 0
  },
  {
    id: 'hiburan',
    name: 'Hiburan',
    description: 'Berita selebriti dan industri hiburan',
    icon: Music,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 hover:bg-pink-100',
    count: 0
  },
  {
    id: 'kesehatan',
    name: 'Kesehatan',
    description: 'Tips kesehatan dan berita medis',
    icon: Heart,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100',
    count: 0
  },
  {
    id: 'pendidikan',
    name: 'Pendidikan',
    description: 'Berita pendidikan dan pembelajaran',
    icon: GraduationCap,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100',
    count: 0
  },
  {
    id: 'umum',
    name: 'Umum',
    description: 'Berita umum dan informasi lainnya',
    icon: Globe,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 hover:bg-gray-100',
    count: 0
  }
];

export default function PopularCategories() {
  const [categories, setCategories] = useState<CategoryData[]>(categoriesConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      fetchCategoryCounts();
    }
  }, [inView]);

  const fetchCategoryCounts = async () => {
    try {
      // Fetch news count for each category
      const promises = categoriesConfig.map(async (category) => {
        const response = await fetch(`/api/news?category=${category.id}&published=true&limit=1`);
        const data = await response.json();
        return {
          ...category,
          count: data.pagination?.total || 0
        };
      });

      const categoriesWithCounts = await Promise.all(promises);
      
      // Sort by count (most popular first)
      categoriesWithCounts.sort((a, b) => b.count - a.count);
      
      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Error fetching category counts:', error);
      setError('Gagal memuat data kategori');
    } finally {
      setLoading(false);
    }
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-5 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section ref={ref} className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Kategori Populer
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Jelajahi berita berdasarkan kategori yang paling diminati pembaca
          </p>
          <div className="mt-3 sm:mt-4 w-16 sm:w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Globe className="h-16 w-16 mx-auto opacity-50" />
            </div>
            <p className="text-gray-600 text-lg">{error}</p>
          </div>
        ) : (
          <>
            {/* Mobile: Horizontal scroll layout */}
            <div className="block sm:hidden">
              <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                {categories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <Link
                      key={category.id}
                      href={`/?category=${category.id}`}
                      className="group flex-shrink-0"
                    >
                      <div className={`${category.bgColor} rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-gray-200 w-40 relative`}>
                        {/* Popular Badge */}
                        {index < 3 && (
                          <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                            Top
                          </div>
                        )}

                        {/* Icon */}
                        <div className={`${category.color} mb-3 text-center`}>
                          <IconComponent className="h-8 w-8 mx-auto group-hover:scale-110 transition-transform duration-300" />
                        </div>

                        {/* Category Name */}
                        <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors text-center">
                          {category.name}
                        </h3>

                        {/* Stats */}
                        <div className="text-center">
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">{category.count}</span> berita
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Scroll indicator */}
              <div className="text-center mt-2">
                <p className="text-xs text-gray-400">← Geser untuk melihat kategori lainnya →</p>
              </div>
            </div>

            {/* Desktop: Grid layout */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.id}
                  href={`/?category=${category.id}`}
                  className="group"
                >
                  <div className={`${category.bgColor} rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-gray-200`}>
                    {/* Popular Badge */}
                    {index < 3 && (
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Popular
                      </div>
                    )}
                    
                    {/* Icon */}
                    <div className={`${category.color} mb-4 relative`}>
                      <IconComponent className="h-12 w-12 group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    {/* Category Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">{category.count}</span> berita
                      </div>
                      <ArrowRight className={`h-4 w-4 ${category.color} group-hover:translate-x-1 transition-transform duration-300`} />
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent to-transparent group-hover:from-white/10 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
                  </div>
                </Link>
              );
            })}
            </div>
          </>
        )}

        {/* Bottom CTA */}
        {!loading && !error && (
          <div className="text-center mt-10">
            <p className="text-gray-600 mb-4">
              Tidak menemukan kategori yang Anda cari?
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              <Globe className="w-5 h-5 mr-2" />
              Lihat Semua Berita
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
