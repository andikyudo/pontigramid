import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import News from '@/models/News';

export async function GET(request: NextRequest) {
  console.log('🔍 GET REQUEST RECEIVED - Test endpoint');
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode');

  // DATABASE DIAGNOSTIC MODE
  if (mode === 'db-diagnostic') {
    try {
      await connectDB();
      console.log('✅ Database connection successful');

      // Test 1: Check if we can read data
      const readTest = await News.findOne().limit(1);
      console.log('📖 Read test:', readTest ? 'SUCCESS' : 'FAILED');

      // Test 2: Check database permissions by attempting a write operation
      const testSlug = 'diagnostic-test-' + Date.now();
      let writeTest = false;
      let writeError = null;

      try {
        // Try to create a test document
        const testDoc = new News({
          title: 'Database Diagnostic Test',
          slug: testSlug,
          content: 'This is a test document for database diagnostics',
          excerpt: 'Test excerpt',
          category: 'test',
          author: 'System',
          published: false,
          views: 0
        });

        await testDoc.save();
        console.log('✅ Write test (create): SUCCESS');

        // Try to update the test document
        await News.findOneAndUpdate(
          { slug: testSlug },
          { $inc: { views: 1 } }
        );
        console.log('✅ Write test (update): SUCCESS');

        // Clean up - delete the test document
        await News.deleteOne({ slug: testSlug });
        console.log('✅ Write test (delete): SUCCESS');

        writeTest = true;
      } catch (error) {
        writeError = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Write test failed:', writeError);
      }

      return NextResponse.json({
        success: true,
        message: '🔍 DATABASE DIAGNOSTIC COMPLETE - v2.0',
        diagnostics: {
          connectionStatus: 'SUCCESS',
          readPermissions: readTest ? 'SUCCESS' : 'FAILED',
          writePermissions: writeTest ? 'SUCCESS' : 'FAILED',
          writeError: writeError,
          mongodbUri: process.env.MONGODB_URI ? 'CONFIGURED' : 'MISSING',
          mongodbUriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
          nodeEnv: process.env.NODE_ENV,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('❌ Database diagnostic failed:', error);
      return NextResponse.json({
        success: false,
        message: '❌ DATABASE DIAGNOSTIC FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

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

// Handle engagement tracking (duration, scroll)
async function handleEngagementTracking(body: any) {
  try {
    const { connectDB } = await import('@/lib/mongodb');
    const ReaderAnalytics = (await import('@/models/ReaderAnalytics')).default;

    await connectDB();

    const { articleSlug, sessionId, action, viewDuration, scrollDepth } = body;

    // Update existing analytics record with engagement data
    const updateData: any = {};
    if (action === 'track-duration' && viewDuration) {
      updateData.viewDuration = viewDuration;
    }
    if (action === 'track-scroll' && scrollDepth) {
      updateData.scrollDepth = scrollDepth;
    }

    const result = await ReaderAnalytics.findOneAndUpdate(
      { articleSlug, sessionId },
      { $set: updateData },
      { new: true, sort: { viewedAt: -1 } }
    );

    console.log(`📊 ${action} updated:`, result ? 'Success' : 'Not found');

    return NextResponse.json({
      success: true,
      message: `${action} tracked successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`❌ ${body.action} tracking failed:`, error);
    return NextResponse.json({
      success: false,
      message: `${body.action} tracking failed`,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('🚀 POST REQUEST RECEIVED - Analytics tracking starting');
  try {
    const body = await request.json();
    console.log('📦 ENHANCED ANALYTICS SYSTEM v8.2 - POST body received:', body);

    // Handle engagement tracking actions
    if (body.action === 'track-duration' || body.action === 'track-scroll') {
      return await handleEngagementTracking(body);
    }

    // NEW ANALYTICS SYSTEM - Always attempt tracking
    try {
      // Import dependencies dynamically
      const { connectDB } = await import('@/lib/mongodb');
      const ReaderAnalytics = (await import('@/models/ReaderAnalytics')).default;
      const News = (await import('@/models/News')).default;

      await connectDB();
      console.log('Database connected successfully');

      // ULTIMATE DATABASE WRITE TEST - FINAL VERSION
      if (body.articleSlug) {
        console.log('🔥 ULTIMATE TEST - ATTEMPTING DIRECT VIEW INCREMENT FOR:', body.articleSlug);

        try {
          // First, let's find the article to confirm it exists
          const existingArticle = await News.findOne({ slug: body.articleSlug });
          console.log('📰 Found article:', existingArticle ? existingArticle.title : 'NOT FOUND');
          console.log('📊 Current view count:', existingArticle ? existingArticle.views : 'N/A');

          if (existingArticle) {
            // Now try to increment
            const directResult = await News.findOneAndUpdate(
              { slug: body.articleSlug },
              { $inc: { views: 1 } },
              { new: true }
            );

            if (directResult) {
              console.log('✅ ULTIMATE SUCCESS! New view count:', directResult.views);

              // ALSO CREATE ANALYTICS RECORD FOR DASHBOARD
              try {
                const clientIP = request.headers.get('x-forwarded-for') ||
                                request.headers.get('x-real-ip') ||
                                request.headers.get('cf-connecting-ip') ||
                                '127.0.0.1';

                // Enhanced analytics data from client
                const clientInfo = body.clientInfo || {};
                const userAgent = body.userAgent || request.headers.get('user-agent') || 'Unknown';

                // Determine if this is a unique view (simple check by IP + article + day)
                const today = new Date().toISOString().split('T')[0];
                const existingView = await ReaderAnalytics.findOne({
                  articleSlug: directResult.slug,
                  ipAddress: clientIP,
                  viewedAt: {
                    $gte: new Date(today + 'T00:00:00.000Z'),
                    $lt: new Date(today + 'T23:59:59.999Z')
                  }
                });

                const analyticsRecord = new ReaderAnalytics({
                  articleSlug: directResult.slug,
                  articleTitle: directResult.title,
                  articleCategory: body.articleCategory || 'Uncategorized',
                  articleAuthor: body.articleAuthor || 'Unknown',
                  ipAddress: clientIP,
                  userAgent: userAgent,
                  country: 'Indonesia',
                  region: 'Kalimantan Barat',
                  city: 'Pontianak',
                  viewedAt: new Date(body.timestamp || Date.now()),
                  isUniqueView: !existingView,
                  sessionId: body.sessionId || 'unknown-session',
                  referrer: body.referrer || '',
                  // Enhanced client data
                  url: clientInfo.url || '',
                  pathname: clientInfo.pathname || '',
                  language: clientInfo.language || 'id',
                  platform: clientInfo.platform || 'Unknown',
                  screenResolution: clientInfo.screenWidth && clientInfo.screenHeight ?
                    `${clientInfo.screenWidth}x${clientInfo.screenHeight}` : 'Unknown',
                  viewportSize: clientInfo.viewportWidth && clientInfo.viewportHeight ?
                    `${clientInfo.viewportWidth}x${clientInfo.viewportHeight}` : 'Unknown',
                  timezone: clientInfo.timezone || 'Asia/Jakarta',
                  deviceType: userAgent.includes('Mobile') ? 'Mobile' :
                             userAgent.includes('Tablet') ? 'Tablet' : 'Desktop'
                });

                await analyticsRecord.save();
                console.log('📊 Enhanced analytics record created successfully');
              } catch (analyticsError) {
                console.log('⚠️ Analytics record creation failed:', analyticsError);
                // Don't fail the main request if analytics fails
              }

              return NextResponse.json({
                success: true,
                message: '🎉 ULTIMATE ANALYTICS v8.2 - DIRECT INCREMENT + ANALYTICS SUCCESSFUL!',
                data: {
                  articleSlug: directResult.slug,
                  previousViews: existingArticle.views,
                  newViewCount: directResult.views,
                  incrementWorked: directResult.views > existingArticle.views,
                  title: directResult.title
                },
                timestamp: new Date().toISOString()
              });
            } else {
              console.log('❌ Update operation failed');
              return NextResponse.json({
                success: false,
                message: '❌ Update operation failed',
                timestamp: new Date().toISOString()
              });
            }
          } else {
            console.log('❌ Article not found for slug:', body.articleSlug);
            return NextResponse.json({
              success: false,
              message: '❌ Article not found',
              data: { articleSlug: body.articleSlug },
              timestamp: new Date().toISOString()
            });
          }
        } catch (directError) {
          console.error('❌ ULTIMATE TEST ERROR:', directError);
          return NextResponse.json({
            success: false,
            message: '❌ Database operation failed',
            error: directError instanceof Error ? directError.message : 'Unknown error',
            timestamp: new Date().toISOString()
          });
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
