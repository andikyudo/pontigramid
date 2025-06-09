import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdDisplay from '@/components/AdDisplay';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign, 
  Star, 
  Share2, 
  ArrowLeft,
  Phone,
  Mail,
  Globe
} from 'lucide-react';

interface EventData {
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
  isActive: boolean;
  registrationRequired: boolean;
  maxParticipants?: number;
  registrationDeadline?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWebsite?: string;
  tags?: string[];
  price?: {
    amount: number;
    currency: string;
    isFree: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

async function getEvent(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                   'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/public-events/${slug}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch event: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    if (!data.success) {
      console.error('API returned error:', data.error);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const eventData = await getEvent(slug);
  
  if (!eventData) {
    return {
      title: 'Event Tidak Ditemukan - Pontigram',
      description: 'Event yang Anda cari tidak ditemukan.'
    };
  }

  const { event } = eventData;
  
  return {
    title: `${event.title} - Pontigram`,
    description: event.description.substring(0, 160),
    openGraph: {
      title: event.title,
      description: event.description,
      images: event.imageUrl ? [event.imageUrl] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description,
      images: event.imageUrl ? [event.imageUrl] : [],
    }
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const eventData = await getEvent(slug);

  if (!eventData) {
    notFound();
  }

  const { event, relatedEvents } = eventData;

  // Generate JSON-LD structured data for SEO
  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "startDate": event.date,
    "location": {
      "@type": "Place",
      "name": event.location || "TBA",
      "address": event.location || "TBA"
    },
    "organizer": {
      "@type": "Organization",
      "name": event.organizer || "Pontigram"
    },
    "image": event.imageUrl || "",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://pontigram.com'}/event/${event.slug}`,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
  };

  if (event.price) {
    jsonLd["offers"] = {
      "@type": "Offer",
      "price": event.price.isFree ? "0" : event.price.amount.toString(),
      "priceCurrency": event.price.currency || "IDR",
      "availability": "https://schema.org/InStock"
    };
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Tanggal tidak valid';
      }
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Tanggal tidak valid';
    }
  };

  const getDaysUntilEvent = (dateString: string) => {
    try {
      const eventDate = new Date(dateString);
      if (isNaN(eventDate.getTime())) {
        return 'Tanggal tidak valid';
      }

      const now = new Date();
      const diffTime = eventDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Hari ini';
      if (diffDays === 1) return 'Besok';
      if (diffDays < 0) {
        const pastDays = Math.abs(diffDays);
        if (pastDays === 1) return 'Kemarin';
        if (pastDays < 7) return `${pastDays} hari yang lalu`;
        return `${Math.ceil(pastDays / 7)} minggu yang lalu`;
      }
      if (diffDays < 7) return `${diffDays} hari lagi`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} minggu lagi`;
      return `${Math.ceil(diffDays / 30)} bulan lagi`;
    } catch (error) {
      console.error('Error calculating days until event:', error);
      return 'Tanggal tidak valid';
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Waktu belum ditentukan';
    try {
      // Handle both HH:MM and HH:MM:SS formats
      const timeParts = timeString.split(':');
      if (timeParts.length >= 2) {
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        if (!isNaN(hours) && !isNaN(minutes)) {
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
      }
      return timeString;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString || 'Waktu tidak valid';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      teknologi: 'bg-blue-500',
      budaya: 'bg-orange-500',
      bisnis: 'bg-emerald-500',
      kesehatan: 'bg-red-500',
      pendidikan: 'bg-purple-500',
      olahraga: 'bg-orange-600',
      hiburan: 'bg-pink-500',
      pameran: 'bg-amber-500',
      konferensi: 'bg-indigo-500',
      seminar: 'bg-green-500',
      workshop: 'bg-violet-500',
      festival: 'bg-yellow-500',
      lainnya: 'bg-gray-500'
    };
    return colors[category] || colors.lainnya;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/#events" className="hover:text-blue-600">Event</Link>
            <span>/</span>
            <span className="text-gray-900">{event.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Back Button */}
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>

            {/* Event Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              {/* Event Image */}
              {event.imageUrl && (
                <div className="relative h-64 sm:h-80 lg:h-96">
                  {event.imageUrl.startsWith('data:') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                  
                  {/* Featured Badge */}
                  {event.isFeatured && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>Unggulan</span>
                      </div>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`${getCategoryColor(event.category)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </span>
                  </div>
                </div>
              )}

              {/* Event Content */}
              <div className="p-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h1>

                {/* Event Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{formatDate(event.date)}</p>
                      <p className="text-sm">{getDaysUntilEvent(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-600">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{formatTime(event.time)} WIB</p>
                      <p className="text-sm">Waktu Indonesia Barat</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{event.location || 'Lokasi belum ditentukan'}</p>
                      <p className="text-sm">Lokasi Event</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-600">
                    <Users className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{event.organizer || 'Penyelenggara belum ditentukan'}</p>
                      <p className="text-sm">Penyelenggara</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                {event.price && (
                  <div className="mb-6">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-lg">
                          {event.price.isFree ? (
                            <span className="text-green-600">Gratis</span>
                          ) : (
                            <span className="text-gray-900">
                              Rp {event.price.amount.toLocaleString('id-ID')}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">Harga Tiket</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Deskripsi Event</h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </div>
                </div>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Advertisement */}
            <div className="mb-6">
              <AdDisplay zone="content" limit={1} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Contact Information */}
              {(event.contactEmail || event.contactPhone || event.contactWebsite) && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Kontak</h3>
                  <div className="space-y-3">
                    {event.contactEmail && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-blue-500" />
                        <a 
                          href={`mailto:${event.contactEmail}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {event.contactEmail}
                        </a>
                      </div>
                    )}
                    
                    {event.contactPhone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-green-500" />
                        <a 
                          href={`tel:${event.contactPhone}`}
                          className="text-green-600 hover:text-green-800"
                        >
                          {event.contactPhone}
                        </a>
                      </div>
                    )}
                    
                    {event.contactWebsite && (
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-purple-500" />
                        <a 
                          href={event.contactWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Registration Info */}
              {event.registrationRequired && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Informasi Pendaftaran</h3>
                  <div className="space-y-2 text-blue-800">
                    {event.maxParticipants && (
                      <p className="text-sm">
                        <span className="font-medium">Maksimal Peserta:</span> {event.maxParticipants} orang
                      </p>
                    )}
                    {event.registrationDeadline && (
                      <p className="text-sm">
                        <span className="font-medium">Batas Pendaftaran:</span> {formatDate(event.registrationDeadline)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bagikan Event</h3>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Bagikan</span>
                </button>
              </div>

              {/* Related Events */}
              {relatedEvents && relatedEvents.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Terkait</h3>
                  <div className="space-y-4">
                    {relatedEvents.map((relatedEvent: EventData) => (
                      <Link
                        key={relatedEvent._id}
                        href={`/event/${relatedEvent.slug}`}
                        className="block group"
                      >
                        <div className="flex space-x-3">
                          {relatedEvent.imageUrl && (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              {relatedEvent.imageUrl.startsWith('data:') ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={relatedEvent.imageUrl}
                                  alt={relatedEvent.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Image
                                  src={relatedEvent.imageUrl}
                                  alt={relatedEvent.title}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              )}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                              {relatedEvent.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(relatedEvent.date)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Sidebar Advertisement */}
              <AdDisplay zone="sidebar" limit={2} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
