'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ApiTestResult {
  success?: boolean;
  token?: string;
  error?: string;
  message?: string;
}

export default function AdminTestPage() {
  const [token, setToken] = useState<string | null>(null);
  const [apiTest, setApiTest] = useState<ApiTestResult | null>(null);

  useEffect(() => {
    // Check token in localStorage
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('admin_token');
      setToken(storedToken);
    }
  }, []);

  const testAPI = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@pontigramid.com',
          password: 'admin123'
        })
      });
      
      const data = await response.json();
      setApiTest(data);
    } catch (error) {
      setApiTest({ error: error.message });
    }
  };

  const clearToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      setToken(null);
    }
  };

  const goToDashboard = () => {
    window.location.href = '/admin/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Admin Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Token Status */}
          <Card>
            <CardHeader>
              <CardTitle>Token Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <strong>Token:</strong>
                  <pre className="bg-gray-100 p-2 rounded text-xs mt-1 overflow-auto">
                    {token || 'No token found'}
                  </pre>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={clearToken} variant="outline">
                    Clear Token
                  </Button>
                  <Button onClick={goToDashboard}>
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Test */}
          <Card>
            <CardHeader>
              <CardTitle>API Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={testAPI}>
                  Test Login API
                </Button>
                {apiTest && (
                  <div>
                    <strong>API Response:</strong>
                    <pre className="bg-gray-100 p-2 rounded text-xs mt-1 overflow-auto">
                      {JSON.stringify(apiTest, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Links */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => window.location.href = '/admin'}
                variant="outline"
              >
                Admin Login
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin/dashboard'}
                variant="outline"
              >
                Dashboard
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin/news'}
                variant="outline"
              >
                News Management
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin/categories'}
                variant="outline"
              >
                Categories
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
              <div><strong>User Agent:</strong> {typeof window !== 'undefined' ? navigator.userAgent : 'N/A'}</div>
              <div><strong>Local Storage Available:</strong> {typeof window !== 'undefined' && window.localStorage ? 'Yes' : 'No'}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
