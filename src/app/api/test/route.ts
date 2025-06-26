import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode');

  if (mode === 'analytics') {
    try {
      // Test analytics functionality
      const { connectDB } = await import('@/lib/mongodb');
      await connectDB();

      const ArticleView = (await import('@/models/ArticleView')).default;
      const News = (await import('@/models/News')).default;

      const newsCount = await News.countDocuments();
      const viewsCount = await ArticleView.countDocuments();

      return NextResponse.json({
        success: true,
        message: 'Analytics test successful',
        data: {
          newsCount,
          viewsCount,
          dbConnected: true
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: 'Analytics test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, articleSlug } = body;

    if (mode === 'track-view') {
      try {
        // Test view tracking
        const { connectDB } = await import('@/lib/mongodb');
        await connectDB();

        const ArticleView = (await import('@/models/ArticleView')).default;

        // Create a test view record
        const testView = new ArticleView({
          articleId: '507f1f77bcf86cd799439011', // dummy ObjectId
          articleSlug: articleSlug || 'test-article',
          articleTitle: 'Test Article',
          articleCategory: 'test',
          articleAuthor: 'Test Author',
          visitorId: 'test-visitor-' + Date.now(),
          ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
          userAgent: request.headers.get('user-agent') || 'Test User Agent',
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
          message: 'Test view tracking successful',
          data: {
            viewId: testView._id,
            articleSlug: testView.articleSlug,
            ipAddress: testView.ipAddress
          },
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        return NextResponse.json({
          success: false,
          message: 'View tracking test failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'POST request received',
      data: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({
      success: false,
      error: 'Invalid JSON',
      timestamp: new Date().toISOString()
    }, { status: 400 });
  }
}
