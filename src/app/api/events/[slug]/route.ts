import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';

// GET - Fetch single event by slug
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const params = await context.params;
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug event diperlukan' },
        { status: 400 }
      );
    }

    const event = await Event.findOne({
      slug,
      isActive: true
    }).lean();

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event tidak ditemukan' },
        { status: 404 }
      );
    }

    // Get related events (same category, excluding current event)
    const relatedEvents = await Event.find({
      category: (event as any).category,
      _id: { $ne: (event as any)._id },
      isActive: true,
      date: { $gte: new Date() }
    })
    .sort({ date: 1 })
    .limit(3)
    .select('title imageUrl date time location slug')
    .lean();

    return NextResponse.json({
      success: true,
      data: {
        event,
        relatedEvents
      }
    });

  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data event' },
      { status: 500 }
    );
  }
}
