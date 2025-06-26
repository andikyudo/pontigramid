'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface ViewTrackerProps {
  articleSlug: string;
  articleTitle: string;
  category: string;
  author: string;
}

export default function ViewTracker({ 
  articleSlug, 
  articleTitle, 
  category, 
  author 
}: ViewTrackerProps) {
  const [sessionId, setSessionId] = useState<string>('');
  const [visitorId, setVisitorId] = useState<string>('');
  const [viewStartTime, setViewStartTime] = useState<number>(0);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [locationConsent, setLocationConsent] = useState<boolean>(false);
  
  const pathname = usePathname();
  const viewTrackedRef = useRef(false);
  const visibilityTimeRef = useRef(0);
  const lastVisibilityChangeRef = useRef(Date.now());

  // Generate or retrieve visitor ID
  useEffect(() => {
    let storedVisitorId = localStorage.getItem('pontigram_visitor_id');
    if (!storedVisitorId) {
      storedVisitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('pontigram_visitor_id', storedVisitorId);
    }
    setVisitorId(storedVisitorId);

    // Generate session ID
    let storedSessionId = sessionStorage.getItem('pontigram_session_id');
    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('pontigram_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);

    // Check location consent
    const consent = localStorage.getItem('pontigram_location_consent');
    setLocationConsent(consent === 'true');

    setViewStartTime(Date.now());
    lastVisibilityChangeRef.current = Date.now();
  }, []);

  // Track page visibility for accurate view duration
  useEffect(() => {
    const handleVisibilityChange = () => {
      const now = Date.now();
      
      if (document.hidden) {
        // Page became hidden, add to visibility time
        visibilityTimeRef.current += now - lastVisibilityChangeRef.current;
      } else {
        // Page became visible, reset timer
        lastVisibilityChangeRef.current = now;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Track view when component mounts and article changes
  useEffect(() => {
    if (!articleSlug || !visitorId || !sessionId || viewTrackedRef.current) {
      return;
    }

    const trackView = async () => {
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        };

        // Add location consent header if given
        if (locationConsent) {
          headers['x-location-consent'] = 'true';
        }

        const response = await fetch('/api/track-view', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            articleSlug,
            sessionId,
            visitorId,
            referrer: document.referrer || undefined,
            viewDuration: 0 // Initial tracking
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setHasTrackedView(true);
            viewTrackedRef.current = true;
            
            // Store view ID for potential updates
            sessionStorage.setItem(`view_${articleSlug}`, data.data.viewId);
          }
        }
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    // Delay tracking slightly to ensure user is actually reading
    const timer = setTimeout(trackView, 2000);
    
    return () => clearTimeout(timer);
  }, [articleSlug, visitorId, sessionId, locationConsent]);

  // Update view duration periodically and on page unload
  useEffect(() => {
    if (!hasTrackedView) return;

    const updateViewDuration = async () => {
      const now = Date.now();
      let totalViewTime = visibilityTimeRef.current;
      
      // Add current session time if page is visible
      if (!document.hidden) {
        totalViewTime += now - lastVisibilityChangeRef.current;
      }
      
      const viewDuration = Math.floor(totalViewTime / 1000); // Convert to seconds
      
      if (viewDuration < 5) return; // Don't update for very short views

      try {
        await fetch('/api/track-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(locationConsent && { 'x-location-consent': 'true' })
          },
          body: JSON.stringify({
            articleSlug,
            sessionId,
            visitorId,
            viewDuration,
            isUpdate: true
          })
        });
      } catch (error) {
        // Silently fail for duration updates
      }
    };

    // Update duration every 30 seconds
    const interval = setInterval(updateViewDuration, 30000);

    // Update on page unload
    const handleBeforeUnload = () => {
      updateViewDuration();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updateViewDuration(); // Final update
    };
  }, [hasTrackedView, articleSlug, sessionId, visitorId, locationConsent]);

  // Reset tracking when article changes
  useEffect(() => {
    viewTrackedRef.current = false;
    setHasTrackedView(false);
    setViewStartTime(Date.now());
    visibilityTimeRef.current = 0;
    lastVisibilityChangeRef.current = Date.now();
  }, [articleSlug]);

  // Location consent banner
  const [showConsentBanner, setShowConsentBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('pontigram_location_consent');
    if (consent === null) {
      setShowConsentBanner(true);
    }
  }, []);

  const handleLocationConsent = (granted: boolean) => {
    localStorage.setItem('pontigram_location_consent', granted.toString());
    setLocationConsent(granted);
    setShowConsentBanner(false);
  };

  return (
    <>
      {/* Location Consent Banner */}
      {showConsentBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-lg">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Izin Lokasi untuk Analytics</h3>
              <p className="text-sm text-gray-300">
                Kami ingin menggunakan lokasi Anda untuk memberikan konten yang lebih relevan dan analytics yang lebih baik. 
                Data lokasi akan digunakan secara anonim dan tidak akan dibagikan kepada pihak ketiga.
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleLocationConsent(false)}
                className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Tolak
              </button>
              <button
                onClick={() => handleLocationConsent(true)}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Izinkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs z-40">
          <div>Article: {articleSlug}</div>
          <div>Visitor: {visitorId.slice(-8)}</div>
          <div>Session: {sessionId.slice(-8)}</div>
          <div>Tracked: {hasTrackedView ? 'Yes' : 'No'}</div>
          <div>Location: {locationConsent ? 'Allowed' : 'Denied'}</div>
        </div>
      )}
    </>
  );
}
