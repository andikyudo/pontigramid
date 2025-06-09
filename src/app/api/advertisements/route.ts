import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Advertisement from '@/models/Advertisement';

// GET - Fetch active advertisements for public display
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const placementZone = searchParams.get('zone');
    const limit = parseInt(searchParams.get('limit') || '5');

    if (!placementZone) {
      return NextResponse.json(
        { success: false, error: 'Zona penempatan diperlukan' },
        { status: 400 }
      );
    }

    // Get active advertisements for the specified placement zone
    const now = new Date();
    const advertisements = await Advertisement.find({
      placementZone,
      isActive: true,
      $or: [
        { startDate: { $lte: now }, endDate: { $gte: now } },
        { startDate: { $lte: now }, endDate: null },
        { startDate: null, endDate: { $gte: now } },
        { startDate: null, endDate: null }
      ]
    })
    .sort({ priority: -1, createdAt: -1 })
    .limit(limit)
    .select('title description imageUrl linkUrl placementZone priority')
    .lean();

    // Increment impression count for displayed ads
    if (advertisements.length > 0) {
      const adIds = advertisements.map(ad => ad._id);
      await Advertisement.updateMany(
        { _id: { $in: adIds } },
        { $inc: { impressionCount: 1 } }
      );
    }

    return NextResponse.json({
      success: true,
      data: advertisements
    });

  } catch (error) {
    console.error('Error fetching advertisements:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data iklan' },
      { status: 500 }
    );
  }
}

// POST - Track advertisement click
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { adId } = await request.json();

    if (!adId) {
      return NextResponse.json(
        { success: false, error: 'ID iklan diperlukan' },
        { status: 400 }
      );
    }

    // Increment click count
    const advertisement = await Advertisement.findByIdAndUpdate(
      adId,
      { $inc: { clickCount: 1 } },
      { new: true }
    );

    if (!advertisement) {
      return NextResponse.json(
        { success: false, error: 'Iklan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Klik berhasil dicatat'
    });

  } catch (error) {
    console.error('Error tracking advertisement click:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mencatat klik' },
      { status: 500 }
    );
  }
}
