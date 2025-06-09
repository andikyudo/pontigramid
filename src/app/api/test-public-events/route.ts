import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';

// Simple test API to check if events exist
export async function GET(request: NextRequest) {
  try {
    console.log('Test Public Events API: Starting...');
    await connectDB();
    console.log('Test Public Events API: Database connected');

    // Get all events (including inactive ones for debugging)
    const allEvents = await Event.find({}).select('title slug isActive date').lean();
    console.log('Test Public Events API: Found', allEvents.length, 'total events');

    // Get only active events
    const activeEvents = await Event.find({ isActive: true }).select('title slug isActive date').lean();
    console.log('Test Public Events API: Found', activeEvents.length, 'active events');

    return NextResponse.json({
      success: true,
      data: {
        totalEvents: allEvents.length,
        activeEvents: activeEvents.length,
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
        }))
      }
    });

  } catch (error) {
    console.error('Test Public Events API Error:', error);
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
