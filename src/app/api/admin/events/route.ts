import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';
import { verifyAuth } from '@/lib/auth';

// GET - Fetch all events with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const isActive = searchParams.get('isActive');
    const isFeatured = searchParams.get('isFeatured');
    const upcoming = searchParams.get('upcoming');

    // Build filter query
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (isActive !== null && isActive !== '') {
      filter.isActive = isActive === 'true';
    }
    
    if (isFeatured !== null && isFeatured !== '') {
      filter.isFeatured = isFeatured === 'true';
    }
    
    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
    }

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ date: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
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

// POST - Create new event
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

    // Validate required fields
    if (!title || !description || !date || !time || !location || !category || !organizer) {
      return NextResponse.json(
        { success: false, error: 'Semua field wajib harus diisi' },
        { status: 400 }
      );
    }

    // Handle image upload
    let imageUrl = '';
    if (imageFile && imageFile.size > 0) {
      try {
        // Validate image file
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(imageFile.type)) {
          return NextResponse.json(
            { success: false, error: 'Format gambar tidak didukung. Gunakan JPEG, PNG, WebP, atau GIF.' },
            { status: 400 }
          );
        }

        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (imageFile.size > maxSize) {
          return NextResponse.json(
            { success: false, error: 'Ukuran file terlalu besar. Maksimal 10MB.' },
            { status: 400 }
          );
        }

        // Convert file to base64 data URL for storage
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        imageUrl = `data:${imageFile.type};base64,${base64}`;

      } catch (error) {
        console.error('Error processing image:', error);
        return NextResponse.json(
          { success: false, error: 'Gagal memproses gambar' },
          { status: 400 }
        );
      }
    }

    // Generate slug from title
    const generateSlug = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };

    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await Event.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create event data
    const eventData: any = {
      title,
      description,
      imageUrl,
      slug,
      date: new Date(date),
      time,
      location,
      category,
      organizer,
      isActive,
      isFeatured,
      registrationRequired,
      createdBy: authResult.user?.username
    };

    if (maxParticipants) {
      eventData.maxParticipants = parseInt(maxParticipants);
    }

    if (registrationDeadline) {
      eventData.registrationDeadline = new Date(registrationDeadline);
    }

    if (contactEmail || contactPhone || contactWebsite) {
      eventData.contactInfo = {
        email: contactEmail,
        phone: contactPhone,
        website: contactWebsite
      };
    }

    if (tags) {
      eventData.tags = tags.split(',').map(tag => tag.trim().toLowerCase());
    }

    if (!isFree && priceAmount) {
      eventData.price = {
        amount: parseFloat(priceAmount),
        currency: 'IDR',
        isFree: false
      };
    }

    const event = new Event(eventData);
    await event.save();

    return NextResponse.json({
      success: true,
      message: 'Event berhasil dibuat',
      data: event
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating event:', error);
    
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
      { success: false, error: 'Gagal membuat event' },
      { status: 500 }
    );
  }
}

// PUT - Bulk update events
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

    if (action === 'bulk-status') {
      const { eventIds, isActive } = data;
      
      await Event.updateMany(
        { _id: { $in: eventIds } },
        { isActive }
      );

      return NextResponse.json({
        success: true,
        message: `Status event berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`
      });
    }

    if (action === 'bulk-featured') {
      const { eventIds, isFeatured } = data;
      
      await Event.updateMany(
        { _id: { $in: eventIds } },
        { isFeatured }
      );

      return NextResponse.json({
        success: true,
        message: `Event berhasil ${isFeatured ? 'ditampilkan' : 'disembunyikan'} dari featured`
      });
    }

    return NextResponse.json(
      { success: false, error: 'Aksi tidak valid' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating events:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui event' },
      { status: 500 }
    );
  }
}
