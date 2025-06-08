import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { createSlug } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const author = searchParams.get('author') || '';
    
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter: Record<string, unknown> = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (status) {
      if (status === 'published') {
        filter.published = true;
      } else if (status === 'draft') {
        filter.published = false;
      }
    }
    
    if (author) {
      filter.author = { $regex: author, $options: 'i' };
    }
    
    // Get total count
    const total = await db.collection('news').countDocuments(filter);
    
    // Get news with pagination
    const news = await db.collection('news')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    return NextResponse.json({
      success: true,
      news: news,
      data: news, // Keep for backward compatibility
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching admin news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    const { title, content, excerpt, category, author, imageUrl, status, isBreakingNews } = body;
    
    // Validation
    if (!title || !content || !excerpt || !category || !author) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create slug
    const slug = createSlug(title);
    
    // Check if slug already exists
    const existingNews = await db.collection('news').findOne({ slug });
    if (existingNews) {
      return NextResponse.json(
        { success: false, error: 'News with this title already exists' },
        { status: 400 }
      );
    }
    
    const newsData = {
      title,
      content,
      excerpt,
      category,
      author,
      imageUrl: imageUrl || '',
      slug,
      published: status === 'published',
      isBreakingNews: isBreakingNews || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const result = await db.collection('news').insertOne(newsData);
    
    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newsData }
    });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create news' },
      { status: 500 }
    );
  }
}
