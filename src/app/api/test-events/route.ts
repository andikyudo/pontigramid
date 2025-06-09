import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';

// Simple test endpoint to debug event fetching
export async function GET(request: NextRequest) {
  try {
    console.log('Test Events API: Starting...');
    await connectDB();
    console.log('Test Events API: Database connected');

    // Get all events without filters first
    const allEvents = await Event.find({}).lean();
    console.log('Test Events API: Found', allEvents.length, 'total events');

    // Get active events
    const activeEvents = await Event.find({ isActive: true }).lean();
    console.log('Test Events API: Found', activeEvents.length, 'active events');

    // Get featured events
    const featuredEvents = await Event.find({ 
      isActive: true, 
      isFeatured: true 
    }).lean();
    console.log('Test Events API: Found', featuredEvents.length, 'featured events');

    // Get upcoming events
    const upcomingEvents = await Event.find({ 
      isActive: true, 
      date: { $gte: new Date() } 
    }).lean();
    console.log('Test Events API: Found', upcomingEvents.length, 'upcoming events');

    // Get featured + upcoming events (what the component needs)
    const targetEvents = await Event.find({ 
      isActive: true, 
      isFeatured: true,
      date: { $gte: new Date() } 
    }).lean();
    console.log('Test Events API: Found', targetEvents.length, 'featured + upcoming events');

    return NextResponse.json({
      success: true,
      debug: {
        totalEvents: allEvents.length,
        activeEvents: activeEvents.length,
        featuredEvents: featuredEvents.length,
        upcomingEvents: upcomingEvents.length,
        targetEvents: targetEvents.length,
        currentDate: new Date().toISOString()
      },
      data: {
        all: allEvents.map(e => ({
          _id: e._id,
          title: e.title,
          date: e.date,
          isActive: e.isActive,
          isFeatured: e.isFeatured,
          slug: e.slug
        })),
        target: targetEvents.map(e => ({
          _id: e._id,
          title: e.title,
          date: e.date,
          isActive: e.isActive,
          isFeatured: e.isFeatured,
          slug: e.slug
        }))
      }
    });

  } catch (error) {
    console.error('Test Events API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
