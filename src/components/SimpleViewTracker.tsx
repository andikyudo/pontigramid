'use client';

import { useEffect, useRef, useState } from 'react';

interface SimpleViewTrackerProps {
  articleSlug: string;
  articleTitle: string;
}

export default function SimpleViewTracker({ articleSlug, articleTitle }: SimpleViewTrackerProps) {
  const [sessionId, setSessionId] = useState<string>('');
  const hasTrackedView = useRef<boolean>(false);

  // Generate session ID
  useEffect(() => {
    const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(generateSessionId());
  }, []);

  // Track article view
  const trackView = async () => {
    if (hasTrackedView.current || !sessionId || !articleSlug) return;

    try {
      hasTrackedView.current = true;

      console.log('Tracking view for article:', articleSlug);
      
      const viewData = {
        articleSlug,
        referrer: typeof window !== 'undefined' ? document.referrer || '' : '',
        sessionId
      };

      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(viewData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('View tracked successfully:', result);

      // Store tracking success in session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`tracked_${articleSlug}`, 'true');
      }

    } catch (error) {
      console.error('Error tracking view:', error);
      hasTrackedView.current = false; // Allow retry
      
      // No fallback needed since we're using the primary working endpoint
    }
  };

  // Initialize tracking
  useEffect(() => {
    if (!articleSlug || !sessionId) return;

    // Check if already tracked in this session
    if (typeof window !== 'undefined') {
      const alreadyTracked = sessionStorage.getItem(`tracked_${articleSlug}`);
      if (alreadyTracked) {
        hasTrackedView.current = true;
        return;
      }
    }

    // Track initial view after a delay
    const trackingTimeout = setTimeout(() => {
      trackView();
    }, 3000);

    return () => {
      clearTimeout(trackingTimeout);
    };
  }, [articleSlug, sessionId]);

  // Debug information (only in development)
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded z-50 max-w-xs">
        <div className="font-bold mb-1">Analytics Debug</div>
        <div>Article: {articleSlug.substring(0, 30)}...</div>
        <div>Session: {sessionId.substring(0, 15)}...</div>
        <div>Tracked: {hasTrackedView.current ? 'Yes' : 'No'}</div>
      </div>
    );
  }

  return null;
}
