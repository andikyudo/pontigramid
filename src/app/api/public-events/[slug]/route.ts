import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';

// TypeScript interface for MongoDB event document
interface EventDocument {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  date: Date;
  time: string;
  location: string;
  category: string;
  organizer: string;
  slug: string;
  isFeatured: boolean;
  isActive: boolean;
  registrationRequired: boolean;
  maxParticipants?: number;
  registrationDeadline?: Date;
  contactEmail?: string;
  contactPhone?: string;
  contactWebsite?: string;
  tags?: string[];
  price?: {
    amount: number;
    currency: string;
    isFree: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Public API endpoint for single event by slug (no authentication required)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    console.log('Public Event Detail API: Starting...');
    await connectDB();
    console.log('Public Event Detail API: Database connected');

    const params = await context.params;
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug event diperlukan' },
        { status: 400 }
      );
    }

    console.log('Public Event Detail API: Looking for slug:', slug);

    // Find the event
    const event = await Event.findOne({
      slug,
      isActive: true
    }).lean() as unknown as EventDocument;

    if (!event) {
      console.log('Public Event Detail API: Event not found for slug:', slug);
      return NextResponse.json(
        { success: false, error: 'Event tidak ditemukan' },
        { status: 404 }
      );
    }

    console.log('Public Event Detail API: Found event:', event?.title || 'Unknown');

    // Get related events (same category, excluding current event)
    const relatedEvents = await Event.find({
      category: event.category,
      _id: { $ne: event._id },
      isActive: true,
      date: { $gte: new Date() }
    })
    .sort({ date: 1 })
    .limit(3)
    .select('title imageUrl date time location slug')
    .lean() as unknown as EventDocument[];

    console.log('Public Event Detail API: Found', relatedEvents.length, 'related events');

    // Transform event data
    const transformedEvent = {
      _id: event._id.toString(),
      title: event.title,
      description: event.description,
      imageUrl: event.imageUrl,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      organizer: event.organizer,
      slug: event.slug,
      isFeatured: event.isFeatured,
      isActive: event.isActive,
      registrationRequired: event.registrationRequired,
      maxParticipants: event.maxParticipants,
      registrationDeadline: event.registrationDeadline,
      contactEmail: event.contactEmail,
      contactPhone: event.contactPhone,
      contactWebsite: event.contactWebsite,
      tags: event.tags,
      price: event.price,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    };

    // Transform related events
    const transformedRelatedEvents = relatedEvents.map(relatedEvent => ({
      _id: relatedEvent._id.toString(),
      title: relatedEvent.title,
      imageUrl: relatedEvent.imageUrl,
      date: relatedEvent.date,
      time: relatedEvent.time,
      location: relatedEvent.location,
      slug: relatedEvent.slug
    }));

    const response = NextResponse.json({
      success: true,
      data: {
        event: transformedEvent,
        relatedEvents: transformedRelatedEvents
      }
    });

    // Add caching headers for individual event pages
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=600');
    response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=600');

    return response;

  } catch (error) {
    console.error('Public Event Detail API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil data event',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
