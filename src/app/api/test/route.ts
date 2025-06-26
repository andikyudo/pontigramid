import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode');

  if (mode === 'analytics') {
    try {
      // Import dependencies dynamically
      const { connectDB } = await import('@/lib/mongodb');
      const ArticleView = (await import('@/models/ArticleView')).default;
      const News = (await import('@/models/News')).default;

      await connectDB();

      // Get count of existing views
      const viewsCount = await ArticleView.countDocuments();

      // Get article count
      const articlesCount = await News.countDocuments();

      // Get sample article
      const sampleArticle = await News.findOne().lean();

      return NextResponse.json({
        success: true,
        message: 'Analytics test successful',
        data: {
          mode,
          viewsCount,
          articlesCount,
          sampleArticle: sampleArticle ? {
            id: (sampleArticle as any)._id,
            title: (sampleArticle as any).title,
            slug: (sampleArticle as any).slug,
            views: (sampleArticle as any).views || 0
          } : null,
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
    console.log('POST body received:', body);

    // ALWAYS ATTEMPT TRACKING - No conditionals
    try {
      // Import dependencies dynamically
      const { connectDB } = await import('@/lib/mongodb');
      const ArticleView = (await import('@/models/ArticleView')).default;
      const News = (await import('@/models/News')).default;

      await connectDB();
      console.log('Database connected successfully');

      // Use provided articleSlug or default
      const articleSlug = body.articleSlug || 'test-default-article';
      console.log('Processing article slug:', articleSlug);

      // Try to find the actual article
      let article = null;
      try {
        article = await News.findOne({ slug: articleSlug }).lean();
        console.log('Article lookup result:', article ? `Found: ${(article as any).title}` : 'Not found');
      } catch (err) {
        console.log('Article lookup error:', err);
      }

      // Create view record
      const viewRecord = new ArticleView({
        articleId: article ? (article as any)._id : '507f1f77bcf86cd799439011',
        articleSlug: articleSlug,
        articleTitle: article ? (article as any).title : 'Test Article',
        articleCategory: article ? (article as any).category : 'test',
        articleAuthor: article ? (article as any).author : 'Test Author',
        visitorId: body.visitorId || 'test-visitor-' + Date.now(),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
        userAgent: request.headers.get('user-agent') || 'Unknown',
        sessionId: body.sessionId || 'test-session-' + Date.now(),
        viewDuration: body.viewDuration || 30,
        isUniqueView: true,
        location: {
          country: 'Indonesia',
          region: 'Kalimantan Barat',
          city: 'Pontianak',
          district: 'Pontianak Kota'
        },
        device: {
          type: 'desktop',
          os: 'Production OS',
          browser: 'Production Browser'
        },
        viewedAt: new Date()
      });

      await viewRecord.save();
      console.log('View record saved with ID:', viewRecord._id);

      // Update article view count if real article
      let updatedArticle = null;
      if (article) {
        updatedArticle = await News.findByIdAndUpdate(
          (article as any)._id,
          { $inc: { views: 1 } },
          { new: true }
        );
        console.log('Article view count updated to:', updatedArticle?.views);
      }

      // Get current counts for verification
      const totalViews = await ArticleView.countDocuments();
      const articleViews = await ArticleView.countDocuments({
        articleId: article ? (article as any)._id : viewRecord.articleId
      });

      return NextResponse.json({
        success: true,
        message: 'View tracking successful - FORCED EXECUTION',
        data: {
          viewId: viewRecord._id,
          articleSlug: viewRecord.articleSlug,
          articleTitle: viewRecord.articleTitle,
          ipAddress: viewRecord.ipAddress.substring(0, 8) + '***',
          location: viewRecord.location,
          isRealArticle: !!article,
          newViewCount: updatedArticle?.views || 0,
          totalViewsInDB: totalViews,
          articleViewsInDB: articleViews,
          originalBody: body
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('View tracking error:', error);
      return NextResponse.json({
        success: false,
        message: 'View tracking failed - FORCED EXECUTION',
        error: error instanceof Error ? error.message : 'Unknown error',
        originalBody: body,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({
      success: false,
      error: 'Invalid JSON',
      timestamp: new Date().toISOString()
    }, { status: 400 });
  }
}
