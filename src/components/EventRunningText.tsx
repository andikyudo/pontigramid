'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Star, Zap, ArrowRight } from 'lucide-react';

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

export default function EventRunningText({ 
  enabled = true, 
  speed = 50, 
  pauseOnHover = true,
  className = '' 
}: EventRunningTextProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (enabled) {
      fetchEvents();
    }
  }, [enabled]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events?featured=true&upcoming=true&limit=10');
      const data = await response.json();
      
      if (data.success && data.data) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
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
      konferensi: 'from-blue-500 to-blue-600',
      seminar: 'from-green-500 to-green-600',
      workshop: 'from-purple-500 to-purple-600',
      pameran: 'from-orange-500 to-orange-600',
      festival: 'from-pink-500 to-pink-600',
      olahraga: 'from-red-500 to-red-600',
      budaya: 'from-yellow-500 to-yellow-600',
      pendidikan: 'from-indigo-500 to-indigo-600',
      teknologi: 'from-cyan-500 to-cyan-600',
      bisnis: 'from-emerald-500 to-emerald-600',
      kesehatan: 'from-teal-500 to-teal-600',
      lainnya: 'from-gray-500 to-gray-600'
    };
    return colors[category] || colors.lainnya;
  };

  if (!enabled || loading || events.length === 0) {
    return null;
  }

  // Duplicate events for seamless scrolling
  const duplicatedEvents = [...events, ...events];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10"></div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-6 py-3 border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Event Unggulan</h3>
            <p className="text-gray-300 text-sm">Jangan lewatkan event menarik ini!</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-gray-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{events.length} Event Mendatang</span>
        </div>
      </div>

      {/* Scrolling Events */}
      <div 
        className="relative py-4"
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        <div
          ref={scrollRef}
          className={`flex space-x-6 ${isPaused ? '' : 'animate-scroll'}`}
          style={{
            '--scroll-speed': `${speed}s`,
            animationDuration: `${speed}s`,
          } as React.CSSProperties}
        >
          {duplicatedEvents.map((event, index) => (
            <Link
              key={`${event._id}-${index}`}
              href={`/event/${event.slug}`}
              className="flex-shrink-0 group"
            >
              <div className="relative w-80 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/10">
                {/* Featured Badge */}
                {event.isFeatured && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      <Star className="w-3 h-3" />
                      <span>Unggulan</span>
                    </div>
                  </div>
                )}

                {/* Countdown Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-gray-600/50">
                    {getDaysUntilEvent(event.date)}
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-32 overflow-hidden">
                  {event.imageUrl && !imageErrors[event._id] ? (
                    event.imageUrl.startsWith('data:') ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => handleImageError(event._id)}
                        loading="lazy"
                      />
                    ) : (
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="320px"
                        onError={() => handleImageError(event._id)}
                      />
                    )
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(event.category)} flex items-center justify-center`}>
                      <Calendar className="w-12 h-12 text-white/80" />
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Category */}
                  <div className="mb-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(event.category)} text-white`}>
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-white font-bold text-sm mb-2 line-clamp-2 group-hover:text-red-400 transition-colors duration-300">
                    {event.title}
                  </h4>

                  {/* Event Details */}
                  <div className="space-y-1 text-xs text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3 text-red-400" />
                      <span>{formatEventDate(event.date)}</span>
                      <Clock className="w-3 h-3 text-red-400 ml-2" />
                      <span>{event.time} WIB</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  {/* Price */}
                  {event.price && (
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        event.price.isFree 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {event.price.isFree ? 'Gratis' : `Rp ${event.price.amount.toLocaleString()}`}
                      </span>
                    </div>
                  )}

                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-4 h-4 text-red-400" />
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll var(--scroll-speed) linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
