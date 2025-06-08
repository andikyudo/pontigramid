import AdminLayout from '@/components/admin/AdminLayout';
import AdminAuth from '@/components/admin/AdminAuth';
import AdminDashboard from './dashboard';

export default function DashboardPage() {
  return (
    <AdminAuth>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </AdminAuth>
  );
}
