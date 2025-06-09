import mongoose from 'mongoose';

export interface IAdvertisement {
  _id?: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  placementZone: 'header' | 'sidebar' | 'content' | 'footer' | 'mobile-inline';
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  clickCount: number;
  impressionCount: number;
  targetAudience?: string;
  priority: number; // Higher number = higher priority
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const advertisementSchema = new mongoose.Schema<IAdvertisement>({
  title: {
    type: String,
    required: [true, 'Judul iklan wajib diisi'],
    trim: true,
    maxlength: [100, 'Judul tidak boleh lebih dari 100 karakter']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Deskripsi tidak boleh lebih dari 500 karakter']
  },
  imageUrl: {
    type: String,
    required: [true, 'Gambar iklan wajib diupload']
  },
  linkUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Optional field
        return /^https?:\/\/.+/.test(v);
      },
      message: 'URL harus dimulai dengan http:// atau https://'
    }
  },
  placementZone: {
    type: String,
    required: [true, 'Zona penempatan wajib dipilih'],
    enum: {
      values: ['header', 'sidebar', 'content', 'footer', 'mobile-inline'],
      message: 'Zona penempatan tidak valid'
    }
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(this: IAdvertisement, v: Date) {
        if (!v || !this.startDate) return true;
        return v > this.startDate;
      },
      message: 'Tanggal berakhir harus setelah tanggal mulai'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  clickCount: {
    type: Number,
    default: 0,
    min: 0
  },
  impressionCount: {
    type: Number,
    default: 0,
    min: 0
  },
  targetAudience: {
    type: String,
    trim: true,
    maxlength: [200, 'Target audience tidak boleh lebih dari 200 karakter']
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  createdBy: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
advertisementSchema.index({ placementZone: 1, isActive: 1, priority: -1 });
advertisementSchema.index({ startDate: 1, endDate: 1 });
advertisementSchema.index({ createdAt: -1 });

// Virtual for checking if ad is currently active based on dates
advertisementSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date();
  const isDateActive = (!this.startDate || this.startDate <= now) && 
                      (!this.endDate || this.endDate >= now);
  return this.isActive && isDateActive;
});

// Static method to get active ads for a specific placement zone
advertisementSchema.statics.getActiveAds = function(placementZone: string, limit: number = 5) {
  const now = new Date();
  return this.find({
    placementZone,
    isActive: true,
    $or: [
      { startDate: { $lte: now }, endDate: { $gte: now } },
      { startDate: { $lte: now }, endDate: null },
      { startDate: null, endDate: { $gte: now } },
      { startDate: null, endDate: null }
    ]
  })
  .sort({ priority: -1, createdAt: -1 })
  .limit(limit);
};

// Method to increment click count
advertisementSchema.methods.incrementClick = function() {
  this.clickCount += 1;
  return this.save();
};

// Method to increment impression count
advertisementSchema.methods.incrementImpression = function() {
  this.impressionCount += 1;
  return this.save();
};

const Advertisement = mongoose.models.Advertisement || mongoose.model<IAdvertisement>('Advertisement', advertisementSchema);

export default Advertisement;
