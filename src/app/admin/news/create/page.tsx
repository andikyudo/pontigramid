import NewsForm from '@/components/admin/NewsForm';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function CreateNewsPage() {
  return (
    <ErrorBoundary>
      <NewsForm />
    </ErrorBoundary>
  );
}
