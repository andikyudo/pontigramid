'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated by checking sessionStorage
    const adminUser = sessionStorage.getItem('admin-user');
    if (adminUser) {
      // If user data exists in sessionStorage, redirect to dashboard
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleDashboardClick = () => {
    // Force navigation to dashboard
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-600 mt-2">Access admin dashboard</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleDashboardClick}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            🚀 Go to Dashboard
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Click above to access the admin dashboard
            </p>
          </div>

          <div className="border-t pt-4">
            <Link
              href="/"
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors block text-center"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
