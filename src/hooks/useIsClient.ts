import { useEffect, useState } from 'react';

/**
 * Hook untuk mendeteksi apakah komponen sedang berjalan di client-side
 * Berguna untuk menghindari hydration mismatch
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook untuk mendeteksi apakah browser memiliki ekstensi yang memodifikasi DOM
 */
export function useHasBrowserExtensions() {
  const [hasExtensions, setHasExtensions] = useState(false);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;

    // Deteksi ekstensi umum yang memodifikasi DOM
    const checkExtensions = () => {
      const body = document.body;
      const hasGrammarly = body.hasAttribute('data-new-gr-c-s-check-loaded') || 
                          body.hasAttribute('data-gr-ext-installed');
      const hasAdBlocker = document.querySelector('[data-adblock]') !== null;
      const hasPasswordManager = document.querySelector('[data-lastpass]') !== null ||
                                 document.querySelector('[data-1password]') !== null;
      
      setHasExtensions(hasGrammarly || hasAdBlocker || hasPasswordManager);
    };

    // Check immediately
    checkExtensions();

    // Check after a short delay to catch extensions that load later
    const timer = setTimeout(checkExtensions, 1000);

    return () => clearTimeout(timer);
  }, [isClient]);

  return hasExtensions;
}
