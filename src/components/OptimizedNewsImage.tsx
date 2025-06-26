'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedNewsImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onError?: () => void;
  onLoad?: () => void;
  fallbackClassName?: string;
}

export default function OptimizedNewsImage({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px',
  onError,
  onLoad,
  fallbackClassName = ''
}: OptimizedNewsImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [src]);

  const handleImageError = () => {
    setImageError(true);
    onError?.();
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  // Handle base64 images with regular img tag
  if (src.startsWith('data:')) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageError ? 'hidden' : ''}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading={priority ? 'eager' : 'lazy'}
        style={{ 
          display: imageError ? 'none' : 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    );
  }

  // Handle regular URLs with Next.js Image
  if (!imageError) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          sizes={sizes}
          priority={priority}
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rw="
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ 
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }}
        />
        
        {/* Loading state */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    );
  }

  // Fallback when image fails to load
  return (
    <div className={`w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${fallbackClassName}`}>
      <div className="text-gray-400 text-center">
        <div className="w-16 h-16 mx-auto mb-2 bg-gray-400 rounded-lg flex items-center justify-center">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-xs text-gray-500">Gambar tidak tersedia</p>
      </div>
    </div>
  );
}
