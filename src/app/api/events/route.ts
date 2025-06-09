import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';

// GET - Fetch active events for public display
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || '';
    const featured = searchParams.get('featured');
    const upcoming = searchParams.get('upcoming');
    const search = searchParams.get('search') || '';

    // Build filter query
    const filter: any = {
      isActive: true
    };
    
    if (category) {
      filter.category = category;
    }
    
    if (featured === 'true') {
      filter.isFeatured = true;
    }
    
    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ date: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title description imageUrl date time location category organizer slug isFeatured price tags')
        .lean(),
      Event.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      data: events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data event' },
      { status: 500 }
    );
  }
}
