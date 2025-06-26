'use client';

import { useEffect, useRef } from 'react';

interface ViewTrackerProps {
  articleSlug: string;
  articleTitle: string;
  articleCategory?: string;
  articleAuthor?: string;
}

export default function ViewTracker({ 
  articleSlug, 
  articleTitle, 
  articleCategory, 
  articleAuthor 
}: ViewTrackerProps) {
  const hasTracked = useRef(false);
  const sessionId = useRef<string>('');
  const startTime = useRef<number>(0);

  // Generate unique session ID
  useEffect(() => {
    if (!sessionId.current) {
      sessionId.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    startTime.current = Date.now();
  }, []);

  // Track page view
  useEffect(() => {
    if (hasTracked.current || !articleSlug) return;

    const trackView = async () => {
      try {
        const referrer = document.referrer || '';
        const userAgent = navigator.userAgent;
        
        // Get client IP (will be handled by server)
        const response = await fetch('/api/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            articleSlug,
            articleTitle,
            articleCategory: articleCategory || 'Uncategorized',
            articleAuthor: articleAuthor || 'Unknown',
            sessionId: sessionId.current,
            referrer,
            userAgent,
            action: 'track-view',
            timestamp: new Date().toISOString(),
            clientInfo: {
              url: window.location.href,
              pathname: window.location.pathname,
              search: window.location.search,
              language: navigator.language,
              platform: navigator.platform,
              cookieEnabled: navigator.cookieEnabled,
              onLine: navigator.onLine,
              screenWidth: window.screen.width,
              screenHeight: window.screen.height,
              viewportWidth: window.innerWidth,
              viewportHeight: window.innerHeight,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('📊 View tracked successfully:', result);
          hasTracked.current = true;
        } else {
          console.error('❌ Failed to track view:', response.statusText);
        }
      } catch (error) {
        console.error('❌ Error tracking view:', error);
      }
    };

    // Track immediately when component mounts
    trackView();
  }, [articleSlug, articleTitle, articleCategory, articleAuthor]);

  // Track view duration when user leaves
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (!hasTracked.current) return;

      const viewDuration = Date.now() - startTime.current;
      
      // Use sendBeacon for reliable tracking on page unload
      const data = JSON.stringify({
        articleSlug,
        sessionId: sessionId.current,
        action: 'track-duration',
        viewDuration: Math.round(viewDuration / 1000), // in seconds
        timestamp: new Date().toISOString()
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/test', data);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleBeforeUnload();
      }
    };

    // Track when user leaves page
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [articleSlug]);

  // Track scroll depth
  useEffect(() => {
    if (!hasTracked.current) return;

    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
      }
    };

    const handleScroll = () => {
      trackScrollDepth();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      // Send final scroll depth
      if (maxScrollDepth > 0) {
        fetch('/api/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            articleSlug,
            sessionId: sessionId.current,
            action: 'track-scroll',
            scrollDepth: maxScrollDepth,
            timestamp: new Date().toISOString()
          }),
        }).catch(console.error);
      }
    };
  }, [articleSlug]);

  // This component doesn't render anything visible
  return null;
}
