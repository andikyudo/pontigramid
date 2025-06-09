'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Shield, AlertCircle } from 'lucide-react';

interface AdminAuthProps {
  children: React.ReactNode;
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      // Check server-side session by making a test API call
      // This is the only reliable way to check authentication
      const response = await fetch('/api/admin/news?limit=1');

      if (response.ok) {
        setIsAuthenticated(true);
        // Only set client-side storage AFTER successful server verification
        sessionStorage.setItem('admin-verified', 'true');
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        // Clear any stale client-side data
        sessionStorage.removeItem('admin-user');
        sessionStorage.removeItem('admin-verified');
        localStorage.removeItem('admin_token');
      } else {
        setError('Authentication check failed');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setError('Network error during authentication check');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Try automatic login with default credentials
      const csrfResponse = await fetch('/api/auth/csrf');
      const csrfData = await csrfResponse.json();

      if (!csrfData.success) {
        throw new Error('Failed to get CSRF token');
      }

      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          password: 'admin123',
          csrfToken: csrfData.csrfToken
        }),
      });

      const loginData = await loginResponse.json();

      if (loginData.success) {
        // Store minimal verification flag only after successful login
        if (loginData.user) {
          sessionStorage.setItem('admin-user', JSON.stringify(loginData.user));
          sessionStorage.setItem('admin-verified', 'true');
        }

        setIsAuthenticated(true);
      } else {
        setError(loginData.error || 'Login failed');
      }
    } catch (error) {
      console.error('Auto-login error:', error);
      setError('Failed to authenticate automatically');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLogin = () => {
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Access Required</h1>
            <p className="text-gray-600 mt-2">Please authenticate to access admin features</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                  Authenticating...
                </>
              ) : (
                '🔐 Auto Login (admin/admin123)'
              )}
            </button>

            <button
              onClick={handleManualLogin}
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              📝 Manual Login
            </button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Default credentials: admin / admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
