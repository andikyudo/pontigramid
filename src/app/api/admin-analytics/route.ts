import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { verifyAuth } from '@/lib/auth';
import ArticleView from '@/models/ArticleView';
import News from '@/models/News';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Build base filter
    const baseFilter: any = {
      viewedAt: { $gte: startDate, $lte: now }
    };

    // 1. Overall Statistics
    const overallStats = await ArticleView.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: null,
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
          avgViewDuration: { $avg: '$viewDuration' },
          totalArticles: { $addToSet: '$articleId' },
          totalVisitors: { $addToSet: '$visitorId' }
        }
      },
      {
        $project: {
          totalViews: 1,
          uniqueViews: 1,
          avgViewDuration: { $round: ['$avgViewDuration', 2] },
          totalArticles: { $size: '$totalArticles' },
          totalVisitors: { $size: '$totalVisitors' },
          bounceRate: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ['$totalViews', '$uniqueViews'] },
                      '$totalViews'
                    ]
                  },
                  100
                ]
              },
              2
            ]
          }
        }
      }
    ]);

    // 2. Top Articles
    const topArticles = await ArticleView.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: '$articleId',
          articleSlug: { $first: '$articleSlug' },
          articleTitle: { $first: '$articleTitle' },
          articleCategory: { $first: '$articleCategory' },
          articleAuthor: { $first: '$articleAuthor' },
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
          avgViewDuration: { $avg: '$viewDuration' },
          lastViewed: { $max: '$viewedAt' }
        }
      },
      { $sort: { totalViews: -1 } },
      { $limit: 10 }
    ]);

    // 3. Geographic Distribution
    const geographicDistribution = await ArticleView.aggregate([
      { 
        $match: {
          ...baseFilter,
          'location.city': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: {
            city: '$location.city',
            district: '$location.district',
            region: '$location.region'
          },
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } }
        }
      },
      { $sort: { totalViews: -1 } },
      { $limit: 10 }
    ]);

    // 4. Category Performance
    const categoryPerformance = await ArticleView.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: '$articleCategory',
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
          articleCount: { $addToSet: '$articleId' }
        }
      },
      { $sort: { totalViews: -1 } },
      {
        $project: {
          category: '$_id',
          totalViews: 1,
          uniqueViews: 1,
          articleCount: { $size: '$articleCount' }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overallStats: overallStats[0] || {
          totalViews: 0,
          uniqueViews: 0,
          avgViewDuration: 0,
          totalArticles: 0,
          totalVisitors: 0,
          bounceRate: 0
        },
        topArticles,
        geographicDistribution,
        categoryPerformance,
        period,
        dateRange: {
          startDate: startDate.toISOString(),
          endDate: now.toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Error fetching analytics dashboard:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
