'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import NewsManagement from '@/components/admin/NewsManagement';

export default function TestNewsPage() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Set up fake admin session for testing
    if (typeof window !== 'undefined') {
      // Set session storage for admin user
      sessionStorage.setItem('admin-user', JSON.stringify({
        id: 'test-admin-id',
        username: 'admin',
        email: 'admin@pontigramid.com',
        role: 'super_admin'
      }));

      // Set localStorage as backup
      localStorage.setItem('admin_token', 'test-token-' + Date.now());
      localStorage.setItem('admin_user', JSON.stringify({
        email: 'admin@pontigramid.com',
        name: 'Admin User',
        role: 'admin'
      }));

      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Setting up test environment...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">🧪 Test Environment</h2>
          <p className="text-yellow-700 text-sm">
            This is a test page to verify news management functionality without authentication barriers.
          </p>
        </div>
        
        <NewsManagement />
      </div>
    </AdminLayout>
  );
}
