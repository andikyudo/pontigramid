'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface Advertisement {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  placementZone: string;
  priority: number;
}

interface AdDisplayProps {
  zone: 'header' | 'sidebar' | 'content' | 'footer' | 'mobile-inline';
  limit?: number;
  className?: string;
}

export default function AdDisplay({ zone, limit = 1, className = '' }: AdDisplayProps) {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchAds();
  }, [zone, limit]);

  const fetchAds = async () => {
    try {
      const response = await fetch(`/api/advertisements?zone=${zone}&limit=${limit}`);
      const data = await response.json();
      
      if (data.success) {
        setAds(data.data);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = async (adId: string, linkUrl?: string) => {
    try {
      // Track click
      await fetch('/api/advertisements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adId }),
      });

      // Open link if provided
      if (linkUrl) {
        window.open(linkUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error tracking ad click:', error);
      // Still open link even if tracking fails
      if (linkUrl) {
        window.open(linkUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleImageError = (adId: string) => {
    setImageErrors(prev => ({ ...prev, [adId]: true }));
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 rounded-lg h-32 w-full"></div>
      </div>
    );
  }

  if (ads.length === 0) {
    return null;
  }

  const getAdStyles = () => {
    switch (zone) {
      case 'header':
        return 'w-full h-20 md:h-24 rounded-lg overflow-hidden';
      case 'sidebar':
        return 'w-full h-64 rounded-lg overflow-hidden';
      case 'content':
        return 'w-full h-32 md:h-40 rounded-lg overflow-hidden my-4';
      case 'footer':
        return 'w-full h-16 md:h-20 rounded-lg overflow-hidden';
      case 'mobile-inline':
        return 'w-full h-24 rounded-lg overflow-hidden my-3';
      default:
        return 'w-full h-32 rounded-lg overflow-hidden';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {ads.map((ad) => (
        <div
          key={ad._id}
          className={`relative group cursor-pointer transition-transform duration-300 hover:scale-105 ${getAdStyles()}`}
          onClick={() => handleAdClick(ad._id, ad.linkUrl)}
        >
          {/* Ad Image */}
          <div className="relative w-full h-full">
            {!imageErrors[ad._id] ? (
              ad.imageUrl.startsWith('data:') ? (
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(ad._id)}
                  loading="lazy"
                />
              ) : (
                <Image
                  src={ad.imageUrl}
                  alt={ad.title}
                  fill
                  className="object-cover"
                  sizes={zone === 'sidebar' ? '300px' : '100vw'}
                  onError={() => handleImageError(ad._id)}
                />
              )
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <div className="text-sm font-medium">{ad.title}</div>
                  {ad.description && (
                    <div className="text-xs mt-1">{ad.description}</div>
                  )}
                </div>
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
              {/* Ad Label */}
              <div className="absolute top-2 left-2">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Iklan
                </span>
              </div>

              {/* External Link Icon */}
              {ad.linkUrl && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Title Overlay for larger ads */}
              {(zone === 'sidebar' || zone === 'content') && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                  <h3 className="text-white font-medium text-sm line-clamp-2">
                    {ad.title}
                  </h3>
                  {ad.description && (
                    <p className="text-gray-200 text-xs mt-1 line-clamp-1">
                      {ad.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
