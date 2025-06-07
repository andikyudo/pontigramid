'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import CategoryManagement from '@/components/admin/CategoryManagement';

export default function AdminCategoriesPage() {
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
      <CategoryManagement />
    </AdminLayout>
  );
}
