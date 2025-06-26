import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode');

  if (mode === 'analytics') {
    try {
      // Import dependencies dynamically
      const { connectDB } = await import('@/lib/mongodb');
      const ArticleView = (await import('@/models/ArticleView')).default;

      await connectDB();

      // Get count of existing views
      const viewsCount = await ArticleView.countDocuments();

      return NextResponse.json({
        success: true,
        message: 'Analytics test successful',
        data: {
          mode,
          viewsCount,
          dbConnected: true,
          url: request.url,
          headers: {
            userAgent: request.headers.get('user-agent'),
            forwarded: request.headers.get('x-forwarded-for'),
            host: request.headers.get('host')
          }
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
        // Import dependencies dynamically
        const { connectDB } = await import('@/lib/mongodb');
        const ArticleView = (await import('@/models/ArticleView')).default;

        await connectDB();

        // Create test view record
        const viewRecord = new ArticleView({
          articleId: '507f1f77bcf86cd799439011', // dummy ObjectId
          articleSlug: articleSlug || 'test-article',
          articleTitle: 'Test Article',
          articleCategory: 'test',
          articleAuthor: 'Test Author',
          visitorId: 'test-visitor-' + Date.now(),
          ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
          userAgent: request.headers.get('user-agent') || 'Unknown',
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

        await viewRecord.save();

        return NextResponse.json({
          success: true,
          message: 'View tracking successful',
          data: {
            viewId: viewRecord._id,
            articleSlug: viewRecord.articleSlug,
            ipAddress: viewRecord.ipAddress,
            location: viewRecord.location
          },
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        return NextResponse.json({
          success: false,
          message: 'View tracking failed',
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
