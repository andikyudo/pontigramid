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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  MapPin, 
  Users, 
  Eye, 
  Clock, 
  TrendingUp,
  Filter,
  Download,
  Map
} from 'lucide-react';

interface GeographicData {
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
    uniqueVisitors: number;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    topCategories: Array<{
      category: string;
      count: number;
      percentage: number;
    }>;
    deviceBreakdown: {
      desktop: number;
      mobile: number;
      tablet: number;
    };
    peakHours: Array<{
      hour: number;
      views: number;
    }>;
  }>;
  pontianakAnalysis: Array<{
    district: string;
    totalViews: number;
    uniqueViews: number;
    avgViewDuration: number;
    uniqueVisitors: number;
    engagementRate: number;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    mostPopularCategory: {
      category: string;
      count: number;
    };
    peakReadingHour: {
      hour: number;
      count: number;
    };
  }>;
  geographicTrends: Array<{
    _id: string;
    dailyData: Array<{
      date: string;
      views: number;
      uniqueViews: number;
    }>;
    totalViews: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

export default function GeographicAnalytics() {
  const [data, setData] = useState<GeographicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');
  const [district, setDistrict] = useState('');
  const [category, setCategory] = useState('');
  const [groupBy, setGroupBy] = useState('district');

  const fetchGeographicAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        period,
        groupBy,
        ...(district && { district }),
        ...(category && { category })
      });

      const response = await fetch(`/api/admin/analytics/geographic?${params}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching geographic analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeographicAnalytics();
  }, [period, district, category, groupBy]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
        <p className="text-gray-500">Gagal memuat data geographic analytics</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Geographic Analytics</h1>
          <p className="text-gray-600">Analisis distribusi pembaca berdasarkan lokasi geografis</p>
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
          
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="district">Per Kecamatan</option>
            <option value="city">Per Kota</option>
            <option value="region">Per Provinsi</option>
          </select>
          
          <input
            type="text"
            placeholder="Filter kecamatan..."
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <input
            type="text"
            placeholder="Filter kategori..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Pontianak Districts Analysis */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Map className="w-5 h-5" />
            Analisis Kecamatan Pontianak
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* District Performance Chart */}
            <div>
              <h4 className="text-md font-medium mb-4">Performa per Kecamatan</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.pontianakAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="district" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      formatNumber(value), 
                      name === 'totalViews' ? 'Total Views' : 'Unique Views'
                    ]}
                  />
                  <Bar dataKey="totalViews" fill="#8884d8" />
                  <Bar dataKey="uniqueViews" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* District Details */}
            <div>
              <h4 className="text-md font-medium mb-4">Detail Kecamatan</h4>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {data.pontianakAnalysis.map((district, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-sm">{district.district}</h5>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {district.engagementRate.toFixed(1)}% engagement
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>
                        <p>Views: {formatNumber(district.totalViews)}</p>
                        <p>Visitors: {formatNumber(district.uniqueVisitors)}</p>
                      </div>
                      <div>
                        <p>Duration: {formatDuration(district.avgViewDuration)}</p>
                        <p>Peak: {district.peakReadingHour.hour}:00</p>
                      </div>
                    </div>
                    {district.mostPopularCategory && (
                      <p className="text-xs text-gray-500 mt-2">
                        Kategori populer: {district.mostPopularCategory.category}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Locations */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Lokasi Teratas</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {data.geographicDistribution.slice(0, 15).map((location, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {location.location.district || location.location.city}
                    </p>
                    <p className="text-xs text-gray-500">
                      {location.location.region}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatNumber(location.totalViews)}</p>
                  <p className="text-xs text-gray-500">
                    {formatNumber(location.uniqueVisitors)} visitors
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Distribution by Location */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Distribusi Device per Lokasi</h3>
          <div className="space-y-4">
            {data.geographicDistribution.slice(0, 8).map((location, index) => {
              const total = location.deviceBreakdown.desktop + 
                           location.deviceBreakdown.mobile + 
                           location.deviceBreakdown.tablet;
              
              return (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {location.location.district || location.location.city}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatNumber(total)} total
                    </span>
                  </div>
                  <div className="flex gap-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500"
                      style={{ 
                        width: `${(location.deviceBreakdown.desktop / total) * 100}%` 
                      }}
                    />
                    <div 
                      className="bg-green-500"
                      style={{ 
                        width: `${(location.deviceBreakdown.mobile / total) * 100}%` 
                      }}
                    />
                    <div 
                      className="bg-yellow-500"
                      style={{ 
                        width: `${(location.deviceBreakdown.tablet / total) * 100}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Desktop: {location.deviceBreakdown.desktop}</span>
                    <span>Mobile: {location.deviceBreakdown.mobile}</span>
                    <span>Tablet: {location.deviceBreakdown.tablet}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Geographic Trends */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Trend Geografis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Chart */}
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.geographicTrends.slice(0, 5).map(trend => ({
                name: trend._id,
                views: trend.totalViews,
                dailyAvg: trend.totalViews / trend.dailyData.length
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Trend Summary */}
          <div className="space-y-3">
            <h4 className="font-medium">Ringkasan Trend</h4>
            {data.geographicTrends.slice(0, 8).map((trend, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">{trend._id || 'Unknown'}</span>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatNumber(trend.totalViews)}</p>
                  <p className="text-xs text-gray-500">
                    {(trend.totalViews / trend.dailyData.length).toFixed(1)}/hari
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
