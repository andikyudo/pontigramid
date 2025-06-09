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
  price?: {
    amount: number;
    currency: string;
    isFree: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Public API endpoint for events (no authentication required)
export async function GET(request: NextRequest) {
  try {
    console.log('Public Events API: Starting...');
    await connectDB();
    console.log('Public Events API: Database connected');

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const upcoming = searchParams.get('upcoming');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query
    const query: Record<string, unknown> = { isActive: true };

    // Add featured filter if specified
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Add upcoming filter if specified
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    console.log('Public Events API: Query:', query);

    // Fetch events
    const events = await Event.find(query)
      .sort({ date: 1, createdAt: -1 })
      .limit(limit)
      .lean() as unknown as EventDocument[];

    console.log('Public Events API: Found', events.length, 'events');

    // Transform events for frontend
    const transformedEvents = events.map(event => ({
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
      price: event.price,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    }));

    const response = NextResponse.json({
      success: true,
      data: transformedEvents,
      count: transformedEvents.length
    });

    // Add caching headers for performance optimization
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=300');
    response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=300');

    return response;

  } catch (error) {
    console.error('Public Events API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch events',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
