'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useBreakingNews } from '@/hooks/useNews';

export default function RunningTextTicker() {
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Use React Query for caching
  const { data: news = [], isLoading: loading, isError, error } = useBreakingNews(8);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if (loading) {
    return (
      <div className="bg-red-600 text-white py-2 overflow-hidden">
        <div className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm font-medium">Memuat berita terbaru...</span>
        </div>
      </div>
    );
  }

  if (isError || news.length === 0) {
    return (
      <div className="bg-red-600 text-white py-2 overflow-hidden">
        <div className="flex items-center justify-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            {error?.message || 'Tidak ada berita terbaru'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden relative">
      <div className="flex items-center">
        {/* Breaking Label */}
        <div className="flex-shrink-0 bg-red-800 px-3 py-1 mr-4 z-10 relative">
          <span className="text-xs font-bold uppercase tracking-wide">
            🔥 TERBARU
          </span>
        </div>

        {/* Ticker Content */}
        <div 
          className="flex-1 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={tickerRef}
            className={`flex whitespace-nowrap ${
              isPaused ? 'animation-paused' : ''
            }`}
            style={{
              animation: 'scroll-left 25s linear infinite',
            }}
          >
            {/* Duplicate news items for seamless loop */}
            {[...news, ...news].map((item, index) => (
              <Link
                key={`${item._id}-${index}`}
                href={`/berita/${item.slug}`}
                className="inline-block hover:text-yellow-300 transition-colors duration-200"
              >
                <span className="mx-8 text-sm font-medium">
                  <span className="inline-block w-2 h-2 bg-white rounded-full mr-3"></span>
                  {item.title}
                  <span className="text-red-200 ml-2 text-xs">
                    ({item.category})
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animation-paused {
          animation-play-state: paused !important;
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          @keyframes scroll-left {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        }
      `}</style>
    </div>
  );
}
