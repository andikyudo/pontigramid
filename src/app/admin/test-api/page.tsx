'use client';

import { useState } from 'react';

interface ApiTestResult {
  endpoint: string;
  status: number;
  success: boolean;
  data?: any;
  error?: string;
}

export default function TestApiPage() {
  const [results, setResults] = useState<ApiTestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint: string, method: string = 'GET', body?: any) => {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();

      return {
        endpoint,
        status: response.status,
        success: response.ok,
        data: data,
      };
    } catch (error) {
      return {
        endpoint,
        status: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);

    const tests = [
      // Test admin news API
      { endpoint: '/api/admin/news', method: 'GET' },
      
      // Test regular news API
      { endpoint: '/api/news', method: 'GET' },
      
      // Test auth endpoints
      { endpoint: '/api/auth/csrf', method: 'GET' },
      
      // Test login with correct credentials
      { 
        endpoint: '/api/auth/login', 
        method: 'POST',
        body: {
          username: 'admin',
          password: 'admin123',
          csrfToken: 'test-token'
        }
      },
    ];

    const testResults: ApiTestResult[] = [];

    for (const test of tests) {
      console.log(`Testing ${test.endpoint}...`);
      const result = await testEndpoint(test.endpoint, test.method, test.body);
      testResults.push(result);
      setResults([...testResults]);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setLoading(false);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 400 && status < 500) return 'text-yellow-600';
    if (status >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">🧪 API Testing Dashboard</h1>
          
          <div className="mb-6">
            <button
              onClick={runAllTests}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Running Tests...' : 'Run All API Tests'}
            </button>
          </div>

          {results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Test Results:</h2>
              
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{result.endpoint}</span>
                    <span className={`font-bold ${getStatusColor(result.status)}`}>
                      {result.status || 'ERROR'}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <div className="mb-2">
                      <span className="font-medium">Success: </span>
                      <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                        {result.success ? '✅ Yes' : '❌ No'}
                      </span>
                    </div>
                    
                    {result.error && (
                      <div className="mb-2">
                        <span className="font-medium text-red-600">Error: </span>
                        <span className="text-red-600">{result.error}</span>
                      </div>
                    )}
                    
                    {result.data && (
                      <div>
                        <span className="font-medium">Response: </span>
                        <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Expected Results:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>/api/admin/news</strong>: Should return 401 (Unauthorized) or news data if session exists</li>
              <li>• <strong>/api/news</strong>: Should return 200 with public news data</li>
              <li>• <strong>/api/auth/csrf</strong>: Should return 200 with CSRF token</li>
              <li>• <strong>/api/auth/login</strong>: Should return 200 with user data or error</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
