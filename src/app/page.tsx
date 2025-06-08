'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import BreakingNewsSlider from '@/components/BreakingNewsSlider';
import RunningTextTicker from '@/components/RunningTextTicker';
import TrendingNews from '@/components/TrendingNews';
import HorizontalNewsCards from '@/components/HorizontalNewsCards';
import PopularCategories from '@/components/PopularCategories';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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

interface NewsResponse {
  success: boolean;
  news: NewsItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize state from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    if (categoryParam && categoryParam !== currentCategory) {
      setCurrentCategory(categoryParam);
    }

    if (searchParam && searchParam !== searchQuery) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  const fetchNews = async (page: number = 1, category: string = 'all', search: string = '', append: boolean = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        published: 'true',
        sort: 'createdAt' // Ensure chronological sorting (newest first)
      });

      if (category !== 'all') {
        params.append('category', category);
      }

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/news?${params}`);
      const data: NewsResponse = await response.json();

      if (data.success && data.news && Array.isArray(data.news)) {
        if (append) {
          setNews(prev => [...prev, ...data.news]);
        } else {
          setNews(data.news);
        }
        if (data.pagination) {
          setTotalPages(data.pagination.pages || 1);
          setCurrentPage(page);
        }
      } else {
        // Handle case where no data is returned
        if (!append) {
          setNews([]);
        }
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNews(1, currentCategory, searchQuery);
  }, [currentCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setCurrentPage(1);

    // Update URL parameters
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/?${params.toString()}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);

    // Update URL parameters
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('search', query.trim());
    } else {
      params.delete('search');
    }
    router.push(`/?${params.toString()}`);
  };

  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchNews(currentPage + 1, currentCategory, searchQuery, true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearch}
        currentCategory={currentCategory}
      />

      {/* Running Text Ticker */}
      <RunningTextTicker />

      {/* Breaking News Slider */}
      <BreakingNewsSlider />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Hero Section - Simplified for mobile */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Portal Berita Terpercaya
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Dapatkan informasi terkini dan terpercaya dari berbagai kategori berita
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Memuat berita...</span>
          </div>
        ) : (
          <>
            {/* News Grid */}
            {news && news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {news.map((item) => (
                  <NewsCard key={item._id} news={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Tidak ada berita ditemukan</p>
              </div>
            )}

            {/* Load More Button */}
            {currentPage < totalPages && (
              <div className="text-center">
                <Button
                  onClick={loadMore}
                  disabled={loadingMore}
                  size="lg"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Memuat...
                    </>
                  ) : (
                    'Muat Lebih Banyak'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Additional Sections */}
      <TrendingNews />
      <HorizontalNewsCards />
      <PopularCategories />

      {/* Footer */}
      <Footer />
    </div>
  );
}
