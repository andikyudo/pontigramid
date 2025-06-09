import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';

// Debug API to check event database connectivity
export async function GET(request: NextRequest) {
  try {
    console.log('Debug Events API: Starting...');
    await connectDB();
    console.log('Debug Events API: Database connected');

    // Get all events (including inactive ones for debugging)
    const allEvents = await Event.find({}).select('title slug isActive date').lean();
    console.log('Debug Events API: Found', allEvents.length, 'total events');

    // Get only active events
    const activeEvents = await Event.find({ isActive: true }).select('title slug isActive date').lean();
    console.log('Debug Events API: Found', activeEvents.length, 'active events');

    // Check for specific event
    const specificEvent = await Event.findOne({ slug: 'lomba-mewarnai-' }).lean();
    console.log('Debug Events API: Specific event found:', specificEvent ? 'YES' : 'NO');

    return NextResponse.json({
      success: true,
      data: {
        totalEvents: allEvents.length,
        activeEvents: activeEvents.length,
        specificEventExists: !!specificEvent,
        allEvents: allEvents.map(event => ({
          title: event.title,
          slug: event.slug,
          isActive: event.isActive,
          date: event.date
        })),
        activeEventsOnly: activeEvents.map(event => ({
          title: event.title,
          slug: event.slug,
          isActive: event.isActive,
          date: event.date
        })),
        specificEvent: specificEvent ? {
          title: (specificEvent as any).title,
          slug: (specificEvent as any).slug,
          isActive: (specificEvent as any).isActive,
          date: (specificEvent as any).date
        } : null
      }
    });

  } catch (error) {
    console.error('Debug Events API Error:', error);
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
