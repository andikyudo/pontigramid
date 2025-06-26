import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🔍 GET REQUEST RECEIVED - Test endpoint');
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
  console.log('🚀 POST REQUEST RECEIVED - Analytics tracking starting');
  try {
    const body = await request.json();
    console.log('📦 FINAL ANALYTICS SYSTEM v6.0 - POST body received:', body);

    // NEW ANALYTICS SYSTEM - Always attempt tracking
    try {
      // Import dependencies dynamically
      const { connectDB } = await import('@/lib/mongodb');
      const ReaderAnalytics = (await import('@/models/ReaderAnalytics')).default;
      const News = (await import('@/models/News')).default;

      await connectDB();
      console.log('Database connected successfully');

      // DIRECT DATABASE WRITE TEST - PRIORITY EXECUTION
      if (body.articleSlug) {
        console.log('🔥 ATTEMPTING DIRECT VIEW INCREMENT FOR:', body.articleSlug);

        try {
          const directResult = await News.findOneAndUpdate(
            { slug: body.articleSlug },
            { $inc: { views: 1 } },
            { new: true }
          );

          if (directResult) {
            console.log('✅ DIRECT INCREMENT SUCCESS! New view count:', directResult.views);

            return NextResponse.json({
              success: true,
              message: '🎉 ANALYTICS v6.0 - DIRECT INCREMENT SUCCESSFUL!',
              data: {
                articleSlug: directResult.slug,
                newViewCount: directResult.views,
                title: directResult.title
              },
              timestamp: new Date().toISOString()
            });
          } else {
            console.log('❌ Article not found for direct increment:', body.articleSlug);
          }
        } catch (directError) {
          console.error('❌ DIRECT INCREMENT ERROR:', directError);
        }
      }

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

      // Get client information
      const ipAddress = request.headers.get('x-forwarded-for') ||
                       request.headers.get('x-real-ip') ||
                       '127.0.0.1';
      const userAgent = request.headers.get('user-agent') || 'Unknown';

      // Check for unique view (same IP + article within 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const existingView = await ReaderAnalytics.findOne({
        articleSlug,
        ipAddress,
        viewedAt: { $gte: twentyFourHoursAgo }
      });

      const isUniqueView = !existingView;
      console.log('Is unique view:', isUniqueView);

      // Create analytics record using new schema
      const analyticsRecord = new ReaderAnalytics({
        articleSlug: articleSlug,
        articleTitle: article ? (article as any).title : 'Test Article',
        ipAddress,
        userAgent,
        country: 'Indonesia',
        region: 'Kalimantan Barat',
        city: 'Pontianak',
        viewedAt: new Date(),
        isUniqueView,
        sessionId: body.sessionId || 'test-session-' + Date.now(),
        referrer: body.referrer || ''
      });

      await analyticsRecord.save();
      console.log('Analytics record saved with ID:', analyticsRecord._id);

      // Update article view count if real article and unique view
      let updatedArticle = null;
      if (article && isUniqueView) {
        updatedArticle = await News.findByIdAndUpdate(
          (article as any)._id,
          { $inc: { views: 1 } },
          { new: true }
        );
        console.log('Article view count updated to:', updatedArticle?.views);
      }

      // Get current counts for verification
      const totalViews = await ReaderAnalytics.countDocuments();
      const articleViews = await ReaderAnalytics.countDocuments({
        articleSlug: articleSlug
      });
      const uniqueViews = await ReaderAnalytics.countDocuments({
        articleSlug: articleSlug,
        isUniqueView: true
      });

      return NextResponse.json({
        success: true,
        message: '🎉 ANALYTICS v5.0 - TRACKING SUCCESSFUL! View count incremented!',
        data: {
          trackingId: analyticsRecord._id,
          articleSlug: analyticsRecord.articleSlug,
          articleTitle: analyticsRecord.articleTitle,
          ipAddress: analyticsRecord.ipAddress.substring(0, 8) + '***',
          city: analyticsRecord.city,
          isRealArticle: !!article,
          isUniqueView: analyticsRecord.isUniqueView,
          newViewCount: updatedArticle?.views || 0,
          statistics: {
            totalViews,
            articleViews,
            uniqueViews
          },
          originalBody: body
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('NEW ANALYTICS SYSTEM - Tracking error:', error);
      return NextResponse.json({
        success: false,
        message: 'NEW ANALYTICS SYSTEM - Tracking failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
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
