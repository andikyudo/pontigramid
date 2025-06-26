import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import News from '@/models/News';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 INCREMENT VIEW - Request received');
    
    await connectDB();
    console.log('✅ Database connected');

    const body = await request.json();
    const { articleSlug } = body;
    
    console.log('📰 Incrementing view for article:', articleSlug);

    if (!articleSlug) {
      return NextResponse.json(
        { success: false, error: 'Article slug is required' },
        { status: 400 }
      );
    }

    // Find and increment the article view count
    const updatedArticle = await News.findOneAndUpdate(
      { slug: articleSlug },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updatedArticle) {
      console.log('❌ Article not found:', articleSlug);
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    console.log('📈 View count updated to:', updatedArticle.views);

    return NextResponse.json({
      success: true,
      message: '🎉 View count incremented successfully!',
      data: {
        articleSlug: updatedArticle.slug,
        articleTitle: updatedArticle.title,
        newViewCount: updatedArticle.views,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error incrementing view:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: '🚀 INCREMENT VIEW endpoint is ready!',
    info: 'Use POST method with articleSlug to increment view count',
    timestamp: new Date().toISOString()
  });
}
