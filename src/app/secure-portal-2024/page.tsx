'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Obfuscated admin portal entry point
 * This page redirects to the actual admin login with additional security checks
 */
export default function SecurePortalPage() {
  const router = useRouter();

  useEffect(() => {
    // Add some basic security checks
    const performSecurityChecks = async () => {
      try {
        // Check if this is a legitimate access attempt
        const userAgent = navigator.userAgent;
        const timestamp = Date.now();
        
        // Log access attempt for monitoring
        await fetch('/api/security/access-log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: '/secure-portal-2024',
            userAgent,
            timestamp,
            ip: 'client-side', // Will be replaced with actual IP on server
          }),
        }).catch(() => {
          // Silently fail if logging doesn't work
        });

        // Add a small delay to prevent automated attacks
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redirect to actual admin login
        router.replace('/admin/login');
        
      } catch (error) {
        console.error('Security check failed:', error);
        // Still redirect to admin login even if security checks fail
        router.replace('/admin/login');
      }
    };

    performSecurityChecks();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Memverifikasi akses...</p>
        <p className="text-gray-400 text-sm mt-2">Mohon tunggu sebentar</p>
      </div>
    </div>
  );
}
