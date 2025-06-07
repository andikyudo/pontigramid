'use client';

import { useIsClient } from '@/hooks/useIsClient';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Komponen untuk merender children hanya di client-side
 * Berguna untuk menghindari hydration mismatch
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * HOC untuk membungkus komponen agar hanya render di client-side
 */
export function withClientOnly<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: React.ReactNode
) {
  return function ClientOnlyComponent(props: T) {
    return (
      <ClientOnly fallback={fallback}>
        <Component {...props} />
      </ClientOnly>
    );
  };
}
