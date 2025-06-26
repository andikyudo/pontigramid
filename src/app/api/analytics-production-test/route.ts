import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🚀 PRODUCTION ANALYTICS TEST v4.0 - Request received:', body);

    // PRODUCTION ANALYTICS SYSTEM - Always attempt tracking
    try {
      // Import dependencies dynamically
      const { connectDB } = await import('@/lib/mongodb');
      const ReaderAnalytics = (await import('@/models/ReaderAnalytics')).default;
      const News = (await import('@/models/News')).default;
      
      await connectDB();
      console.log('✅ Database connected successfully');
      
      // Use provided articleSlug or default
      const articleSlug = body.articleSlug || 'test-default-article';
      console.log('📰 Processing article slug:', articleSlug);
      
      // Try to find the actual article
      let article = null;
      try {
        article = await News.findOne({ slug: articleSlug }).lean();
        console.log('🔍 Article lookup result:', article ? `Found: ${(article as any).title}` : 'Not found');
      } catch (err) {
        console.log('❌ Article lookup error:', err);
      }
      
      // Get client information
      const ipAddress = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       '127.0.0.1';
      const userAgent = request.headers.get('user-agent') || 'Unknown';
      
      console.log('🌐 Client info - IP:', ipAddress.substring(0, 8) + '***');
      
      // Check for unique view (same IP + article within 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const existingView = await ReaderAnalytics.findOne({
        articleSlug,
        ipAddress,
        viewedAt: { $gte: twentyFourHoursAgo }
      });

      const isUniqueView = !existingView;
      console.log('🔄 Is unique view:', isUniqueView);

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
      console.log('💾 Analytics record saved with ID:', analyticsRecord._id);
      
      // Update article view count if real article and unique view
      let updatedArticle = null;
      if (article && isUniqueView) {
        updatedArticle = await News.findByIdAndUpdate(
          (article as any)._id,
          { $inc: { views: 1 } },
          { new: true }
        );
        console.log('📈 Article view count updated to:', updatedArticle?.views);
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

      console.log('📊 Statistics - Total:', totalViews, 'Article:', articleViews, 'Unique:', uniqueViews);

      return NextResponse.json({
        success: true,
        message: '🎉 PRODUCTION ANALYTICS v4.0 - Tracking successful!',
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
      console.error('❌ PRODUCTION ANALYTICS v4.0 - Tracking error:', error);
      return NextResponse.json({
        success: false,
        message: '💥 PRODUCTION ANALYTICS v4.0 - Tracking failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        originalBody: body,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error) {
    console.error('❌ Error parsing JSON:', error);
    return NextResponse.json({
      success: false,
      error: 'Invalid JSON in PRODUCTION ANALYTICS v4.0',
      timestamp: new Date().toISOString()
    }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: '🚀 PRODUCTION ANALYTICS v4.0 - Endpoint is ready!',
    info: 'Use POST method to track article views',
    timestamp: new Date().toISOString()
  });
}
