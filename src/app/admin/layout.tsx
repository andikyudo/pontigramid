'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminAuth from '@/components/admin/AdminAuth';

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pages that don't require authentication
  const publicAdminPages = ['/admin', '/admin/login'];
  const isPublicPage = publicAdminPages.includes(pathname);

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check for public pages
      if (isPublicPage) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      try {
        // Check authentication by making a test API call
        const response = await fetch('/api/admin/news?limit=1');
        
        if (response.ok) {
          setIsAuthenticated(true);
        } else if (response.status === 401) {
          setIsAuthenticated(false);
          // Clear any stale client-side data
          sessionStorage.removeItem('admin-user');
          sessionStorage.removeItem('admin-verified');
          localStorage.removeItem('admin_token');
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, isPublicPage]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // For public pages, render without authentication wrapper
  if (isPublicPage) {
    return <>{children}</>;
  }

  // For protected pages, use AdminAuth wrapper
  if (!isAuthenticated) {
    return (
      <AdminAuth>
        <AdminLayout>{children}</AdminLayout>
      </AdminAuth>
    );
  }

  // Authenticated users get the full admin layout
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
