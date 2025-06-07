'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import NewsForm from '@/components/admin/NewsForm';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function CreateNewsPage() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication - temporarily disabled for testing
    // const token = localStorage.getItem('admin_token');
    // if (!token) {
    //   router.push('/admin');
    //   return;
    // }
  }, [router]);

  return (
    <AdminLayout>
      <ErrorBoundary>
        <NewsForm />
      </ErrorBoundary>
    </AdminLayout>
  );
}
