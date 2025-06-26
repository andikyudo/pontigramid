import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ArticleView from '@/models/ArticleView';
import News from '@/models/News';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Test database connection
    const newsCount = await News.countDocuments();
    const viewsCount = await ArticleView.countDocuments();
    
    // Get sample data
    const sampleNews = await News.findOne().lean();
    const sampleView = await ArticleView.findOne().lean();
    
    return NextResponse.json({
      success: true,
      data: {
        newsCount,
        viewsCount,
        sampleNews: sampleNews ? {
          title: (sampleNews as any).title,
          slug: (sampleNews as any).slug,
          views: (sampleNews as any).views || 0
        } : null,
        sampleView: sampleView ? {
          articleSlug: (sampleView as any).articleSlug,
          ipAddress: (sampleView as any).ipAddress?.substring(0, 8) + '***',
          viewedAt: (sampleView as any).viewedAt,
          location: (sampleView as any).location
        } : null
      }
    });

  } catch (error) {
    console.error('Test analytics error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { articleSlug = 'test-article' } = body;

    // Create a test view record
    const testView = new ArticleView({
      articleId: '507f1f77bcf86cd799439011', // dummy ObjectId
      articleSlug,
      articleTitle: 'Test Article',
      articleCategory: 'test',
      articleAuthor: 'Test Author',
      visitorId: 'test-visitor-' + Date.now(),
      ipAddress: '127.0.0.1',
      userAgent: 'Test User Agent',
      sessionId: 'test-session-' + Date.now(),
      viewDuration: 30,
      isUniqueView: true,
      location: {
        country: 'Indonesia',
        region: 'Kalimantan Barat',
        city: 'Pontianak',
        district: 'Pontianak Kota'
      },
      device: {
        type: 'desktop',
        os: 'Test OS',
        browser: 'Test Browser'
      },
      viewedAt: new Date()
    });

    await testView.save();

    return NextResponse.json({
      success: true,
      message: 'Test view record created',
      data: {
        viewId: testView._id,
        articleSlug: testView.articleSlug
      }
    });

  } catch (error) {
    console.error('Test analytics POST error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
