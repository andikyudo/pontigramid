import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';
import { verifyAuth } from '@/lib/auth';
import { compressImage } from '@/lib/imageUtils';

// GET - Fetch single event
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
        { success: false, error: 'ID event diperlukan' },
        { status: 400 }
      );
    }

    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data event' },
      { status: 500 }
    );
  }
}

// PUT - Update event
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
        { success: false, error: 'ID event diperlukan' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const location = formData.get('location') as string;
    const category = formData.get('category') as string;
    const organizer = formData.get('organizer') as string;
    const isActive = formData.get('isActive') === 'true';
    const isFeatured = formData.get('isFeatured') === 'true';
    const registrationRequired = formData.get('registrationRequired') === 'true';
    const maxParticipants = formData.get('maxParticipants') as string;
    const registrationDeadline = formData.get('registrationDeadline') as string;
    const contactEmail = formData.get('contactEmail') as string;
    const contactPhone = formData.get('contactPhone') as string;
    const contactWebsite = formData.get('contactWebsite') as string;
    const tags = formData.get('tags') as string;
    const priceAmount = formData.get('priceAmount') as string;
    const isFree = formData.get('isFree') === 'true';
    const imageFile = formData.get('image') as File;

    // Find existing event
    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Event tidak ditemukan' },
        { status: 404 }
      );
    }

    // Validate required fields
    if (!title || !description || !date || !time || !location || !category || !organizer) {
      return NextResponse.json(
        { success: false, error: 'Semua field wajib harus diisi' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      title,
      description,
      date: new Date(date),
      time,
      location,
      category,
      organizer,
      isActive,
      isFeatured,
      registrationRequired
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

    if (maxParticipants) {
      updateData.maxParticipants = parseInt(maxParticipants);
    }

    if (registrationDeadline) {
      updateData.registrationDeadline = new Date(registrationDeadline);
    }

    if (contactEmail || contactPhone || contactWebsite) {
      updateData.contactInfo = {
        email: contactEmail,
        phone: contactPhone,
        website: contactWebsite
      };
    }

    if (tags) {
      updateData.tags = tags.split(',').map(tag => tag.trim().toLowerCase());
    }

    if (!isFree && priceAmount) {
      updateData.price = {
        amount: parseFloat(priceAmount),
        currency: 'IDR',
        isFree: false
      };
    } else {
      updateData.price = {
        amount: 0,
        currency: 'IDR',
        isFree: true
      };
    }

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Event berhasil diperbarui',
      data: updatedEvent
    });

  } catch (error: any) {
    console.error('Error updating event:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Slug event sudah digunakan' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui event' },
      { status: 500 }
    );
  }
}

// DELETE - Delete event
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
        { success: false, error: 'ID event diperlukan' },
        { status: 400 }
      );
    }

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event tidak ditemukan' },
        { status: 404 }
      );
    }

    await Event.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Event berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus event' },
      { status: 500 }
    );
  }
}
