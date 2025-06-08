'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Globe, 
  Eye, 
  TrendingUp, 
  Shield, 
  MapPin,
  Clock,
  Activity,
  ChevronDown,
  ChevronUp,
  Wifi
} from 'lucide-react';

interface VisitorData {
  analytics: {
    total: number;
    today: number;
    yesterday: number;
    week: number;
    month: number;
    blocked: number;
    topCountries: Array<{ country: string; count: number }>;
    recent: Array<{
      ipAddress: string;
      country: string;
      city: string;
      lastVisit: string;
      visitCount: number;
    }>;
  };
}

export default function VisitorAnalytics() {
  const [data, setData] = useState<VisitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [currentIP, setCurrentIP] = useState<string>('');

  useEffect(() => {
    fetchVisitorData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchVisitorData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchVisitorData = async () => {
    try {
      const response = await fetch('/api/admin/visitors?limit=5');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      }
      
      // Get current user's IP
      const ipResponse = await fetch('/api/track-visitor');
      const ipResult = await ipResponse.json();
      if (ipResult.success) {
        setCurrentIP(ipResult.data.ipAddress);
      }
    } catch (error) {
      console.error('Error fetching visitor data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
          <h3 className="font-semibold text-gray-900">Visitor Analytics</h3>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Activity className="h-5 w-5 text-red-500" />
          <h3 className="font-semibold text-gray-900">Visitor Analytics</h3>
        </div>
        <p className="text-sm text-gray-500">Failed to load visitor data</p>
      </div>
    );
  }

  const { analytics } = data;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Visitor Analytics</h3>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Current IP */}
      <div className="p-4 bg-blue-50 border-b">
        <div className="flex items-center space-x-2">
          <Wifi className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Your IP:</span>
          <code className="text-sm bg-blue-100 px-2 py-1 rounded text-blue-800">
            {currentIP || 'Loading...'}
          </code>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analytics.today}</div>
            <div className="text-xs text-gray-500">Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{analytics.total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <>
          {/* Detailed Stats */}
          <div className="px-4 pb-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Yesterday</span>
                </div>
                <span className="text-sm font-medium">{analytics.yesterday}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">This Week</span>
                </div>
                <span className="text-sm font-medium">{analytics.week}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">This Month</span>
                </div>
                <span className="text-sm font-medium">{analytics.month}</span>
              </div>
              
              {analytics.blocked > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-600">Blocked</span>
                  </div>
                  <span className="text-sm font-medium text-red-600">{analytics.blocked}</span>
                </div>
              )}
            </div>
          </div>

          {/* Top Countries */}
          {analytics.topCountries.length > 0 && (
            <div className="px-4 pb-4">
              <div className="flex items-center space-x-2 mb-3">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Top Countries</span>
              </div>
              <div className="space-y-2">
                {analytics.topCountries.slice(0, 3).map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                      }`}></div>
                      <span className="text-xs text-gray-600">{country.country}</span>
                    </div>
                    <span className="text-xs font-medium">{country.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Visitors */}
          {analytics.recent.length > 0 && (
            <div className="px-4 pb-4">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Recent Visitors</span>
              </div>
              <div className="space-y-2">
                {analytics.recent.slice(0, 3).map((visitor, index) => (
                  <div key={visitor.ipAddress} className="text-xs">
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-100 px-1 rounded text-gray-700">
                        {visitor.ipAddress}
                      </code>
                      <span className="text-gray-500">{visitor.visitCount}x</span>
                    </div>
                    {visitor.country && (
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500">
                          {[visitor.city, visitor.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <div className="px-4 pb-4">
            <button
              onClick={fetchVisitorData}
              className="w-full text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </>
      )}
    </div>
  );
}
