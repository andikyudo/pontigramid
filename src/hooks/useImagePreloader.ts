'use client';

import { useEffect, useState } from 'react';

interface PreloadOptions {
  priority?: 'high' | 'medium' | 'low';
  timeout?: number;
  retries?: number;
}

interface PreloadResult {
  loaded: boolean;
  error: boolean;
  progress: number;
}

/**
 * Hook for preloading critical images with priority and retry logic
 */
export function useImagePreloader(
  imageUrls: string[],
  options: PreloadOptions = {}
): PreloadResult {
  const { priority = 'medium', timeout = 10000, retries = 2 } = options;
  
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (imageUrls.length === 0) {
      setLoaded(true);
      setProgress(100);
      return;
    }

    let loadedCount = 0;
    let errorCount = 0;
    const totalImages = imageUrls.length;

    const updateProgress = () => {
      const newProgress = (loadedCount / totalImages) * 100;
      setProgress(newProgress);
      
      if (loadedCount === totalImages) {
        setLoaded(true);
      }
      
      if (errorCount === totalImages) {
        setError(true);
      }
    };

    const preloadImage = async (url: string, attempt = 0): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        
        // Set priority hint if supported
        if ('fetchPriority' in img) {
          (img as any).fetchPriority = priority;
        }

        const timeoutId = setTimeout(() => {
          img.onload = null;
          img.onerror = null;
          reject(new Error(`Timeout loading image: ${url}`));
        }, timeout);

        img.onload = () => {
          clearTimeout(timeoutId);
          loadedCount++;
          updateProgress();
          resolve();
        };

        img.onerror = () => {
          clearTimeout(timeoutId);
          if (attempt < retries) {
            // Retry with exponential backoff
            setTimeout(() => {
              preloadImage(url, attempt + 1).then(resolve).catch(reject);
            }, Math.pow(2, attempt) * 1000);
          } else {
            errorCount++;
            updateProgress();
            reject(new Error(`Failed to load image after ${retries} retries: ${url}`));
          }
        };

        img.src = url;
      });
    };

    // Start preloading all images
    const preloadPromises = imageUrls.map(url => 
      preloadImage(url).catch(error => {
        console.warn('Image preload failed:', error);
        return null;
      })
    );

    Promise.allSettled(preloadPromises).then(() => {
      setLoaded(true);
    });

  }, [imageUrls, priority, timeout, retries]);

  return { loaded, error, progress };
}

/**
 * Preload critical images for better performance
 */
export function preloadCriticalImages(imageUrls: string[]): Promise<void[]> {
  const promises = imageUrls.map(url => {
    return new Promise<void>((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      
      // Set high priority for critical images
      if ('fetchPriority' in link) {
        (link as any).fetchPriority = 'high';
      }

      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to preload: ${url}`));
      
      document.head.appendChild(link);
    });
  });

  return Promise.all(promises);
}

/**
 * Get optimized image URL with format and size parameters
 */
export function getOptimizedImageUrl(
  originalUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): string {
  // If it's a data URL, return as-is
  if (originalUrl.startsWith('data:')) {
    return originalUrl;
  }

  // For external URLs, you might want to add optimization parameters
  // This depends on your image service (Cloudinary, ImageKit, etc.)
  // For now, return the original URL
  return originalUrl;
}

/**
 * Check if WebP is supported in the current browser
 */
export function isWebPSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch {
    return false;
  }
}

/**
 * Generate responsive image sizes string
 */
export function generateResponsiveSizes(breakpoints: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
} = {}): string {
  const {
    mobile = 100,
    tablet = 50,
    desktop = 33
  } = breakpoints;

  return `(max-width: 640px) ${mobile}vw, (max-width: 1024px) ${tablet}vw, ${desktop}vw`;
}
