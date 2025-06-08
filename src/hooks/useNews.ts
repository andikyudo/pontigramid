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
  limit: number = 12
) => {
  return useInfiniteQuery({
    queryKey: ['news-infinite', category, search, limit],
    queryFn: async ({ pageParam = 1 }): Promise<NewsResponse> => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
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
    gcTime: 15 * 60 * 1000, // 15 minutes in cache
  });
};

// Fetch breaking news
export const useBreakingNews = (limit: number = 5) => {
  return useQuery({
    queryKey: ['breaking-news', limit],
    queryFn: async (): Promise<NewsItem[]> => {
      const response = await fetch(`/api/news?published=true&limit=${limit}&sort=createdAt`);
      if (!response.ok) {
        throw new Error('Failed to fetch breaking news');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error('Failed to fetch breaking news');
      }

      return data.news;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for breaking news
    gcTime: 10 * 60 * 1000, // 10 minutes in cache
  });
};
