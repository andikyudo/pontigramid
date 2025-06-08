import AdminLayout from '@/components/admin/AdminLayout';
import AdminAuth from '@/components/admin/AdminAuth';
import NewsForm from '@/components/admin/NewsForm';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function CreateNewsPage() {
  return (
    <AdminAuth>
      <AdminLayout>
        <ErrorBoundary>
          <NewsForm />
        </ErrorBoundary>
      </AdminLayout>
    </AdminAuth>
  );
}
