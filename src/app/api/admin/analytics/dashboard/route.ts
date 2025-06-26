import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { verifyAuth } from '@/lib/auth';
import ArticleView from '@/models/ArticleView';
import ReaderAnalytics from '@/models/ReaderAnalytics';
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
    const period = searchParams.get('period') || '7d'; // 1d, 7d, 30d, 90d
    const category = searchParams.get('category');
    const author = searchParams.get('author');

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

    if (category) {
      baseFilter.articleCategory = category;
    }

    if (author) {
      baseFilter.articleAuthor = author;
    }

    // 1. Overall Statistics - Use ReaderAnalytics as primary source
    const readerAnalyticsFilter = {
      viewedAt: { $gte: startDate, $lte: now }
    };

    const overallStats = await ReaderAnalytics.aggregate([
      { $match: readerAnalyticsFilter },
      {
        $group: {
          _id: null,
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
          avgViewDuration: { $avg: '$viewDuration' },
          totalArticles: { $addToSet: '$articleSlug' },
          totalVisitors: { $addToSet: '$ipAddress' },
          totalSessions: { $addToSet: '$sessionId' }
        }
      },
      {
        $project: {
          totalViews: 1,
          uniqueViews: 1,
          avgViewDuration: { $round: ['$avgViewDuration', 2] },
          totalArticles: { $size: '$totalArticles' },
          totalVisitors: { $size: '$totalVisitors' },
          totalSessions: { $size: '$totalSessions' },
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

    // 2. Top Articles - Use ReaderAnalytics as primary source
    const topArticles = await ReaderAnalytics.aggregate([
      { $match: readerAnalyticsFilter },
      {
        $group: {
          _id: '$articleSlug',
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
      { $limit: 10 },
      {
        $project: {
          articleSlug: 1,
          articleTitle: 1,
          articleCategory: 1,
          articleAuthor: 1,
          totalViews: 1,
          uniqueViews: 1,
          avgViewDuration: { $round: ['$avgViewDuration', 2] },
          lastViewed: 1,
          engagementRate: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$uniqueViews', '$totalViews'] },
                  100
                ]
              },
              2
            ]
          }
        }
      }
    ]);

    // 3. Views Trend (daily for the period) - Use ReaderAnalytics
    const viewsTrend = await ReaderAnalytics.aggregate([
      { $match: readerAnalyticsFilter },
      {
        $group: {
          _id: {
            year: { $year: '$viewedAt' },
            month: { $month: '$viewedAt' },
            day: { $dayOfMonth: '$viewedAt' }
          },
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
          avgViewDuration: { $avg: '$viewDuration' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
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
          avgViewDuration: { $round: ['$avgViewDuration', 2] }
        }
      }
    ]);

    // 4. Category Performance - Use ReaderAnalytics
    const categoryPerformance = await ReaderAnalytics.aggregate([
      { $match: readerAnalyticsFilter },
      {
        $group: {
          _id: '$articleCategory',
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
          avgViewDuration: { $avg: '$viewDuration' },
          articleCount: { $addToSet: '$articleId' }
        }
      },
      { $sort: { totalViews: -1 } },
      {
        $project: {
          category: '$_id',
          totalViews: 1,
          uniqueViews: 1,
          avgViewDuration: { $round: ['$avgViewDuration', 2] },
          articleCount: { $size: '$articleCount' },
          avgViewsPerArticle: {
            $round: [
              { $divide: ['$totalViews', { $size: '$articleCount' }] },
              2
            ]
          }
        }
      }
    ]);

    // 5. Geographic Distribution - Use ReaderAnalytics
    const geographicDistribution = await ReaderAnalytics.aggregate([
      {
        $match: {
          ...readerAnalyticsFilter,
          city: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: {
            city: '$city',
            region: '$region',
            country: '$country'
          },
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
          avgViewDuration: { $avg: '$viewDuration' },
          topCategories: { $push: '$articleCategory' },
          uniqueVisitors: { $addToSet: '$ipAddress' }
        }
      },
      { $sort: { totalViews: -1 } },
      { $limit: 20 },
      {
        $project: {
          location: {
            city: '$_id.city',
            region: '$_id.region',
            country: '$_id.country'
          },
          totalViews: 1,
          uniqueViews: 1,
          avgViewDuration: { $round: ['$avgViewDuration', 2] },
          uniqueVisitors: { $size: '$uniqueVisitors' },
          topCategory: {
            $arrayElemAt: [
              {
                $map: {
                  input: { $setUnion: ['$topCategories', []] },
                  as: 'category',
                  in: {
                    category: '$$category',
                    count: {
                      $size: {
                        $filter: {
                          input: '$topCategories',
                          cond: { $eq: ['$$this', '$$category'] }
                        }
                      }
                    }
                  }
                }
              },
              0
            ]
          }
        }
      }
    ]);

    // 6. Device and Browser Analytics - Use ReaderAnalytics
    const deviceAnalytics = await ReaderAnalytics.aggregate([
      { $match: readerAnalyticsFilter },
      {
        $group: {
          _id: null,
          deviceTypes: { $push: '$deviceType' },
          platforms: { $push: '$platform' },
          userAgents: { $push: '$userAgent' }
        }
      },
      {
        $project: {
          deviceBreakdown: {
            $map: {
              input: ['desktop', 'mobile', 'tablet'],
              as: 'deviceType',
              in: {
                type: '$$deviceType',
                count: {
                  $size: {
                    $filter: {
                      input: '$deviceTypes',
                      cond: { $eq: ['$$this', '$$deviceType'] }
                    }
                  }
                }
              }
            }
          },
          topBrowsers: {
            $slice: [
              {
                $map: {
                  input: { $setUnion: ['$browsers', []] },
                  as: 'browser',
                  in: {
                    browser: '$$browser',
                    count: {
                      $size: {
                        $filter: {
                          input: '$browsers',
                          cond: { $eq: ['$$this', '$$browser'] }
                        }
                      }
                    }
                  }
                }
              },
              5
            ]
          },
          topOS: {
            $slice: [
              {
                $map: {
                  input: { $setUnion: ['$operatingSystems', []] },
                  as: 'os',
                  in: {
                    os: '$$os',
                    count: {
                      $size: {
                        $filter: {
                          input: '$operatingSystems',
                          cond: { $eq: ['$$this', '$$os'] }
                        }
                      }
                    }
                  }
                }
              },
              5
            ]
          }
        }
      }
    ]);

    // Ensure proper data structure with defaults
    const safeOverallStats = overallStats[0] || {
      totalViews: 0,
      uniqueViews: 0,
      avgViewDuration: 0,
      totalArticles: 0,
      totalVisitors: 0,
      bounceRate: 0
    };

    const safeDeviceAnalytics = deviceAnalytics[0] || {
      deviceBreakdown: []
    };

    return NextResponse.json({
      success: true,
      data: {
        overallStats: safeOverallStats,
        topArticles: topArticles || [],
        viewsTrend: viewsTrend || [],
        categoryPerformance: categoryPerformance || [],
        geographicDistribution: geographicDistribution || [],
        deviceAnalytics: safeDeviceAnalytics,
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
