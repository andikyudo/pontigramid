import mongoose from 'mongoose';

export interface ITeamMember {
  _id?: string;
  name: string;
  position: string;
  bio: string;
  photo?: string;
  email?: string;
  phone?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const teamMemberSchema = new mongoose.Schema<ITeamMember>({
  name: {
    type: String,
    required: [true, 'Nama anggota tim wajib diisi'],
    trim: true,
    maxlength: [100, 'Nama tidak boleh lebih dari 100 karakter']
  },
  position: {
    type: String,
    required: [true, 'Posisi wajib diisi'],
    trim: true,
    maxlength: [100, 'Posisi tidak boleh lebih dari 100 karakter']
  },
  bio: {
    type: String,
    required: [true, 'Bio wajib diisi'],
    trim: true,
    maxlength: [1000, 'Bio tidak boleh lebih dari 1000 karakter']
  },
  photo: {
    type: String,
    default: null
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email: string) {
        if (!email) return true; // Email is optional
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Format email tidak valid'
    }
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(phone: string) {
        if (!phone) return true; // Phone is optional
        return /^[\+]?[1-9][\d]{0,15}$/.test(phone);
      },
      message: 'Format nomor telepon tidak valid'
    }
  },
  socialMedia: {
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    instagram: { type: String, trim: true },
    linkedin: { type: String, trim: true }
  },
  order: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Order tidak boleh negatif']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
teamMemberSchema.index({ order: 1, isActive: 1 });
teamMemberSchema.index({ name: 1 });
teamMemberSchema.index({ position: 1 });

// Virtual for formatted phone
teamMemberSchema.virtual('formattedPhone').get(function() {
  if (!this.phone) return null;
  
  // Format Indonesian phone numbers
  if (this.phone.startsWith('62')) {
    return `+${this.phone}`;
  } else if (this.phone.startsWith('0')) {
    return `+62${this.phone.substring(1)}`;
  }
  return this.phone;
});

// Pre-save middleware to handle order
teamMemberSchema.pre('save', async function(next) {
  if (this.isNew && this.order === 0) {
    // Auto-assign order for new team members
    const lastMember = await mongoose.model('TeamMember').findOne({}, {}, { sort: { order: -1 } });
    this.order = lastMember ? lastMember.order + 1 : 1;
  }
  next();
});

// Static method to reorder team members
teamMemberSchema.statics.reorderMembers = async function(memberIds: string[]) {
  const bulkOps = memberIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { order: index + 1 }
    }
  }));
  
  return this.bulkWrite(bulkOps);
};

// Static method to get active team members ordered
teamMemberSchema.statics.getActiveMembers = function() {
  return this.find({ isActive: true }).sort({ order: 1 });
};

const TeamMember = mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);

export default TeamMember;
