'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function ProgressiveImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  sizes,
  priority = false,
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError
}: ProgressiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized blur placeholder if not provided
  const defaultBlurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

  // WebP support detection
  const [supportsWebP, setSupportsWebP] = useState(false);

  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        try {
          const webpDataURL = canvas.toDataURL('image/webp');
          setSupportsWebP(webpDataURL.indexOf('data:image/webp') === 0);
        } catch {
          setSupportsWebP(false);
        }
      }
    };

    checkWebPSupport();
  }, []);

  // Optimize image source based on format support
  useEffect(() => {
    if (src.startsWith('data:')) {
      setImageSrc(src);
      return;
    }

    // For external URLs, try to optimize format
    if (supportsWebP && !src.includes('.webp')) {
      // If the image service supports WebP conversion, modify URL
      // This is a placeholder - implement based on your image service
      setImageSrc(src);
    } else {
      setImageSrc(src);
    }
  }, [src, supportsWebP]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!priority && imgRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Image is in viewport, start loading
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before image enters viewport
        }
      );

      observer.observe(imgRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [priority]);

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-center p-4">
          <div className="text-sm">Gambar tidak dapat dimuat</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}

      {/* Main image */}
      <Image
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL || defaultBlurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}
