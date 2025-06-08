'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page visit
    const trackVisit = async () => {
      try {
        // Don't track admin pages
        if (pathname.startsWith('/admin')) {
          return;
        }

        const pageData = {
          pageUrl: window.location.href,
          pageTitle: document.title,
          referrer: document.referrer
        };

        await fetch('/api/track-visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pageData),
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.log('Visitor tracking failed:', error);
      }
    };

    // Track after a small delay to ensure page is loaded
    const timer = setTimeout(trackVisit, 1000);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  // This component doesn't render anything
  return null;
}
