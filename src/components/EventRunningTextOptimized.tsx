'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  date: string;
  time: string;
  location: string;
  category: string;
  organizer: string;
  slug: string;
  isFeatured: boolean;
  price?: {
    amount: number;
    currency: string;
    isFree: boolean;
  };
}

interface EventRunningTextProps {
  enabled?: boolean;
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export default function EventRunningTextOptimized({ 
  enabled = true, 
  speed = 5, 
  pauseOnHover = true,
  className = '' 
}: EventRunningTextProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isManualControl, setIsManualControl] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (enabled) {
      fetchEvents();
    }
  }, [enabled]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isManualControl && events.length > 1) {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
      }, speed * 1000);
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isManualControl, events.length, speed]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      console.log('EventRunningTextOptimized: Fetching events from /api/events...');
      const response = await fetch('/api/events?upcoming=true&limit=10');
      console.log('EventRunningTextOptimized: Response status:', response.status);
      console.log('EventRunningTextOptimized: Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('EventRunningTextOptimized: API Response:', data);

        if (data.success && data.data && Array.isArray(data.data)) {
          console.log('EventRunningTextOptimized: Found', data.data.length, 'real events from database');
          setEvents(data.data); // Only use real events from database
          setHasError(false);
        } else {
          console.log('EventRunningTextOptimized: No real events found in database');
          console.log('EventRunningTextOptimized: Data structure:', {
            success: data.success,
            hasData: !!data.data,
            isArray: Array.isArray(data.data),
            length: data.data?.length
          });
          setEvents([]); // Set empty array if no events
          setHasError(false);
        }
      } else {
        console.error('EventRunningTextOptimized: API request failed with status:', response.status);
        const errorText = await response.text();
        console.error('EventRunningTextOptimized: Error response:', errorText.substring(0, 500));

        // Check if it's a Vercel authentication issue
        if (response.status === 401 || errorText.includes('Authentication Required') || errorText.includes('vercel.com/sso-api')) {
          console.error('EventRunningTextOptimized: Vercel authentication protection detected');
          setEvents([]);
          setHasError(true);
        } else {
          setEvents([]);
          setHasError(true);
        }
      }
    } catch (error) {
      console.error('EventRunningTextOptimized: Error fetching events:', error);
      setEvents([]);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe || isRightSwipe) {
      setIsManualControl(true);
      if (isLeftSwipe) {
        nextSlide();
      } else {
        prevSlide();
      }
      
      setTimeout(() => setIsManualControl(false), 5000);
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  }, [events.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  }, [events.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsManualControl(true);
    setTimeout(() => setIsManualControl(false), 5000);
  };

  const handleImageError = (eventId: string) => {
    setImageErrors(prev => ({ ...prev, [eventId]: true }));
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getDaysUntilEvent = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Besok';
    if (diffDays < 7) return `${diffDays} hari lagi`;
    return `${Math.ceil(diffDays / 7)} minggu lagi`;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      teknologi: 'from-blue-500 to-cyan-600',
      budaya: 'from-orange-500 to-red-500',
      bisnis: 'from-emerald-500 to-teal-600',
      kesehatan: 'from-red-500 to-pink-600',
      pendidikan: 'from-purple-500 to-violet-600',
      olahraga: 'from-orange-500 to-red-600',
      hiburan: 'from-pink-500 to-purple-600',
      pameran: 'from-amber-500 to-yellow-600',
      konferensi: 'from-indigo-500 to-blue-600',
      seminar: 'from-green-500 to-emerald-600',
      workshop: 'from-violet-500 to-purple-600',
      festival: 'from-yellow-500 to-orange-500',
      lainnya: 'from-slate-500 to-gray-600'
    };
    return colors[category] || colors.lainnya;
  };

  // Don't render if not enabled
  if (!enabled) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-black backdrop-blur-sm border-b border-slate-600/50 ${className}`}>
        <div className="flex items-center px-4 py-3 sm:py-4">
          <div className="flex-shrink-0 mr-3 sm:mr-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-slate-700 animate-pulse"></div>
          </div>
          <div className="flex-1">
            <div className="h-4 bg-slate-700 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-slate-700 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-r from-yellow-800 via-yellow-900 to-black backdrop-blur-sm border-b border-yellow-600/50 ${className}`}>
        <div className="flex items-center px-4 py-3 sm:py-4">
          <div className="flex-shrink-0 mr-3 sm:mr-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-yellow-700 flex items-center justify-center">
              <span className="text-white text-lg">🔒</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm sm:text-base mb-1">
              Event API Terlindungi
            </h3>
            <p className="text-yellow-200 text-xs sm:text-sm">
              API event sedang dalam mode pengembangan. Event akan ditampilkan setelah konfigurasi selesai.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state when no events available
  if (events.length === 0) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-black backdrop-blur-sm border-b border-slate-600/50 ${className}`}>
        <div className="flex items-center px-4 py-3 sm:py-4">
          <div className="flex-shrink-0 mr-3 sm:mr-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-slate-700 flex items-center justify-center">
              <span className="text-white text-lg">📅</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm sm:text-base mb-1">
              Belum Ada Event
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              Saat ini belum ada event yang tersedia. Pantau terus untuk update terbaru!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentEvent = events[currentIndex];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-black backdrop-blur-sm border-b border-slate-600/50 ${className}`}>
      {/* Compact Mobile-Optimized Container */}
      <div 
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Event Content - Compact Design */}
        <div className="flex items-center px-4 py-3 sm:py-4">
          {/* Event Image - Dynamic Images Priority */}
          <div className="flex-shrink-0 mr-3 sm:mr-4">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden">
              {currentEvent.imageUrl && !imageErrors[currentEvent._id] ? (
                currentEvent.imageUrl.startsWith('data:') ? (
                  <img
                    src={currentEvent.imageUrl}
                    alt={currentEvent.title}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(currentEvent._id)}
                  />
                ) : (
                  <Image
                    src={currentEvent.imageUrl}
                    alt={currentEvent.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                    onError={() => handleImageError(currentEvent._id)}
                  />
                )
              ) : (
                // Dynamic gradient background instead of calendar icon
                <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(currentEvent.category)} flex items-center justify-center relative`}>
                  {/* Category-specific icon instead of calendar */}
                  <div className="text-white/90 text-lg sm:text-xl font-bold">
                    {currentEvent.category === 'teknologi' && '💻'}
                    {currentEvent.category === 'budaya' && '🎭'}
                    {currentEvent.category === 'bisnis' && '💼'}
                    {currentEvent.category === 'kesehatan' && '🏥'}
                    {currentEvent.category === 'pendidikan' && '🎓'}
                    {currentEvent.category === 'olahraga' && '⚽'}
                    {currentEvent.category === 'hiburan' && '🎪'}
                    {currentEvent.category === 'pameran' && '🖼️'}
                    {currentEvent.category === 'konferensi' && '🎤'}
                    {currentEvent.category === 'seminar' && '📚'}
                    {currentEvent.category === 'workshop' && '🔧'}
                    {currentEvent.category === 'festival' && '🎉'}
                    {!['teknologi', 'budaya', 'bisnis', 'kesehatan', 'pendidikan', 'olahraga', 'hiburan', 'pameran', 'konferensi', 'seminar', 'workshop', 'festival'].includes(currentEvent.category) && '📅'}
                  </div>
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 bg-white/10 bg-opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`
                  }}></div>
                </div>
              )}

              {/* Featured Badge */}
              {currentEvent.isFeatured && (
                <div className="absolute -top-1 -right-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current drop-shadow-sm" />
                </div>
              )}
            </div>
          </div>

          {/* Event Details - Responsive Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 mr-2">
                <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-1 mb-1">
                  {currentEvent.title}
                </h3>
                
                <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatEventDate(currentEvent.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{currentEvent.time}</span>
                  </div>
                  <div className="hidden sm:flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{currentEvent.location}</span>
                  </div>
                </div>

                <div className="mt-1 flex items-center space-x-2">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(currentEvent.category)} text-white shadow-sm`}>
                    {currentEvent.category.charAt(0).toUpperCase() + currentEvent.category.slice(1)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {getDaysUntilEvent(currentEvent.date)}
                  </span>
                  {currentEvent.price && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      currentEvent.price.isFree 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {currentEvent.price.isFree ? 'Gratis' : `Rp ${currentEvent.price.amount.toLocaleString()}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={prevSlide}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Previous event"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Next event"
                >
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {events.slice(0, Math.min(5, events.length)).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentIndex % events.length
                  ? 'bg-white'
                  : 'bg-white/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
          {events.length > 5 && (
            <span className="text-white/50 text-xs ml-1">+{events.length - 5}</span>
          )}
        </div>

        {/* Link Overlay */}
        <Link
          href={`/event/${currentEvent.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`View ${currentEvent.title}`}
        />
      </div>
    </div>
  );
}
