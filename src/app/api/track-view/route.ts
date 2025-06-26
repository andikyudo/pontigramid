import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ArticleView from '@/models/ArticleView';
import News from '@/models/News';
import { getGeolocationFromIP, parseUserAgent, getClientIP, generateSessionId, hasLocationConsent } from '@/lib/geolocation';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      articleSlug, 
      viewDuration = 0, 
      sessionId,
      visitorId,
      referrer 
    } = body;

    if (!articleSlug) {
      return NextResponse.json(
        { success: false, error: 'Article slug is required' },
        { status: 400 }
      );
    }

    // Get article details
    const article = await News.findOne({ slug: articleSlug }).lean();
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Get client information
    const ipAddress = getClientIP(request.headers);
    const userAgent = request.headers.get('user-agent') || '';
    const deviceInfo = parseUserAgent(userAgent);
    
    // Check for location consent
    const locationConsent = hasLocationConsent(request.headers);
    
    // Get geolocation data (only if consent is given)
    let locationData = {};
    if (locationConsent) {
      try {
        locationData = await getGeolocationFromIP(ipAddress);
      } catch (error) {
        console.error('Error getting geolocation:', error);
      }
    }

    // Generate session ID if not provided
    const currentSessionId = sessionId || generateSessionId();

    // Check if this is a unique view (same IP + article within 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingView = await ArticleView.findOne({
      articleId: (article as any)._id,
      ipAddress,
      viewedAt: { $gte: twentyFourHoursAgo }
    });

    const isUniqueView = !existingView;

    // Create view record
    const viewRecord = new ArticleView({
      articleId: (article as any)._id,
      articleSlug: (article as any).slug,
      articleTitle: (article as any).title,
      articleCategory: (article as any).category,
      articleAuthor: (article as any).author,
      visitorId,
      ipAddress,
      userAgent,
      referrer,
      sessionId: currentSessionId,
      viewDuration,
      isUniqueView,
      location: locationConsent ? locationData : undefined,
      device: deviceInfo,
      viewedAt: new Date()
    });

    await viewRecord.save();

    // Update article view count (only for unique views)
    if (isUniqueView) {
      await News.findByIdAndUpdate(
        (article as any)._id,
        { $inc: { views: 1 } }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        viewId: viewRecord._id,
        sessionId: currentSessionId,
        isUniqueView,
        location: locationConsent ? locationData : null
      }
    });

  } catch (error) {
    console.error('Error tracking article view:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const articleSlug = searchParams.get('articleSlug');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Build filter
    const filter: any = {};
    
    if (articleSlug) {
      filter.articleSlug = articleSlug;
    }

    if (startDate || endDate) {
      filter.viewedAt = {};
      if (startDate) filter.viewedAt.$gte = new Date(startDate);
      if (endDate) filter.viewedAt.$lte = new Date(endDate);
    }

    // Get view analytics
    const analytics = await ArticleView.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$articleSlug',
          articleTitle: { $first: '$articleTitle' },
          articleCategory: { $first: '$articleCategory' },
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
          avgViewDuration: { $avg: '$viewDuration' },
          lastViewed: { $max: '$viewedAt' }
        }
      },
      { $sort: { totalViews: -1 } },
      { $limit: limit }
    ]);

    return NextResponse.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Error fetching view analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
