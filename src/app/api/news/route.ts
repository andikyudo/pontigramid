import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import News from '@/models/News';

// GET - Ambil semua berita
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const published = searchParams.get('published');
    const isBreakingNews = searchParams.get('isBreakingNews');
    const sort = searchParams.get('sort') || 'createdAt';
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: Record<string, unknown> = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (published !== null && published !== undefined) {
      query.published = published === 'true';
    }

    if (isBreakingNews !== null && isBreakingNews !== undefined) {
      query.isBreakingNews = isBreakingNews === 'true';
    }

    if (search) {
      // Use regex search for better compatibility and partial matching
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { title: { $regex: searchRegex } },
        { content: { $regex: searchRegex } },
        { excerpt: { $regex: searchRegex } },
        { category: { $regex: searchRegex } }
      ];
    }
    
    // Build sort object
    const sortObj: Record<string, 1 | -1> = {};

    // Priority sorting for breaking news
    if (isBreakingNews === 'true') {
      sortObj.isBreakingNews = -1;
      sortObj.createdAt = -1;
    } else {
      // Default sorting: breaking news first, then by date
      sortObj.isBreakingNews = -1;

      switch (sort) {
        case 'title':
          sortObj.title = 1;
          break;
        case 'category':
          sortObj.category = 1;
          break;
        case 'views':
          sortObj.views = -1;
          break;
        case 'updatedAt':
          sortObj.updatedAt = -1;
          break;
        default:
          sortObj.createdAt = -1;
      }
    }

    // Get news with pagination
    const news = await News.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const total = await News.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      news: news,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data berita' },
      { status: 500 }
    );
  }
}

// POST - Buat berita baru
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      title,
      slug,
      content,
      excerpt,
      category,
      imageUrl,
      published,
      tags,
      seoTitle,
      seoDescription,
      seoKeywords
    } = body;

    // Validasi input
    if (!title || !content || !category) {
      return NextResponse.json(
        { success: false, error: 'Judul, konten, dan kategori wajib diisi' },
        { status: 400 }
      );
    }
    
    // Generate slug if not provided
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Buat berita baru
    const news = new News({
      title,
      slug: finalSlug,
      content,
      excerpt: excerpt || title.substring(0, 150) + '...',
      category,
      author: 'Admin', // Default author
      imageUrl: imageUrl || '',
      published: published || false,
      tags: tags || [],
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt || title,
      seoKeywords: seoKeywords || ''
    });
    
    await news.save();
    
    return NextResponse.json({
      success: true,
      news: news,
      message: 'Berita berhasil dibuat'
    }, { status: 201 });
    
  } catch (error: unknown) {
    console.error('Error creating news:', error);

    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Judul berita sudah ada' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Gagal membuat berita' },
      { status: 500 }
    );
  }
}
