import mongoose from 'mongoose';

// Simplified analytics schema focused on reliability
export interface IReaderAnalytics extends mongoose.Document {
  articleSlug: string;
  articleTitle: string;
  articleCategory?: string;
  articleAuthor?: string;
  ipAddress: string;
  userAgent: string;
  country: string;
  region: string;
  city: string;
  viewedAt: Date;
  isUniqueView: boolean;
  sessionId: string;
  referrer: string;
  // Enhanced client tracking fields
  url?: string;
  pathname?: string;
  language?: string;
  platform?: string;
  screenResolution?: string;
  viewportSize?: string;
  timezone?: string;
  deviceType?: string;
  scrollDepth?: number;
  viewDuration?: number;
}

const ReaderAnalyticsSchema = new mongoose.Schema<IReaderAnalytics>({
  // Article information
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
    default: 'Uncategorized'
  },
  articleAuthor: {
    type: String,
    default: 'Unknown'
  },

  // Reader information
  ipAddress: {
    type: String,
    required: true,
    index: true
  },
  userAgent: {
    type: String,
    required: true
  },
  
  // Geographic data
  country: {
    type: String,
    default: 'Indonesia'
  },
  region: {
    type: String,
    default: 'Kalimantan Barat'
  },
  city: {
    type: String,
    default: 'Pontianak'
  },
  
  // Tracking data
  viewedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  isUniqueView: {
    type: Boolean,
    default: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true
  },
  referrer: {
    type: String,
    default: ''
  },

  // Enhanced client tracking fields
  url: {
    type: String,
    default: ''
  },
  pathname: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'id'
  },
  platform: {
    type: String,
    default: 'Unknown'
  },
  screenResolution: {
    type: String,
    default: 'Unknown'
  },
  viewportSize: {
    type: String,
    default: 'Unknown'
  },
  timezone: {
    type: String,
    default: 'Asia/Jakarta'
  },
  deviceType: {
    type: String,
    enum: ['Desktop', 'Mobile', 'Tablet'],
    default: 'Desktop'
  },
  scrollDepth: {
    type: Number,
    default: 0
  },
  viewDuration: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'reader_analytics'
});

// Essential indexes for performance
ReaderAnalyticsSchema.index({ articleSlug: 1, viewedAt: -1 });
ReaderAnalyticsSchema.index({ ipAddress: 1, articleSlug: 1, viewedAt: -1 });
ReaderAnalyticsSchema.index({ viewedAt: -1 });
ReaderAnalyticsSchema.index({ city: 1, viewedAt: -1 });
ReaderAnalyticsSchema.index({ isUniqueView: 1, viewedAt: -1 });

// TTL index for GDPR compliance (remove data after 2 years)
ReaderAnalyticsSchema.index({ viewedAt: 1 }, { expireAfterSeconds: 63072000 });

export default mongoose.models.ReaderAnalytics || mongoose.model('ReaderAnalytics', ReaderAnalyticsSchema);
