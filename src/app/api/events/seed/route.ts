import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Sample events data
    const sampleEvents = [
      {
        title: 'Konferensi Teknologi Pontianak 2024',
        description: 'Event teknologi terbesar di Kalimantan Barat dengan pembicara dari berbagai perusahaan teknologi terkemuka. Membahas tren terbaru dalam AI, blockchain, dan pengembangan web.',
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MCkiLz4KPHN2ZyB4PSIxNzUiIHk9IjEyNSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHA+VGVjaG5vbG9neTwvcD4KPC9zdmc+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDY5MWZmIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzA2NTFmZiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: '09:00',
        location: 'Hotel Mercure Pontianak',
        category: 'teknologi',
        organizer: 'Tech Community Pontianak',
        isActive: true,
        isFeatured: true,
        registrationRequired: true,
        maxParticipants: 200,
        currentParticipants: 0,
        price: {
          amount: 0,
          currency: 'IDR',
          isFree: true
        },
        contactInfo: {
          email: 'info@techpontianak.com',
          phone: '0561-123456'
        },
        tags: ['teknologi', 'ai', 'blockchain', 'web development']
      },
      {
        title: 'Festival Budaya Dayak 2024',
        description: 'Perayaan budaya tradisional Kalimantan Barat dengan pertunjukan tari, musik, dan pameran kerajinan tangan khas Dayak.',
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MCkiLz4KPHN2ZyB4PSIxNzUiIHk9IjEyNSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHA+QnVkYXlhPC9wPgo8L3N2Zz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+CjxzdG9wIHN0b3AtY29sb3I9IiNmNTk3MDAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjU3YzAwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        time: '16:00',
        location: 'Taman Alun Kapuas',
        category: 'budaya',
        organizer: 'Dinas Kebudayaan Pontianak',
        isActive: true,
        isFeatured: true,
        registrationRequired: false,
        price: {
          amount: 0,
          currency: 'IDR',
          isFree: true
        },
        contactInfo: {
          email: 'budaya@pontianak.go.id',
          phone: '0561-654321'
        },
        tags: ['budaya', 'dayak', 'tradisional', 'festival']
      },
      {
        title: 'Workshop Digital Marketing untuk UMKM',
        description: 'Pelatihan strategi pemasaran digital khusus untuk pelaku UMKM di Pontianak. Materi meliputi social media marketing, SEO, dan e-commerce.',
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MCkiLz4KPHN2ZyB4PSIxNzUiIHk9IjEyNSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHA+QmlzbmlzPC9wPgo8L3N2Zz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+CjxzdG9wIHN0b3AtY29sb3I9IiMwNWZmNzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDVmZjUwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        time: '13:00',
        location: 'Gedung DPRD Pontianak',
        category: 'bisnis',
        organizer: 'Kamar Dagang Pontianak',
        isActive: true,
        isFeatured: false,
        registrationRequired: true,
        maxParticipants: 50,
        currentParticipants: 0,
        price: {
          amount: 150000,
          currency: 'IDR',
          isFree: false
        },
        contactInfo: {
          email: 'workshop@kadagpontianak.com',
          phone: '0561-789012'
        },
        tags: ['bisnis', 'umkm', 'digital marketing', 'workshop']
      },
      {
        title: 'Seminar Kesehatan Mental Remaja',
        description: 'Seminar edukasi tentang pentingnya kesehatan mental remaja dengan narasumber psikolog dan dokter spesialis jiwa.',
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MCkiLz4KPHN2ZyB4PSIxNzUiIHk9IjEyNSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHA+S2VzZWhhdGFuPC9wPgo8L3N2Zz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+CjxzdG9wIHN0b3AtY29sb3I9IiNmZjA1NzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmYwNTUwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        time: '14:00',
        location: 'Auditorium UNTAN',
        category: 'kesehatan',
        organizer: 'Fakultas Kedokteran UNTAN',
        isActive: true,
        isFeatured: true,
        registrationRequired: true,
        maxParticipants: 300,
        currentParticipants: 0,
        price: {
          amount: 0,
          currency: 'IDR',
          isFree: true
        },
        contactInfo: {
          email: 'seminar@fk.untan.ac.id',
          phone: '0561-345678'
        },
        tags: ['kesehatan', 'mental health', 'remaja', 'seminar']
      },
      {
        title: 'Pameran Seni Rupa Kontemporer',
        description: 'Pameran karya seni rupa kontemporer dari seniman lokal Kalimantan Barat dengan tema "Harmoni Alam dan Budaya".',
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MCkiLz4KPHN2ZyB4PSIxNzUiIHk9IjEyNSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHA+UGFtZXJhbjwvcD4KPC9zdmc+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgo8c3RvcCBzdG9wLWNvbG9yPSIjZmY5NTA1Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmNzUwNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=',
        date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        time: '10:00',
        location: 'Galeri Seni Pontianak',
        category: 'pameran',
        organizer: 'Komunitas Seniman Pontianak',
        isActive: true,
        isFeatured: true,
        registrationRequired: false,
        price: {
          amount: 25000,
          currency: 'IDR',
          isFree: false
        },
        contactInfo: {
          email: 'pameran@seniman-pontianak.org',
          phone: '0561-456789'
        },
        tags: ['seni', 'pameran', 'kontemporer', 'budaya']
      }
    ];

    // Clear existing events (for testing)
    await Event.deleteMany({});

    // Insert sample events
    const createdEvents = await Event.insertMany(sampleEvents);

    return NextResponse.json({
      success: true,
      message: `${createdEvents.length} sample events created successfully`,
      data: createdEvents
    });

  } catch (error: any) {
    console.error('Error seeding events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed events: ' + error.message },
      { status: 500 }
    );
  }
}
