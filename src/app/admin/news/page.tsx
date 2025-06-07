'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import NewsManagement from '@/components/admin/NewsManagement';

export default function AdminNewsPage() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }
  }, [router]);

  return (
    <AdminLayout>
      <NewsManagement />
    </AdminLayout>
  );
}
