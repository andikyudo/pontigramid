import mongoose from 'mongoose';

export interface IEvent {
  _id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  date: Date;
  time: string;
  location: string;
  category: 'konferensi' | 'seminar' | 'workshop' | 'pameran' | 'festival' | 'olahraga' | 'budaya' | 'pendidikan' | 'teknologi' | 'bisnis' | 'kesehatan' | 'lainnya';
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  maxParticipants?: number;
  currentParticipants: number;
  registrationRequired: boolean;
  registrationDeadline?: Date;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  organizer: string;
  tags: string[];
  price?: {
    amount: number;
    currency: string;
    isFree: boolean;
  };
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const eventSchema = new mongoose.Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Judul event wajib diisi'],
    trim: true,
    maxlength: [200, 'Judul tidak boleh lebih dari 200 karakter']
  },
  description: {
    type: String,
    required: [true, 'Deskripsi event wajib diisi'],
    trim: true,
    maxlength: [2000, 'Deskripsi tidak boleh lebih dari 2000 karakter']
  },
  imageUrl: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Tanggal event wajib diisi'],
    validate: {
      validator: function(v: Date) {
        return v >= new Date();
      },
      message: 'Tanggal event tidak boleh di masa lalu'
    }
  },
  time: {
    type: String,
    required: [true, 'Waktu event wajib diisi'],
    validate: {
      validator: function(v: string) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Format waktu harus HH:MM (24 jam)'
    }
  },
  location: {
    type: String,
    required: [true, 'Lokasi event wajib diisi'],
    trim: true,
    maxlength: [300, 'Lokasi tidak boleh lebih dari 300 karakter']
  },
  category: {
    type: String,
    required: [true, 'Kategori event wajib dipilih'],
    enum: {
      values: ['konferensi', 'seminar', 'workshop', 'pameran', 'festival', 'olahraga', 'budaya', 'pendidikan', 'teknologi', 'bisnis', 'kesehatan', 'lainnya'],
      message: 'Kategori event tidak valid'
    }
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^[a-z0-9-]+$/.test(v);
      },
      message: 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  maxParticipants: {
    type: Number,
    min: [1, 'Maksimal peserta minimal 1'],
    max: [10000, 'Maksimal peserta tidak boleh lebih dari 10.000']
  },
  currentParticipants: {
    type: Number,
    default: 0,
    min: 0
  },
  registrationRequired: {
    type: Boolean,
    default: false
  },
  registrationDeadline: {
    type: Date,
    validate: {
      validator: function(this: IEvent, v: Date) {
        if (!v || !this.registrationRequired) return true;
        return v <= this.date;
      },
      message: 'Deadline registrasi harus sebelum tanggal event'
    }
  },
  contactInfo: {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v: string) {
          if (!v) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Format email tidak valid'
      }
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          if (!v) return true;
          return /^[\d\s\-\+\(\)]+$/.test(v);
        },
        message: 'Format nomor telepon tidak valid'
      }
    },
    website: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          if (!v) return true;
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Website harus dimulai dengan http:// atau https://'
      }
    }
  },
  organizer: {
    type: String,
    required: [true, 'Penyelenggara event wajib diisi'],
    trim: true,
    maxlength: [200, 'Nama penyelenggara tidak boleh lebih dari 200 karakter']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  price: {
    amount: {
      type: Number,
      min: 0,
      default: 0
    },
    currency: {
      type: String,
      default: 'IDR',
      enum: ['IDR', 'USD']
    },
    isFree: {
      type: Boolean,
      default: true
    }
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
eventSchema.index({ date: 1, isActive: 1 });
eventSchema.index({ category: 1, isActive: 1 });
eventSchema.index({ slug: 1 });
eventSchema.index({ isFeatured: 1, date: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ createdAt: -1 });

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  return this.date > new Date();
});

// Virtual for checking if registration is open
eventSchema.virtual('isRegistrationOpen').get(function() {
  if (!this.registrationRequired) return false;
  const now = new Date();
  const isUpcoming = this.date > now;
  const deadlineCheck = !this.registrationDeadline || this.registrationDeadline > now;
  const capacityCheck = !this.maxParticipants || this.currentParticipants < this.maxParticipants;
  return this.isActive && isUpcoming && deadlineCheck && capacityCheck;
});

// Virtual for days until event
eventSchema.virtual('daysUntilEvent').get(function() {
  const now = new Date();
  const eventDate = new Date(this.date);
  const diffTime = eventDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Static method to get upcoming events
eventSchema.statics.getUpcomingEvents = function(limit: number = 10) {
  return this.find({
    isActive: true,
    date: { $gte: new Date() }
  })
  .sort({ date: 1 })
  .limit(limit);
};

// Static method to get featured events
eventSchema.statics.getFeaturedEvents = function(limit: number = 5) {
  return this.find({
    isActive: true,
    isFeatured: true,
    date: { $gte: new Date() }
  })
  .sort({ date: 1 })
  .limit(limit);
};

// Pre-save middleware to generate slug if not provided
eventSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;
