import mongoose, { Document } from 'mongoose';

export interface IVisitor extends Document {
  ipAddress: string;
  userAgent: string;
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
  isp?: string;
  visitCount: number;
  lastVisit: Date;
  firstVisit: Date;
  pages: Array<{
    url: string;
    title?: string;
    timestamp: Date;
    referrer?: string;
  }>;
  isBlocked: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VisitorSchema = new mongoose.Schema<IVisitor>({
  ipAddress: {
    type: String,
    required: true,
    index: true
  },
  userAgent: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  region: {
    type: String,
    default: ''
  },
  timezone: {
    type: String,
    default: ''
  },
  isp: {
    type: String,
    default: ''
  },
  visitCount: {
    type: Number,
    default: 1
  },
  lastVisit: {
    type: Date,
    default: Date.now
  },
  firstVisit: {
    type: Date,
    default: Date.now
  },
  pages: [{
    url: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    referrer: {
      type: String,
      default: ''
    }
  }],
  isBlocked: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for performance
VisitorSchema.index({ ipAddress: 1 });
VisitorSchema.index({ lastVisit: -1 });
VisitorSchema.index({ visitCount: -1 });
VisitorSchema.index({ country: 1 });
VisitorSchema.index({ isBlocked: 1 });

// Virtual for getting location string
VisitorSchema.virtual('location').get(function() {
  const parts = [this.city, this.region, this.country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Unknown';
});

// Static method to track visitor
VisitorSchema.statics.trackVisitor = async function(ipAddress: string, userAgent: string, pageUrl: string, pageTitle?: string, referrer?: string) {
  try {
    let visitor = await this.findOne({ ipAddress });
    
    if (visitor) {
      // Update existing visitor
      visitor.visitCount += 1;
      visitor.lastVisit = new Date();
      visitor.userAgent = userAgent; // Update user agent in case it changed
      
      // Add page visit
      visitor.pages.push({
        url: pageUrl,
        title: pageTitle || '',
        timestamp: new Date(),
        referrer: referrer || ''
      });
      
      // Keep only last 50 page visits to prevent document from growing too large
      if (visitor.pages.length > 50) {
        visitor.pages = visitor.pages.slice(-50);
      }
      
      await visitor.save();
    } else {
      // Create new visitor
      visitor = await this.create({
        ipAddress,
        userAgent,
        visitCount: 1,
        firstVisit: new Date(),
        lastVisit: new Date(),
        pages: [{
          url: pageUrl,
          title: pageTitle || '',
          timestamp: new Date(),
          referrer: referrer || ''
        }]
      });
      
      // Try to get location info (optional - requires external API)
      try {
        const locationInfo = await getLocationInfo(ipAddress);
        if (locationInfo) {
          visitor.country = locationInfo.country || '';
          visitor.city = locationInfo.city || '';
          visitor.region = locationInfo.region || '';
          visitor.timezone = locationInfo.timezone || '';
          visitor.isp = locationInfo.isp || '';
          await visitor.save();
        }
      } catch (error) {
        console.log('Location info not available:', error instanceof Error ? error.message : 'Unknown error');
      }
    }
    
    return visitor;
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return null;
  }
};

// Helper function to get location info (optional)
async function getLocationInfo(ipAddress: string) {
  // Skip for local/private IPs
  if (ipAddress === '127.0.0.1' || ipAddress === '::1' || ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.') || ipAddress.startsWith('172.')) {
    return {
      country: 'Local',
      city: 'Local',
      region: 'Local',
      timezone: 'Local',
      isp: 'Local Network'
    };
  }
  
  try {
    // Using free ipapi.co service (no API key required for basic info)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country_name || '',
        city: data.city || '',
        region: data.region || '',
        timezone: data.timezone || '',
        isp: data.org || ''
      };
    }
  } catch (error) {
    console.log('Failed to get location info:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  return null;
}

export default mongoose.models.Visitor || mongoose.model<IVisitor>('Visitor', VisitorSchema);
