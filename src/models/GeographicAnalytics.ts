import mongoose from 'mongoose';

export interface IGeographicAnalytics extends mongoose.Document {
  date: Date;
  location: {
    country: string;
    region: string;
    city: string;
    district?: string; // Pontianak districts
    latitude?: number;
    longitude?: number;
  };
  metrics: {
    totalViews: number;
    uniqueViews: number;
    totalVisitors: number;
    avgSessionDuration: number;
    bounceRate: number;
    topCategories: Array<{
      category: string;
      views: number;
      percentage: number;
    }>;
    peakHours: Array<{
      hour: number;
      views: number;
    }>;
    deviceBreakdown: {
      desktop: number;
      mobile: number;
      tablet: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const GeographicAnalyticsSchema = new mongoose.Schema<IGeographicAnalytics>({
  date: {
    type: Date,
    required: true,
    index: true
  },
  location: {
    country: {
      type: String,
      required: true,
      index: true
    },
    region: {
      type: String,
      required: true,
      index: true
    },
    city: {
      type: String,
      required: true,
      index: true
    },
    district: {
      type: String,
      index: true
    },
    latitude: Number,
    longitude: Number
  },
  metrics: {
    totalViews: {
      type: Number,
      default: 0
    },
    uniqueViews: {
      type: Number,
      default: 0
    },
    totalVisitors: {
      type: Number,
      default: 0
    },
    avgSessionDuration: {
      type: Number,
      default: 0
    },
    bounceRate: {
      type: Number,
      default: 0
    },
    topCategories: [{
      category: String,
      views: Number,
      percentage: Number
    }],
    peakHours: [{
      hour: Number,
      views: Number
    }],
    deviceBreakdown: {
      desktop: {
        type: Number,
        default: 0
      },
      mobile: {
        type: Number,
        default: 0
      },
      tablet: {
        type: Number,
        default: 0
      }
    }
  }
}, {
  timestamps: true,
  collection: 'geographicanalytics'
});

// Compound indexes
GeographicAnalyticsSchema.index({ date: -1, 'location.district': 1 });
GeographicAnalyticsSchema.index({ 'location.city': 1, date: -1 });
GeographicAnalyticsSchema.index({ date: -1, 'metrics.totalViews': -1 });

// Static method to aggregate daily analytics
GeographicAnalyticsSchema.statics.aggregateDailyAnalytics = async function(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  // This would typically be called by a cron job
  // to aggregate ArticleView data into daily summaries
  const ArticleView = mongoose.model('ArticleView');
  
  const pipeline = [
    {
      $match: {
        viewedAt: { $gte: startOfDay, $lte: endOfDay },
        'location.city': { $exists: true }
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
        totalVisitors: { $addToSet: '$visitorId' },
        avgViewDuration: { $avg: '$viewDuration' },
        categories: { $push: '$articleCategory' },
        hours: { $push: { $hour: '$viewedAt' } },
        devices: { $push: '$device.type' },
        coordinates: {
          $first: {
            latitude: '$location.latitude',
            longitude: '$location.longitude'
          }
        }
      }
    },
    {
      $project: {
        location: {
          country: '$_id.country',
          region: '$_id.region',
          city: '$_id.city',
          district: '$_id.district',
          latitude: '$coordinates.latitude',
          longitude: '$coordinates.longitude'
        },
        metrics: {
          totalViews: '$totalViews',
          uniqueViews: '$uniqueViews',
          totalVisitors: { $size: '$totalVisitors' },
          avgSessionDuration: '$avgViewDuration',
          bounceRate: {
            $multiply: [
              { $divide: [
                { $subtract: ['$totalViews', '$uniqueViews'] },
                '$totalViews'
              ]},
              100
            ]
          },
          topCategories: {
            $map: {
              input: { $setUnion: ['$categories', []] },
              as: 'category',
              in: {
                category: '$$category',
                views: {
                  $size: {
                    $filter: {
                      input: '$categories',
                      cond: { $eq: ['$$this', '$$category'] }
                    }
                  }
                },
                percentage: {
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
          }
        },
        date: new Date(date)
      }
    }
  ];
  
  const results = await ArticleView.aggregate(pipeline);
  
  // Upsert the results
  for (const result of results) {
    await this.findOneAndUpdate(
      {
        date: result.date,
        'location.city': result.location.city,
        'location.district': result.location.district
      },
      result,
      { upsert: true, new: true }
    );
  }
  
  return results;
};

export default mongoose.models.GeographicAnalytics || mongoose.model<IGeographicAnalytics>('GeographicAnalytics', GeographicAnalyticsSchema);
