import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Advertisement from '@/models/Advertisement';
import { verifyAuth } from '@/lib/auth';
import { compressImage } from '@/lib/imageUtils';

interface AdvertisementFilter {
  $or?: Array<{
    title?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
  }>;
  placementZone?: string;
  isActive?: boolean;
}

// GET - Fetch all advertisements with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const placementZone = searchParams.get('placementZone') || '';
    const isActive = searchParams.get('isActive');

    // Build filter query
    const filter: AdvertisementFilter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (placementZone) {
      filter.placementZone = placementZone;
    }
    
    if (isActive !== null && isActive !== '') {
      filter.isActive = isActive === 'true';
    }

    const skip = (page - 1) * limit;

    const [advertisements, total] = await Promise.all([
      Advertisement.find(filter)
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Advertisement.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      data: advertisements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching advertisements:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data iklan' },
      { status: 500 }
    );
  }
}

// POST - Create new advertisement
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const linkUrl = formData.get('linkUrl') as string;
    const placementZone = formData.get('placementZone') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const isActive = formData.get('isActive') === 'true';
    const priority = parseInt(formData.get('priority') as string) || 1;
    const targetAudience = formData.get('targetAudience') as string;
    const imageFile = formData.get('image') as File;

    // Validate required fields
    if (!title || !placementZone) {
      return NextResponse.json(
        { success: false, error: 'Judul dan zona penempatan wajib diisi' },
        { status: 400 }
      );
    }

    let imageUrl = '';
    if (imageFile && imageFile.size > 0) {
      try {
        imageUrl = await compressImage(imageFile, {
          maxWidth: 1200,
          maxHeight: 800,
          quality: 0.8
        });
      } catch (error) {
        console.error('Error compressing image:', error);
        return NextResponse.json(
          { success: false, error: 'Gagal memproses gambar' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Gambar iklan wajib diupload' },
        { status: 400 }
      );
    }

    // Create advertisement data
    const advertisementData = {
      title,
      description,
      imageUrl,
      linkUrl,
      placementZone,
      isActive,
      priority,
      targetAudience,
      createdBy: authResult.user?.username
    };

    if (startDate) {
      advertisementData.startDate = new Date(startDate);
    }

    if (endDate) {
      advertisementData.endDate = new Date(endDate);
    }

    const advertisement = new Advertisement(advertisementData);
    await advertisement.save();

    return NextResponse.json({
      success: true,
      message: 'Iklan berhasil dibuat',
      data: advertisement
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Error creating advertisement:', error);

    if (error instanceof Error && error.name === 'ValidationError') {
      const validationError = error as any; // MongoDB validation error type
      const errors = Object.values(validationError.errors).map((err: any) => (err as any).message);
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Gagal membuat iklan' },
      { status: 500 }
    );
  }
}

// PUT - Bulk update advertisements (reorder, bulk status change)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const { action, data } = await request.json();

    if (action === 'reorder') {
      // Reorder advertisements by priority
      const { adIds } = data;
      
      const bulkOps = adIds.map((id: string, index: number) => ({
        updateOne: {
          filter: { _id: id },
          update: { priority: adIds.length - index }
        }
      }));
      
      await Advertisement.bulkWrite(bulkOps);

      return NextResponse.json({
        success: true,
        message: 'Urutan iklan berhasil diperbarui'
      });
    }

    if (action === 'bulk-status') {
      // Bulk update status
      const { adIds, isActive } = data;
      
      await Advertisement.updateMany(
        { _id: { $in: adIds } },
        { isActive }
      );

      return NextResponse.json({
        success: true,
        message: `Status iklan berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`
      });
    }

    return NextResponse.json(
      { success: false, error: 'Aksi tidak valid' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating advertisements:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui iklan' },
      { status: 500 }
    );
  }
}
