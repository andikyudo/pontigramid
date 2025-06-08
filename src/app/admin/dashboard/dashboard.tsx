'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Article {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  imageUrl?: string;
  published: boolean;
  slug: string;
  tags: string[];
  views: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  totalCategories: number;
  recentArticles: Article[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalViews: 0,
    totalCategories: 0,
    recentArticles: []
  });
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    fetchDashboardStats();

    // Set current date and time on client-side only
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('id-ID'));
    setCurrentTime(now.toLocaleTimeString('id-ID'));
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [newsResponse, categoriesResponse] = await Promise.all([
        fetch('/api/news').catch(() => ({ ok: false, json: () => Promise.resolve({ news: [] }) })),
        fetch('/api/categories').catch(() => ({ ok: false, json: () => Promise.resolve({ categories: [] }) }))
      ]);

      let newsData = { news: [] };
      let categoriesData = { categories: [] };

      if (newsResponse.ok) {
        newsData = await newsResponse.json();
      }

      if (categoriesResponse.ok) {
        categoriesData = await categoriesResponse.json();
      }

      const articles: Article[] = Array.isArray(newsData.news) ? newsData.news : [];
      const categories: Category[] = Array.isArray(categoriesData.categories) ? categoriesData.categories : [];

      setStats({
        totalArticles: articles.length,
        publishedArticles: articles.filter((article: Article) => Boolean(article.published)).length,
        draftArticles: articles.filter((article: Article) => !Boolean(article.published)).length,
        totalViews: articles.reduce((total: number, article: Article) => total + (Number(article.views) || 0), 0),
        totalCategories: categories.length,
        recentArticles: articles.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Set default values on error
      setStats({
        totalArticles: 0,
        publishedArticles: 0,
        draftArticles: 0,
        totalViews: 0,
        totalCategories: 0,
        recentArticles: []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">

        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Selamat Datang di Dashboard Admin! 👋
                </h2>
                <p className="text-blue-100">
                  Kelola konten dan pantau aktivitas website PontigramID
                </p>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="text-sm text-blue-100">Hari ini</p>
                  <p className="text-lg font-semibold">{currentDate || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Berita */}
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">📰</span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Berita
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : stats.totalArticles}
                    </dd>
                    <dd className="text-xs text-green-600 font-medium">
                      Total artikel
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-xl">👁️</span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Views
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : stats.totalViews.toLocaleString()}
                    </dd>
                    <dd className="text-xs text-green-600 font-medium">
                      Total views
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-xl">👥</span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Users
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : stats.publishedArticles}
                    </dd>
                    <dd className="text-xs text-blue-600 font-medium">
                      Published
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Published */}
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Published
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : stats.draftArticles}
                    </dd>
                    <dd className="text-xs text-gray-600 font-medium">
                      Draft articles
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Recent Activity - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-xl border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    📊
                  </span>
                  Recent Activity
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Artikel baru dipublikasi</p>
                      <p className="text-sm text-gray-500">&ldquo;Breaking News: Update Terbaru&rdquo;</p>
                      <p className="text-xs text-gray-400 mt-1">2 jam yang lalu</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">User baru mendaftar</p>
                      <p className="text-sm text-gray-500">john@example.com</p>
                      <p className="text-xs text-gray-400 mt-1">4 jam yang lalu</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Artikel diperbarui</p>
                      <p className="text-sm text-gray-500">&ldquo;Technology Trends 2024&rdquo;</p>
                      <p className="text-xs text-gray-400 mt-1">6 jam yang lalu</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Komentar baru</p>
                      <p className="text-sm text-gray-500">Pada artikel &ldquo;Politik Terkini&rdquo;</p>
                      <p className="text-xs text-gray-400 mt-1">8 jam yang lalu</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/admin/activity" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Lihat semua aktivitas →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & System Status - 1 column */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    ⚡
                  </span>
                  Quick Actions
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <Link
                    href="/admin/news/create"
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg text-center hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>📝</span>
                    <span>Buat Artikel Baru</span>
                  </Link>
                  <Link
                    href="/admin/news"
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg text-center hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>📰</span>
                    <span>Kelola Berita</span>
                  </Link>
                  <Link
                    href="/admin/categories"
                    className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg text-center hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>🏷️</span>
                    <span>Kategori</span>
                  </Link>
                  <Link
                    href="/admin/analytics"
                    className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg text-center hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>📊</span>
                    <span>Analytics</span>
                  </Link>
                  <Link
                    href="/admin/media"
                    className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg text-center hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>🖼️</span>
                    <span>Media Gallery</span>
                  </Link>
                  <Link
                    href="/admin/users"
                    className="w-full bg-pink-600 text-white px-4 py-3 rounded-lg text-center hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>👥</span>
                    <span>Kelola Users</span>
                  </Link>
                  <Link
                    href="/admin/footer"
                    className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg text-center hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>🦶</span>
                    <span>Kelola Footer</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    🔧
                  </span>
                  System Status
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Server</span>
                    </div>
                    <span className="text-xs text-green-600 font-medium">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Database</span>
                    </div>
                    <span className="text-xs text-green-600 font-medium">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">API</span>
                    </div>
                    <span className="text-xs text-green-600 font-medium">Operational</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Last updated: {currentTime || '-'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
    </div>
  );
}
