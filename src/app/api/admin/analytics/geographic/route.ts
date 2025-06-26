import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { verifyAuth } from '@/lib/auth';
import ArticleView from '@/models/ArticleView';
import GeographicAnalytics from '@/models/GeographicAnalytics';

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
    const district = searchParams.get('district');
    const category = searchParams.get('category');
    const groupBy = searchParams.get('groupBy') || 'district'; // district, city, region

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
      viewedAt: { $gte: startDate, $lte: now },
      'location.city': { $exists: true, $ne: null }
    };

    if (district) {
      baseFilter['location.district'] = district;
    }

    if (category) {
      baseFilter.articleCategory = category;
    }

    // 1. Geographic Distribution by specified grouping
    let groupField: any;
    switch (groupBy) {
      case 'district':
        groupField = {
          district: '$location.district',
          city: '$location.city',
          region: '$location.region'
        };
        break;
      case 'city':
        groupField = {
          city: '$location.city',
          region: '$location.region'
        };
        break;
      case 'region':
        groupField = {
          region: '$location.region'
        };
        break;
      default:
        groupField = {
          district: '$location.district',
          city: '$location.city'
        };
    }

    const geographicDistribution = await ArticleView.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: groupField,
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
          avgViewDuration: { $avg: '$viewDuration' },
          uniqueVisitors: { $addToSet: '$visitorId' },
          categories: { $push: '$articleCategory' },
          devices: { $push: '$device.type' },
          hours: { $push: { $hour: '$viewedAt' } },
          coordinates: {
            $first: {
              latitude: '$location.latitude',
              longitude: '$location.longitude'
            }
          }
        }
      },
      { $sort: { totalViews: -1 } },
      {
        $project: {
          location: '$_id',
          totalViews: 1,
          uniqueViews: 1,
          avgViewDuration: { $round: ['$avgViewDuration', 2] },
          uniqueVisitors: { $size: '$uniqueVisitors' },
          coordinates: 1,
          topCategories: {
            $slice: [
              {
                $map: {
                  input: { $setUnion: ['$categories', []] },
                  as: 'category',
                  in: {
                    category: '$$category',
                    count: {
                      $size: {
                        $filter: {
                          input: '$categories',
                          cond: { $eq: ['$$this', '$$category'] }
                        }
                      }
                    },
                    percentage: {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: [
                                {
                                  $size: {
                                    $filter: {
                                      input: '$categories',
                                      cond: { $eq: ['$$this', '$$category'] }
                                    }
                                  }
                                },
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
              },
              5
            ]
          },
          deviceBreakdown: {
            desktop: {
              $size: {
                $filter: {
                  input: '$devices',
                  cond: { $eq: ['$$this', 'desktop'] }
                }
              }
            },
            mobile: {
              $size: {
                $filter: {
                  input: '$devices',
                  cond: { $eq: ['$$this', 'mobile'] }
                }
              }
            },
            tablet: {
              $size: {
                $filter: {
                  input: '$devices',
                  cond: { $eq: ['$$this', 'tablet'] }
                }
              }
            }
          },
          peakHours: {
            $map: {
              input: { $range: [0, 24] },
              as: 'hour',
              in: {
                hour: '$$hour',
                views: {
                  $size: {
                    $filter: {
                      input: '$hours',
                      cond: { $eq: ['$$this', '$$hour'] }
                    }
                  }
                }
              }
            }
          }
        }
      }
    ]);

    // 2. Pontianak Districts Specific Analysis
    const pontianakDistricts = [
      'Pontianak Utara',
      'Pontianak Timur', 
      'Pontianak Selatan',
      'Pontianak Barat',
      'Pontianak Kota',
      'Pontianak Tenggara'
    ];

    const pontianakAnalysis = await ArticleView.aggregate([
      { 
        $match: {
          ...baseFilter,
          'location.district': { $in: pontianakDistricts }
        }
      },
      {
        $group: {
          _id: '$location.district',
          totalViews: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
          avgViewDuration: { $avg: '$viewDuration' },
          uniqueVisitors: { $addToSet: '$visitorId' },
          topCategories: { $push: '$articleCategory' },
          readingTimes: { $push: { $hour: '$viewedAt' } },
          coordinates: {
            $first: {
              latitude: '$location.latitude',
              longitude: '$location.longitude'
            }
          }
        }
      },
      { $sort: { totalViews: -1 } },
      {
        $project: {
          district: '$_id',
          totalViews: 1,
          uniqueViews: 1,
          avgViewDuration: { $round: ['$avgViewDuration', 2] },
          uniqueVisitors: { $size: '$uniqueVisitors' },
          coordinates: 1,
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
          },
          mostPopularCategory: {
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
          },
          peakReadingHour: {
            $arrayElemAt: [
              {
                $map: {
                  input: { $setUnion: ['$readingTimes', []] },
                  as: 'hour',
                  in: {
                    hour: '$$hour',
                    count: {
                      $size: {
                        $filter: {
                          input: '$readingTimes',
                          cond: { $eq: ['$$this', '$$hour'] }
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

    // 3. Time-based Geographic Trends
    const geographicTrends = await ArticleView.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$viewedAt'
              }
            },
            district: '$location.district'
          },
          views: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } }
        }
      },
      { $sort: { '_id.date': 1 } },
      {
        $group: {
          _id: '$_id.district',
          dailyData: {
            $push: {
              date: '$_id.date',
              views: '$views',
              uniqueViews: '$uniqueViews'
            }
          },
          totalViews: { $sum: '$views' }
        }
      },
      { $sort: { totalViews: -1 } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        geographicDistribution,
        pontianakAnalysis,
        geographicTrends,
        summary: {
          totalLocations: geographicDistribution.length,
          pontianakDistricts: pontianakAnalysis.length,
          period,
          groupBy,
          filters: {
            district,
            category
          }
        }
      }
    });

  } catch (error) {
    console.error('Error fetching geographic analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
