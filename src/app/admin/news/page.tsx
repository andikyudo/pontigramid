import AdminLayout from '@/components/admin/AdminLayout';
import AdminAuth from '@/components/admin/AdminAuth';
import NewsManagement from '@/components/admin/NewsManagement';

export default function AdminNewsPage() {
  return (
    <AdminAuth>
      <AdminLayout>
        <NewsManagement />
      </AdminLayout>
    </AdminAuth>
  );
}
