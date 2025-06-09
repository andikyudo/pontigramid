'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, Tag, ExternalLink } from 'lucide-react';
import { formatDateShort } from '@/lib/utils';

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
  tags: string[];
}

interface EventCardsProps {
  featured?: boolean;
  limit?: number;
  category?: string;
  className?: string;
}

export default function EventCards({ 
  featured = false, 
  limit = 6, 
  category = '', 
  className = '' 
}: EventCardsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchEvents();
  }, [featured, limit, category]);

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        upcoming: 'true'
      });
      
      if (featured) {
        params.append('featured', 'true');
      }
      
      if (category) {
        params.append('category', category);
      }

      const response = await fetch(`/api/events?${params}`);
      const data = await response.json();
      
      if (data.success) {
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

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      konferensi: 'bg-blue-100 text-blue-800',
      seminar: 'bg-green-100 text-green-800',
      workshop: 'bg-purple-100 text-purple-800',
      pameran: 'bg-orange-100 text-orange-800',
      festival: 'bg-pink-100 text-pink-800',
      olahraga: 'bg-red-100 text-red-800',
      budaya: 'bg-yellow-100 text-yellow-800',
      pendidikan: 'bg-indigo-100 text-indigo-800',
      teknologi: 'bg-cyan-100 text-cyan-800',
      bisnis: 'bg-emerald-100 text-emerald-800',
      kesehatan: 'bg-teal-100 text-teal-800',
      lainnya: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.lainnya;
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} minggu lagi`;
    return `${Math.ceil(diffDays / 30)} bulan lagi`;
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: limit }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Belum Ada Event
        </h3>
        <p className="text-gray-500">
          {featured ? 'Belum ada event unggulan' : 'Belum ada event yang tersedia'}
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {events.map((event) => (
        <Link
          key={event._id}
          href={`/event/${event.slug}`}
          className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          {/* Event Image */}
          <div className="relative h-48 overflow-hidden">
            {event.imageUrl && !imageErrors[event._id] ? (
              event.imageUrl.startsWith('data:') ? (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => handleImageError(event._id)}
                  loading="lazy"
                />
              ) : (
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={() => handleImageError(event._id)}
                />
              )
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <Calendar className="w-16 h-16 text-blue-400" />
              </div>
            )}

            {/* Featured Badge */}
            {event.isFeatured && (
              <div className="absolute top-3 left-3">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Unggulan
                </span>
              </div>
            )}

            {/* Countdown Badge */}
            <div className="absolute top-3 right-3">
              <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {getDaysUntilEvent(event.date)}
              </span>
            </div>

            {/* Price Badge */}
            {event.price && (
              <div className="absolute bottom-3 right-3">
                <span className={`text-xs px-2 py-1 rounded ${
                  event.price.isFree 
                    ? 'bg-green-500 text-white' 
                    : 'bg-yellow-500 text-black'
                }`}>
                  {event.price.isFree ? 'Gratis' : `Rp ${event.price.amount.toLocaleString()}`}
                </span>
              </div>
            )}
          </div>

          {/* Event Content */}
          <div className="p-4">
            {/* Category */}
            <div className="mb-2">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {event.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {event.description}
            </p>

            {/* Event Details */}
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatEventDate(event.date)}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{event.time} WIB</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
              
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span className="line-clamp-1">{event.organizer}</span>
              </div>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {event.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
                {event.tags.length > 3 && (
                  <span className="text-xs text-gray-400">
                    +{event.tags.length - 3} lainnya
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
