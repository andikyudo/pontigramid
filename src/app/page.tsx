'use client';

import { useState, useEffect, Suspense } from 'react';
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
import { useInfiniteNews } from '@/hooks/useNews';

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

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTrending, setShowTrending] = useState(false);

  // Use React Query for infinite loading
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteNews(currentCategory, searchQuery, 12, showTrending);

  // Flatten the paginated data
  const news = data?.pages.flatMap(page => page.news) || [];

  // Initialize state from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const trendingParam = searchParams.get('trending');

    if (categoryParam && categoryParam !== currentCategory) {
      setCurrentCategory(categoryParam);
    }

    if (searchParam && searchParam !== searchQuery) {
      setSearchQuery(searchParam);
    }

    if (trendingParam === 'true' && !showTrending) {
      setShowTrending(true);
    } else if (trendingParam !== 'true' && showTrending) {
      setShowTrending(false);
    }
  }, [searchParams, currentCategory, searchQuery, showTrending]);



  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);

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
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
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
            {showTrending ? 'Berita Trending' : 'Portal Berita Terpercaya'}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            {showTrending
              ? 'Berita paling populer dan banyak dibaca hari ini'
              : 'Dapatkan informasi terkini dan terpercaya dari berbagai kategori berita'
            }
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Memuat berita...</span>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Terjadi kesalahan saat memuat berita</p>
            <p className="text-gray-500 text-sm mt-2">{error?.message}</p>
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
            {hasNextPage && (
              <div className="text-center">
                <Button
                  onClick={loadMore}
                  disabled={isFetchingNextPage}
                  size="lg"
                >
                  {isFetchingNextPage ? (
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

      {/* Additional Sections - Hide when showing trending */}
      {!showTrending && (
        <>
          <TrendingNews />
          <HorizontalNewsCards />
          <PopularCategories />
        </>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
