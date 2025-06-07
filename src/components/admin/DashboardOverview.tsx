'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Users,
  Eye,
  TrendingUp,
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStats {
  totalNews: number;
  publishedNews: number;
  draftNews: number;
  totalViews: number;
  todayViews: number;
  totalUsers: number;
  activeUsers: number;
  popularArticles: Array<{
    id: string;
    title: string;
    views: number;
    category: string;
    publishedAt: string;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    user: string;
    target: string;
    timestamp: string;
  }>;
  viewsChart: Array<{
    date: string;
    views: number;
  }>;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchDashboardStats();
  }, [timeRange]);

  const fetchDashboardStats = async () => {
    try {
      // Simulate API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStats: DashboardStats = {
        totalNews: 156,
        publishedNews: 142,
        draftNews: 14,
        totalViews: 45230,
        todayViews: 1250,
        totalUsers: 5,
        activeUsers: 3,
        popularArticles: [
          {
            id: '1',
            title: 'Breaking: Perkembangan Terbaru Ekonomi Indonesia',
            views: 2340,
            category: 'Ekonomi',
            publishedAt: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            title: 'Teknologi AI Terbaru yang Mengubah Dunia',
            views: 1890,
            category: 'Teknologi',
            publishedAt: '2024-01-14T15:20:00Z'
          },
          {
            id: '3',
            title: 'Olahraga: Final Liga Champions Malam Ini',
            views: 1650,
            category: 'Olahraga',
            publishedAt: '2024-01-14T08:45:00Z'
          }
        ],
        recentActivity: [
          {
            id: '1',
            action: 'published',
            user: 'Admin User',
            target: 'Berita Ekonomi Terbaru',
            timestamp: '2024-01-15T14:30:00Z'
          },
          {
            id: '2',
            action: 'created',
            user: 'Editor User',
            target: 'Draft Artikel Teknologi',
            timestamp: '2024-01-15T13:15:00Z'
          },
          {
            id: '3',
            action: 'updated',
            user: 'Admin User',
            target: 'Kategori Olahraga',
            timestamp: '2024-01-15T12:00:00Z'
          }
        ],
        viewsChart: [
          { date: '2024-01-09', views: 1200 },
          { date: '2024-01-10', views: 1350 },
          { date: '2024-01-11', views: 1100 },
          { date: '2024-01-12', views: 1450 },
          { date: '2024-01-13', views: 1600 },
          { date: '2024-01-14', views: 1380 },
          { date: '2024-01-15', views: 1250 }
        ]
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Berita',
      value: stats.totalNews,
      change: '+12%',
      changeType: 'positive' as const,
      icon: FileText,
      description: `${stats.publishedNews} published, ${stats.draftNews} draft`
    },
    {
      title: 'Total Views',
      value: formatNumber(stats.totalViews),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: Eye,
      description: `${formatNumber(stats.todayViews)} views hari ini`
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      change: '0%',
      changeType: 'neutral' as const,
      icon: Users,
      description: `dari ${stats.totalUsers} total users`
    },
    {
      title: 'Engagement',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      description: 'Average engagement rate'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview portal berita PontigramID</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">7 Hari Terakhir</option>
            <option value="30d">30 Hari Terakhir</option>
            <option value="90d">90 Hari Terakhir</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center text-xs font-medium ${
                    stat.changeType === 'positive' 
                      ? 'text-green-600' 
                      : stat.changeType === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    {stat.changeType === 'positive' && <ArrowUpRight className="h-3 w-3 mr-1" />}
                    {stat.changeType === 'negative' && <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Artikel Populer
            </CardTitle>
            <CardDescription>
              Artikel dengan views tertinggi minggu ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.popularArticles.map((article, index) => (
                <div key={article.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {article.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{article.category}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-sm font-medium text-gray-900">
                      {formatNumber(article.views)}
                    </span>
                    <p className="text-xs text-gray-500">views</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Aktivitas Terbaru
            </CardTitle>
            <CardDescription>
              Log aktivitas pengguna terbaru
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>
                      {' '}
                      <span className="text-gray-600">{activity.action}</span>
                      {' '}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
