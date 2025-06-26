import mongoose from 'mongoose';

export interface IArticleView extends mongoose.Document {
  articleId: mongoose.Types.ObjectId;
  articleSlug: string;
  articleTitle: string;
  articleCategory: string;
  articleAuthor: string;
  visitorId?: string;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  sessionId?: string;
  viewDuration?: number; // in seconds
  isUniqueView: boolean;
  location?: {
    country?: string;
    region?: string;
    city?: string;
    district?: string; // For Pontianak districts
    latitude?: number;
    longitude?: number;
    timezone?: string;
  };
  device?: {
    type: 'desktop' | 'mobile' | 'tablet';
    os?: string;
    browser?: string;
  };
  viewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleViewSchema = new mongoose.Schema<IArticleView>({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News',
    required: true,
    index: true
  },
  articleSlug: {
    type: String,
    required: true,
    index: true
  },
  articleTitle: {
    type: String,
    required: true
  },
  articleCategory: {
    type: String,
    required: true,
    index: true
  },
  articleAuthor: {
    type: String,
    required: true,
    index: true
  },
  visitorId: {
    type: String,
    index: true
  },
  ipAddress: {
    type: String,
    required: true,
    index: true
  },
  userAgent: {
    type: String,
    required: true
  },
  referrer: {
    type: String
  },
  sessionId: {
    type: String,
    index: true
  },
  viewDuration: {
    type: Number,
    default: 0
  },
  isUniqueView: {
    type: Boolean,
    default: true,
    index: true
  },
  location: {
    country: String,
    region: String,
    city: String,
    district: String,
    latitude: Number,
    longitude: Number,
    timezone: String
  },
  device: {
    type: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet'],
      default: 'desktop'
    },
    os: String,
    browser: String
  },
  viewedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  collection: 'articleviews'
});

// Compound indexes for analytics queries - conditional creation
try {
  ArticleViewSchema.index({ articleId: 1, viewedAt: -1 });
  ArticleViewSchema.index({ articleCategory: 1, viewedAt: -1 });
  ArticleViewSchema.index({ 'location.district': 1, viewedAt: -1 });
  ArticleViewSchema.index({ 'location.city': 1, articleCategory: 1 });
  ArticleViewSchema.index({ viewedAt: -1, isUniqueView: 1 });
  ArticleViewSchema.index({ ipAddress: 1, articleId: 1, viewedAt: -1 });
} catch (error) {
  // Indexes already exist, ignore error
}

// Virtual for formatted date
ArticleViewSchema.virtual('formattedDate').get(function() {
  return this.viewedAt.toLocaleDateString('id-ID');
});

// Static method for analytics aggregation
ArticleViewSchema.statics.getViewAnalytics = function(filters: any = {}) {
  const pipeline = [];
  
  // Match stage
  if (Object.keys(filters).length > 0) {
    pipeline.push({ $match: filters });
  }
  
  // Group by article
  pipeline.push({
    $group: {
      _id: '$articleId',
      articleSlug: { $first: '$articleSlug' },
      articleTitle: { $first: '$articleTitle' },
      articleCategory: { $first: '$articleCategory' },
      articleAuthor: { $first: '$articleAuthor' },
      totalViews: { $sum: 1 },
      uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
      avgViewDuration: { $avg: '$viewDuration' },
      lastViewed: { $max: '$viewedAt' },
      firstViewed: { $min: '$viewedAt' }
    }
  });
  
  return this.aggregate(pipeline);
};

// Static method for geographic analytics
ArticleViewSchema.statics.getGeographicAnalytics = function(filters: any = {}) {
  const pipeline = [];
  
  if (Object.keys(filters).length > 0) {
    pipeline.push({ $match: filters });
  }
  
  pipeline.push({
    $group: {
      _id: {
        district: '$location.district',
        city: '$location.city',
        region: '$location.region'
      },
      totalViews: { $sum: 1 },
      uniqueViews: { $sum: { $cond: ['$isUniqueView', 1, 0] } },
      categories: { $addToSet: '$articleCategory' },
      avgViewDuration: { $avg: '$viewDuration' },
      coordinates: {
        $first: {
          latitude: '$location.latitude',
          longitude: '$location.longitude'
        }
      }
    }
  });
  
  return this.aggregate(pipeline);
};

export default mongoose.models.ArticleView || mongoose.model<IArticleView>('ArticleView', ArticleViewSchema);
