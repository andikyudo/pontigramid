'use client';

import { useState } from 'react';
import {
  BarChart3,
  Map,
  TrendingUp,
  Users,
  Eye,
  Clock,
  MapPin
} from 'lucide-react';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import GeographicAnalytics from '@/components/admin/GeographicAnalytics';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      name: 'Overview',
      icon: BarChart3,
      description: 'Ringkasan analytics keseluruhan'
    },
    {
      id: 'geographic',
      name: 'Geographic',
      icon: Map,
      description: 'Analisis distribusi geografis pembaca'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Analisis mendalam tentang performa artikel dan perilaku pembaca
              </p>
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 text-blue-600">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">Views</span>
                </div>
                <p className="text-lg font-bold text-gray-900">Real-time</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-green-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Visitors</span>
                </div>
                <p className="text-lg font-bold text-gray-900">Tracking</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-purple-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Locations</span>
                </div>
                <p className="text-lg font-bold text-gray-900">Mapped</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'overview' && <AnalyticsDashboard />}
        {activeTab === 'geographic' && <GeographicAnalytics />}
      </div>

      {/* Features Info */}
      <div className="bg-white border-t mt-8">
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
              <p className="text-sm text-gray-600">
                Tracking views, engagement, dan perilaku pembaca secara real-time
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Geographic Insights</h3>
              <p className="text-sm text-gray-600">
                Analisis distribusi pembaca di wilayah Pontianak dan sekitarnya
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">User Behavior</h3>
              <p className="text-sm text-gray-600">
                Memahami preferensi konten dan pola baca berdasarkan demografi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
