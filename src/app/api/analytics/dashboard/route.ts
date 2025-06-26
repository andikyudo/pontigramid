import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ReaderAnalytics from '@/models/ReaderAnalytics';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const dateFilter = {
      viewedAt: { $gte: startDate, $lte: now }
    };

    // 1. Overall Statistics
    const [totalViews, uniqueViews, totalSessions] = await Promise.all([
      ReaderAnalytics.countDocuments(dateFilter),
      ReaderAnalytics.countDocuments({ ...dateFilter, isUniqueView: true }),
      ReaderAnalytics.distinct('sessionId', dateFilter).then(sessions => sessions.length)
    ]);

    // 2. Top Articles
    const topArticles = await ReaderAnalytics.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$articleSlug',
          articleTitle: { $first: '$articleTitle' },
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
          lastViewed: { $max: '$viewedAt' }
        }
      },
      { $sort: { totalViews: -1 } },
      { $limit: 10 }
    ]);

    // 3. Geographic Distribution
    const geographicData = await ReaderAnalytics.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            city: '$city',
            region: '$region',
            country: '$country'
          },
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
          uniqueIPs: { $addToSet: '$ipAddress' }
        }
      },
      {
        $project: {
          city: '$_id.city',
          region: '$_id.region',
          country: '$_id.country',
          totalViews: 1,
          uniqueViews: 1,
          uniqueVisitors: { $size: '$uniqueIPs' }
        }
      },
      { $sort: { totalViews: -1 } },
      { $limit: 10 }
    ]);

    // 4. Daily View Trends
    const dailyTrends = await ReaderAnalytics.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: '$viewedAt' },
            month: { $month: '$viewedAt' },
            day: { $dayOfMonth: '$viewedAt' }
          },
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
          uniqueVisitors: { $addToSet: '$ipAddress' }
        }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          totalViews: 1,
          uniqueViews: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' }
        }
      },
      { $sort: { date: 1 } }
    ]);

    // 5. Top Referrers
    const topReferrers = await ReaderAnalytics.aggregate([
      { 
        $match: { 
          ...dateFilter, 
          referrer: { $ne: '', $exists: true } 
        } 
      },
      {
        $group: {
          _id: '$referrer',
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } }
        }
      },
      { $sort: { totalViews: -1 } },
      { $limit: 10 }
    ]);

    // 6. Unique Visitors by IP
    const uniqueVisitors = await ReaderAnalytics.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$ipAddress',
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
          firstVisit: { $min: '$viewedAt' },
          lastVisit: { $max: '$viewedAt' },
          articlesViewed: { $addToSet: '$articleSlug' },
          city: { $first: '$city' }
        }
      },
      {
        $project: {
          ipAddress: { $concat: [{ $substr: ['$_id', 0, 8] }, '***'] },
          totalViews: 1,
          uniqueViews: 1,
          firstVisit: 1,
          lastVisit: 1,
          articlesCount: { $size: '$articlesViewed' },
          city: 1
        }
      },
      { $sort: { totalViews: -1 } },
      { $limit: 20 }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        period,
        dateRange: {
          startDate: startDate.toISOString(),
          endDate: now.toISOString()
        },
        overallStats: {
          totalViews,
          uniqueViews,
          totalSessions,
          bounceRate: totalViews > 0 ? Math.round(((totalViews - uniqueViews) / totalViews) * 100) : 0
        },
        topArticles,
        geographicData,
        dailyTrends,
        topReferrers,
        uniqueVisitors
      }
    });

  } catch (error) {
    console.error('Error fetching analytics dashboard:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
