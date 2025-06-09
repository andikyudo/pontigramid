import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Advertisement from '@/models/Advertisement';
import { verifyAuth } from '@/lib/auth';
import { compressImage } from '@/lib/imageUtils';

// GET - Fetch single advertisement
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID iklan diperlukan' },
        { status: 400 }
      );
    }

    const advertisement = await Advertisement.findById(id);

    if (!advertisement) {
      return NextResponse.json(
        { success: false, error: 'Iklan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: advertisement
    });

  } catch (error) {
    console.error('Error fetching advertisement:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data iklan' },
      { status: 500 }
    );
  }
}

// PUT - Update advertisement
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID iklan diperlukan' },
        { status: 400 }
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

    // Find existing advertisement
    const existingAd = await Advertisement.findById(id);
    if (!existingAd) {
      return NextResponse.json(
        { success: false, error: 'Iklan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Validate required fields
    if (!title || !placementZone) {
      return NextResponse.json(
        { success: false, error: 'Judul dan zona penempatan wajib diisi' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      title,
      description,
      linkUrl,
      placementZone,
      isActive,
      priority,
      targetAudience
    };

    // Handle image upload if new image provided
    if (imageFile && imageFile.size > 0) {
      try {
        updateData.imageUrl = await compressImage(imageFile, {
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
    }

    // Handle dates
    if (startDate) {
      updateData.startDate = new Date(startDate);
    }

    if (endDate) {
      updateData.endDate = new Date(endDate);
    }

    // Update advertisement
    const updatedAd = await Advertisement.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Iklan berhasil diperbarui',
      data: updatedAd
    });

  } catch (error: any) {
    console.error('Error updating advertisement:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui iklan' },
      { status: 500 }
    );
  }
}

// DELETE - Delete advertisement
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID iklan diperlukan' },
        { status: 400 }
      );
    }

    const advertisement = await Advertisement.findById(id);
    if (!advertisement) {
      return NextResponse.json(
        { success: false, error: 'Iklan tidak ditemukan' },
        { status: 404 }
      );
    }

    await Advertisement.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Iklan berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting advertisement:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus iklan' },
      { status: 500 }
    );
  }
}
