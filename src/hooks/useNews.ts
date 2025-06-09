import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

export interface NewsItem {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  imageUrl?: string;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  views?: number;
}

export interface NewsResponse {
  success: boolean;
  news: NewsItem[];
  pagination?: {
    page: number;
    pages: number;
    total: number;
  };
}

// Fetch news with pagination and filters
export const useNews = (
  page: number = 1,
  category: string = 'all',
  search: string = '',
  limit: number = 12
) => {
  return useQuery({
    queryKey: ['news', page, category, search, limit],
    queryFn: async (): Promise<NewsResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        published: 'true',
        sort: 'createdAt'
      });

      if (category !== 'all') {
        params.append('category', category);
      }

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/news?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      return response.json();
    },
    staleTime: 3 * 60 * 1000, // 3 minutes for news data
    gcTime: 10 * 60 * 1000, // 10 minutes in cache
  });
};

// Infinite query for load more functionality
export const useInfiniteNews = (
  category: string = 'all',
  search: string = '',
  limit: number = 12,
  trending: boolean = false
) => {
  return useInfiniteQuery({
    queryKey: ['news-infinite', category, search, limit, trending],
    queryFn: async ({ pageParam = 1 }): Promise<NewsResponse> => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: limit.toString(),
        published: 'true',
        sort: trending ? 'views' : 'createdAt'
      });

      if (trending) {
        params.append('trending', 'true');
      }

      if (category !== 'all') {
        params.append('category', category);
      }

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/news?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      return response.json();
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination && lastPage.pagination.page < lastPage.pagination.pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Fetch single news article
export const useNewsArticle = (slug: string) => {
  return useQuery({
    queryKey: ['news-article', slug],
    queryFn: async (): Promise<NewsItem> => {
      const response = await fetch(`/api/news/slug/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Article not found');
      }

      return data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for individual articles
    gcTime: 30 * 60 * 1000, // 30 minutes in cache
  });
};

// Fetch trending news
export const useTrendingNews = (limit: number = 6) => {
  return useQuery({
    queryKey: ['trending-news', limit],
    queryFn: async (): Promise<NewsItem[]> => {
      const response = await fetch(`/api/news?published=true&limit=${limit}&sort=createdAt`);
      if (!response.ok) {
        throw new Error('Failed to fetch trending news');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error('Failed to fetch trending news');
      }

      // Add mock view counts for trending effect
      const newsWithViews = data.news.map((news: NewsItem, index: number) => ({
        ...news,
        views: Math.floor(Math.random() * 5000) + 1000 + (limit - index) * 500
      }));

      return newsWithViews;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes in cache
    refetchOnMount: false, // Don't refetch on component mount if data is fresh
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};

// Fetch breaking news
export const useBreakingNews = (limit: number = 5) => {
  return useQuery({
    queryKey: ['breaking-news', limit],
    queryFn: async (): Promise<NewsItem[]> => {
      // First try to get breaking news
      const breakingResponse = await fetch(`/api/news?published=true&isBreakingNews=true&limit=${limit}&sort=createdAt`);
      const breakingData = await breakingResponse.json();

      let allHeadlines = [];

      if (breakingData.success && breakingData.news && Array.isArray(breakingData.news)) {
        allHeadlines = breakingData.news;
      }

      // If we don't have enough breaking news, fill with regular news
      if (allHeadlines.length < limit) {
        const regularResponse = await fetch(`/api/news?published=true&limit=${limit - allHeadlines.length}&sort=createdAt`);
        const regularData = await regularResponse.json();

        if (regularData.success && regularData.news && Array.isArray(regularData.news)) {
          // Filter out any news that are already in breaking news
          const breakingIds = allHeadlines.map((news: NewsItem) => news._id);
          const filteredRegular = regularData.news.filter((news: NewsItem) => !breakingIds.includes(news._id));
          allHeadlines = [...allHeadlines, ...filteredRegular];
        }
      }

      return allHeadlines;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for breaking news
    gcTime: 15 * 60 * 1000, // 15 minutes in cache
    refetchOnMount: false, // Don't refetch on component mount if data is fresh
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};



// Fetch category counts for popular categories
export const useCategoryCounts = () => {
  return useQuery({
    queryKey: ['category-counts'],
    queryFn: async () => {
      const categoriesConfig = [
        { id: 'politik', name: 'Politik', icon: 'Users', bgColor: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-200' },
        { id: 'ekonomi', name: 'Ekonomi', icon: 'TrendingUp', bgColor: 'bg-green-50', textColor: 'text-green-600', borderColor: 'border-green-200' },
        { id: 'olahraga', name: 'Olahraga', icon: 'Trophy', bgColor: 'bg-orange-50', textColor: 'text-orange-600', borderColor: 'border-orange-200' },
        { id: 'teknologi', name: 'Teknologi', icon: 'Smartphone', bgColor: 'bg-purple-50', textColor: 'text-purple-600', borderColor: 'border-purple-200' },
        { id: 'hiburan', name: 'Hiburan', icon: 'Music', bgColor: 'bg-pink-50', textColor: 'text-pink-600', borderColor: 'border-pink-200' },
        { id: 'kesehatan', name: 'Kesehatan', icon: 'Heart', bgColor: 'bg-red-50', textColor: 'text-red-600', borderColor: 'border-red-200' },
        { id: 'pendidikan', name: 'Pendidikan', icon: 'BookOpen', bgColor: 'bg-indigo-50', textColor: 'text-indigo-600', borderColor: 'border-indigo-200' },
        { id: 'umum', name: 'Umum', icon: 'Globe', bgColor: 'bg-gray-50', textColor: 'text-gray-600', borderColor: 'border-gray-200' },
        { id: 'hukum', name: 'Hukum', icon: 'Scale', bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200' }
      ];

      // Fetch news count for each category in parallel
      const promises = categoriesConfig.map(async (category) => {
        try {
          const response = await fetch(`/api/news?category=${category.id}&published=true&limit=1`);
          const data = await response.json();
          return {
            ...category,
            count: data.pagination?.total || 0
          };
        } catch (error) {
          console.error(`Error fetching count for ${category.id}:`, error);
          return {
            ...category,
            count: 0
          };
        }
      });

      const categoriesWithCounts = await Promise.all(promises);

      // Sort by count (most popular first)
      categoriesWithCounts.sort((a, b) => b.count - a.count);

      return categoriesWithCounts;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for category counts
    gcTime: 30 * 60 * 1000, // 30 minutes in cache
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

// Fetch related news based on category and exclude current article
export const useRelatedNews = (category: string, currentSlug: string, limit: number = 6) => {
  return useQuery({
    queryKey: ['related-news', category, currentSlug, limit],
    queryFn: async (): Promise<NewsItem[]> => {
      const response = await fetch(`/api/news?category=${category}&published=true&limit=${limit + 1}&sort=createdAt`);
      if (!response.ok) {
        throw new Error('Failed to fetch related news');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error('Failed to fetch related news');
      }

      // Filter out current article and limit results
      const relatedNews = data.news
        .filter((news: NewsItem) => news.slug !== currentSlug)
        .slice(0, limit);

      return relatedNews;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes in cache
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!category && !!currentSlug, // Only fetch when we have category and slug
  });
};
