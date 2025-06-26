import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ReaderAnalytics from '@/models/ReaderAnalytics';
import News from '@/models/News';

// Helper function to get client IP
function getClientIP(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  const realIP = headers.get('x-real-ip');
  const cfConnectingIP = headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return '127.0.0.1';
}

// Helper function to generate session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper function to detect device type
function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile';
  }
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet';
  }
  return 'desktop';
}

// Helper function to get geographic data (simplified)
async function getGeographicData(ip: string) {
  // For now, return default Pontianak data
  // In production, you can integrate with IP geolocation services
  return {
    country: 'Indonesia',
    region: 'Kalimantan Barat',
    city: 'Pontianak'
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log('Analytics tracking endpoint called');
    
    // Connect to database
    await connectDB();
    console.log('Database connected successfully');

    // Parse request body
    const body = await request.json();
    const { articleSlug, referrer = '', sessionId } = body;
    
    console.log('Tracking request for article:', articleSlug);

    if (!articleSlug) {
      return NextResponse.json(
        { success: false, error: 'Article slug is required' },
        { status: 400 }
      );
    }

    // Get article information
    const article = await News.findOne({ slug: articleSlug }).lean();
    if (!article) {
      console.log('Article not found:', articleSlug);
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Get client information
    const ipAddress = getClientIP(request.headers);
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const currentSessionId = sessionId || generateSessionId();
    
    console.log('Client info - IP:', ipAddress.substring(0, 8) + '***', 'UA:', userAgent.substring(0, 20) + '...');

    // Check for unique view (same IP + article within 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingView = await ReaderAnalytics.findOne({
      articleSlug,
      ipAddress,
      viewedAt: { $gte: twentyFourHoursAgo }
    });

    const isUniqueView = !existingView;
    console.log('Is unique view:', isUniqueView);

    // Get geographic data
    const geoData = await getGeographicData(ipAddress);

    // Create analytics record
    const analyticsRecord = new ReaderAnalytics({
      articleSlug: (article as any).slug,
      articleTitle: (article as any).title,
      ipAddress,
      userAgent,
      country: geoData.country,
      region: geoData.region,
      city: geoData.city,
      viewedAt: new Date(),
      isUniqueView,
      sessionId: currentSessionId,
      referrer
    });

    await analyticsRecord.save();
    console.log('Analytics record saved:', analyticsRecord._id);

    // Update article view count (only for unique views)
    if (isUniqueView) {
      const updatedArticle = await News.findByIdAndUpdate(
        (article as any)._id,
        { $inc: { views: 1 } },
        { new: true }
      );
      console.log('Article view count updated to:', updatedArticle?.views);
    }

    // Get current statistics
    const totalViews = await ReaderAnalytics.countDocuments();
    const articleViews = await ReaderAnalytics.countDocuments({ articleSlug });
    const uniqueViewsCount = await ReaderAnalytics.countDocuments({ 
      articleSlug, 
      isUniqueView: true 
    });

    return NextResponse.json({
      success: true,
      data: {
        trackingId: analyticsRecord._id,
        articleSlug,
        articleTitle: (article as any).title,
        isUniqueView,
        sessionId: currentSessionId,
        statistics: {
          totalViews,
          articleViews,
          uniqueViewsCount
        }
      }
    });

  } catch (error) {
    console.error('Error in analytics tracking:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const articleSlug = searchParams.get('articleSlug');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filter: any = {};
    if (articleSlug) {
      filter.articleSlug = articleSlug;
    }

    // Get recent analytics data
    const recentViews = await ReaderAnalytics.find(filter)
      .sort({ viewedAt: -1 })
      .limit(limit)
      .lean();

    // Get summary statistics
    const totalViews = await ReaderAnalytics.countDocuments(filter);
    const uniqueViews = await ReaderAnalytics.countDocuments({ 
      ...filter, 
      isUniqueView: true 
    });

    return NextResponse.json({
      success: true,
      data: {
        recentViews: recentViews.map(view => ({
          id: view._id,
          articleSlug: view.articleSlug,
          articleTitle: view.articleTitle,
          ipAddress: view.ipAddress.substring(0, 8) + '***',
          city: view.city,
          viewedAt: view.viewedAt,
          isUniqueView: view.isUniqueView
        })),
        statistics: {
          totalViews,
          uniqueViews
        }
      }
    });

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
