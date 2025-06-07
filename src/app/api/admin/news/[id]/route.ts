import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import News from '@/models/News';

// GET single news article
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const news = await News.findById(id);

    if (!news) {
      return NextResponse.json(
        { success: false, error: 'News not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      news
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update news article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const { title, content, excerpt, category, author, imageUrl, status, isBreakingNews } = body;

    // Validation
    if (!title || !content || !excerpt || !category || !author) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const updateData = {
      title,
      content,
      excerpt,
      category,
      author,
      imageUrl: imageUrl || '',
      slug,
      published: status === 'published',
      isBreakingNews: isBreakingNews || false,
      updatedAt: new Date()
    };

    const result = await News.findByIdAndUpdate(id, updateData, { new: true });

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'News not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'News updated successfully',
      news: result
    });

  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE news article
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    // First check if the news exists using Mongoose
    const existingNews = await News.findById(id);

    if (!existingNews) {
      return NextResponse.json(
        { success: false, error: 'News not found' },
        { status: 404 }
      );
    }

    // Delete the news using Mongoose
    const result = await News.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete news' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'News deleted successfully',
      deletedNews: {
        id: result._id,
        title: result.title
      }
    });

  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
