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

    // 1. Overall Statistics - Combine data from both collections
    // Get stats from ArticleView collection
    const articleViewStats = await ArticleView.aggregate([
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
      }
    ]);

    // Get stats from ReaderAnalytics collection (from /api/test tracking)
    const readerAnalyticsFilter = {
      viewedAt: { $gte: startDate, $lte: now }
    };

    const readerAnalyticsStats = await ReaderAnalytics.aggregate([
      { $match: readerAnalyticsFilter },
      {
        $group: {
          _id: null,
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
          totalArticles: { $addToSet: '$articleSlug' },
          totalVisitors: { $addToSet: '$ipAddress' }
        }
      }
    ]);

    // Combine stats from both collections
    const articleViewData = articleViewStats[0] || { totalViews: 0, uniqueViews: 0, avgViewDuration: 0, totalArticles: [], totalVisitors: [] };
    const readerAnalyticsData = readerAnalyticsStats[0] || { totalViews: 0, uniqueViews: 0, totalArticles: [], totalVisitors: [] };

    const overallStats = [{
      totalViews: articleViewData.totalViews + readerAnalyticsData.totalViews,
      uniqueViews: articleViewData.uniqueViews + readerAnalyticsData.uniqueViews,
      avgViewDuration: articleViewData.avgViewDuration || 0,
      totalArticles: [...new Set([...articleViewData.totalArticles, ...readerAnalyticsData.totalArticles])].length,
      totalVisitors: [...new Set([...articleViewData.totalVisitors, ...readerAnalyticsData.totalVisitors])].length,
      bounceRate: 0 // Calculate based on combined data
    }];

    // 2. Top Articles - Combine data from both collections
    // Get top articles from ArticleView
    const topArticlesFromViews = await ArticleView.aggregate([
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
      }
    ]);

    // Get top articles from ReaderAnalytics
    const topArticlesFromAnalytics = await ReaderAnalytics.aggregate([
      { $match: readerAnalyticsFilter },
      {
        $group: {
          _id: '$articleSlug',
          articleSlug: { $first: '$articleSlug' },
          articleTitle: { $first: '$articleTitle' },
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
          lastViewed: { $max: '$viewedAt' }
        }
      }
    ]);

    // Combine and merge article data
    const articleMap = new Map();

    // Add ArticleView data
    topArticlesFromViews.forEach(article => {
      articleMap.set(article.articleSlug, {
        articleSlug: article.articleSlug,
        articleTitle: article.articleTitle,
        articleCategory: article.articleCategory || 'Unknown',
        articleAuthor: article.articleAuthor || 'Unknown',
        totalViews: article.totalViews,
        uniqueViews: article.uniqueViews,
        avgViewDuration: article.avgViewDuration || 0,
        lastViewed: article.lastViewed
      });
    });

    // Add/merge ReaderAnalytics data
    topArticlesFromAnalytics.forEach(article => {
      const existing = articleMap.get(article.articleSlug);
      if (existing) {
        existing.totalViews += article.totalViews;
        existing.uniqueViews += article.uniqueViews;
        existing.lastViewed = new Date(Math.max(existing.lastViewed.getTime(), article.lastViewed.getTime()));
      } else {
        articleMap.set(article.articleSlug, {
          articleSlug: article.articleSlug,
          articleTitle: article.articleTitle,
          articleCategory: 'Unknown',
          articleAuthor: 'Unknown',
          totalViews: article.totalViews,
          uniqueViews: article.uniqueViews,
          avgViewDuration: 0,
          lastViewed: article.lastViewed
        });
      }
    });

    // Convert to array and sort by total views
    const topArticles = Array.from(articleMap.values())
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, 10)
      .map(article => ({
        ...article,
        avgViewDuration: Math.round(article.avgViewDuration * 100) / 100,
        engagementRate: Math.round((article.uniqueViews / article.totalViews) * 100 * 100) / 100
      }));

    // 3. Views Trend (daily for the period)
    const viewsTrend = await ArticleView.aggregate([
      { $match: baseFilter },
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

    // 4. Category Performance
    const categoryPerformance = await ArticleView.aggregate([
      { $match: baseFilter },
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

    // 5. Geographic Distribution
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
            region: '$location.region',
            country: '$location.country'
          },
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
          avgViewDuration: { $avg: '$viewDuration' },
          topCategories: { $push: '$articleCategory' },
          coordinates: {
            $first: {
              latitude: '$location.latitude',
              longitude: '$location.longitude'
            }
          }
        }
      },
      { $sort: { totalViews: -1 } },
      { $limit: 20 },
      {
        $project: {
          location: {
            city: '$_id.city',
            district: '$_id.district',
            region: '$_id.region',
            country: '$_id.country'
          },
          totalViews: 1,
          uniqueViews: 1,
          avgViewDuration: { $round: ['$avgViewDuration', 2] },
          coordinates: 1,
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

    // 6. Device and Browser Analytics
    const deviceAnalytics = await ArticleView.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: null,
          deviceTypes: { $push: '$device.type' },
          browsers: { $push: '$device.browser' },
          operatingSystems: { $push: '$device.os' }
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
