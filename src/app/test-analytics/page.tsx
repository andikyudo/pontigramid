'use client';

import { useState, useEffect } from 'react';
import ViewTracker from '@/components/ViewTracker';

export default function TestAnalyticsPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runAnalyticsTest = async () => {
    setLoading(true);
    const results = [];

    try {
      // Test 1: Basic API connectivity
      const apiTest = await fetch('/api/test');
      const apiResult = await apiTest.json();
      results.push({
        test: 'API Connectivity',
        success: apiResult.success,
        data: apiResult
      });

      // Test 2: Database connectivity
      const dbTest = await fetch('/api/test?mode=analytics');
      const dbResult = await dbTest.json();
      results.push({
        test: 'Database Connectivity',
        success: dbResult.success,
        data: dbResult
      });

      // Test 3: View tracking
      const trackTest = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'track-view',
          articleSlug: 'test-analytics-page'
        })
      });
      const trackResult = await trackTest.json();
      results.push({
        test: 'View Tracking',
        success: trackResult.success,
        data: trackResult
      });

    } catch (error) {
      results.push({
        test: 'Error',
        success: false,
        data: { error: error.message }
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runAnalyticsTest();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics System Test</h1>
        
        {/* ViewTracker Component Test */}
        <ViewTracker
          articleSlug="test-analytics-page"
          articleTitle="Analytics Test Page"
          category="test"
          author="System Test"
        />

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">ViewTracker Component</h2>
          <p className="text-gray-600 mb-4">
            ViewTracker component is active on this page. Check browser console for tracking activity.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Article:</strong> test-analytics-page<br/>
              <strong>Title:</strong> Analytics Test Page<br/>
              <strong>Category:</strong> test<br/>
              <strong>Author:</strong> System Test
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">API Tests</h2>
            <button
              onClick={runAnalyticsTest}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Run Tests'}
            </button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{result.test}</h3>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        result.success
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {result.success ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Running analytics tests...</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Manual Tests</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">1. Check Browser Console</h3>
              <p className="text-gray-600 text-sm">
                Open browser developer tools and check console for ViewTracker activity.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">2. Check Network Tab</h3>
              <p className="text-gray-600 text-sm">
                Monitor network requests to /api/analytics/track-view endpoint.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">3. Check Local Storage</h3>
              <p className="text-gray-600 text-sm">
                Verify visitor ID and session ID are stored in browser storage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
