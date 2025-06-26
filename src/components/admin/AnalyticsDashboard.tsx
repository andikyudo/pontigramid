'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  Eye, 
  Users, 
  Clock, 
  TrendingUp, 
  MapPin, 
  Monitor, 
  Smartphone, 
  Tablet,
  Calendar,
  Filter,
  Download
} from 'lucide-react';

interface AnalyticsData {
  overallStats: {
    totalViews: number;
    uniqueViews: number;
    avgViewDuration: number;
    totalArticles: number;
    totalVisitors: number;
    bounceRate: number;
  };
  topArticles: Array<{
    articleSlug: string;
    articleTitle: string;
    articleCategory: string;
    articleAuthor: string;
    totalViews: number;
    uniqueViews: number;
    avgViewDuration: number;
    engagementRate: number;
  }>;
  viewsTrend: Array<{
    date: string;
    totalViews: number;
    uniqueViews: number;
    avgViewDuration: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    totalViews: number;
    uniqueViews: number;
    avgViewDuration: number;
    articleCount: number;
    avgViewsPerArticle: number;
  }>;
  geographicDistribution: Array<{
    location: {
      city: string;
      district?: string;
      region: string;
      country: string;
    };
    totalViews: number;
    uniqueViews: number;
    avgViewDuration: number;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }>;
  deviceAnalytics: {
    deviceBreakdown: Array<{
      type: string;
      count: number;
    }>;
    topBrowsers: Array<{
      browser: string;
      count: number;
    }>;
    topOS: Array<{
      os: string;
      count: number;
    }>;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        period,
        ...(category && { category }),
        ...(author && { author })
      });

      const response = await fetch(`/api/admin/analytics/dashboard?${params}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setData(result.data);
        } else {
          console.error('Analytics API returned unsuccessful result:', result);
          // Set empty data structure to prevent undefined errors
          setData(null);
        }
      } else {
        console.error('Analytics API response not ok:', response.status, response.statusText);
        setData(null);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period, category, author]);

  const formatNumber = (num: number | undefined | null) => {
    // Handle undefined, null, or NaN values
    if (num === undefined || num === null || isNaN(num)) {
      return '0';
    }

    // Convert to number if it's a string
    const numValue = typeof num === 'string' ? parseFloat(num) : num;

    // Handle invalid numbers
    if (isNaN(numValue)) {
      return '0';
    }

    if (numValue >= 1000000) return (numValue / 1000000).toFixed(1) + 'M';
    if (numValue >= 1000) return (numValue / 1000).toFixed(1) + 'K';
    return numValue.toString();
  };

  const formatDuration = (seconds: number | undefined | null) => {
    // Handle undefined, null, or NaN values
    if (seconds === undefined || seconds === null || isNaN(seconds)) {
      return '0:00';
    }

    // Convert to number if it's a string
    const numValue = typeof seconds === 'string' ? parseFloat(seconds) : seconds;

    // Handle invalid numbers
    if (isNaN(numValue) || numValue < 0) {
      return '0:00';
    }

    const minutes = Math.floor(numValue / 60);
    const remainingSeconds = Math.floor(numValue % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const safeToFixed = (num: number | undefined | null, decimals: number = 1) => {
    // Handle undefined, null, or NaN values
    if (num === undefined || num === null || isNaN(num)) {
      return '0.0';
    }

    // Convert to number if it's a string
    const numValue = typeof num === 'string' ? parseFloat(num) : num;

    // Handle invalid numbers
    if (isNaN(numValue)) {
      return '0.0';
    }

    return numValue.toFixed(decimals);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-4">Gagal memuat data analytics</p>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // Ensure data structure exists with defaults
  const safeData = {
    overallStats: data.overallStats || {
      totalViews: 0,
      uniqueViews: 0,
      avgViewDuration: 0,
      totalArticles: 0,
      totalVisitors: 0,
      bounceRate: 0
    },
    viewsTrend: data.viewsTrend || [],
    topArticles: data.topArticles || [],
    categoryPerformance: data.categoryPerformance || [],
    geographicDistribution: data.geographicDistribution || [],
    deviceAnalytics: data.deviceAnalytics || {
      deviceBreakdown: []
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Analisis performa artikel dan pembaca</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1d">24 Jam Terakhir</option>
            <option value="7d">7 Hari Terakhir</option>
            <option value="30d">30 Hari Terakhir</option>
            <option value="90d">90 Hari Terakhir</option>
          </select>
          
          <input
            type="text"
            placeholder="Filter kategori..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <input
            type="text"
            placeholder="Filter penulis..."
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(safeData.overallStats.totalViews)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(safeData.overallStats.uniqueViews)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatDuration(safeData.overallStats.avgViewDuration)}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {safeToFixed(safeData.overallStats.bounceRate, 1)}%
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Trend Views</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={safeData.viewsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString('id-ID')}
                formatter={(value: number, name: string) => [formatNumber(value), name === 'totalViews' ? 'Total Views' : 'Unique Views']}
              />
              <Area type="monotone" dataKey="totalViews" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Area type="monotone" dataKey="uniqueViews" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Performa Kategori</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={safeData.categoryPerformance.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value: number) => formatNumber(value)} />
              <Bar dataKey="totalViews" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Breakdown Device</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={safeData.deviceAnalytics.deviceBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, count, percent }) => `${type}: ${safeToFixed((percent || 0) * 100, 0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {safeData.deviceAnalytics.deviceBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Distribusi Geografis</h3>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {safeData.geographicDistribution.slice(0, 10).map((location, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">
                      {location.location.district || location.location.city}
                    </p>
                    <p className="text-xs text-gray-500">
                      {location.location.region}, {location.location.country}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatNumber(location.totalViews)}</p>
                  <p className="text-xs text-gray-500">{formatNumber(location.uniqueViews)} unique</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Articles Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Artikel Terpopuler</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Artikel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unique Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeData.topArticles.map((article, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {article.articleTitle}
                      </p>
                      <p className="text-xs text-gray-500">
                        by {article.articleAuthor}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {article.articleCategory}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(article.totalViews)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(article.uniqueViews)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDuration(article.avgViewDuration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {safeToFixed(article.engagementRate, 1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
