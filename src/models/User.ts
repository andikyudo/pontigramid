import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'super_admin' | 'editor';
  isActive: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockoutUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username wajib diisi'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username minimal 3 karakter'],
    maxlength: [30, 'Username maksimal 30 karakter'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username hanya boleh mengandung huruf, angka, dan underscore']
  },
  email: {
    type: String,
    required: [true, 'Email wajib diisi'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Format email tidak valid']
  },
  password: {
    type: String,
    required: [true, 'Password wajib diisi'],
    minlength: [6, 'Password minimal 6 karakter']
  },
  name: {
    type: String,
    required: [true, 'Nama wajib diisi'],
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin', 'editor'],
    default: 'editor'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockoutUntil: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for performance - conditional creation
try {
  UserSchema.index({ username: 1 }, { unique: true });
  UserSchema.index({ email: 1 }, { unique: true });
  UserSchema.index({ role: 1, isActive: 1 });
} catch (error) {
  // Indexes already exist, ignore error
}

// Virtual for checking if account is locked
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockoutUntil && this.lockoutUntil.getTime() > Date.now());
});

// Static method to create default admin
UserSchema.statics.createDefaultAdmin = async function() {

  const existingAdmin = await this.findOne({ role: { $in: ['admin', 'super_admin'] } });
  if (existingAdmin) {
    return existingAdmin;
  }

  const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 12);

  const admin = await this.create({
    username: 'admin',
    email: 'admin@pontigramid.com',
    password: hashedPassword,
    name: 'Administrator',
    role: 'super_admin',
    isActive: true
  });

  console.log('Default admin created:', {
    username: 'admin',
    email: 'admin@pontigramid.com',
    password: defaultPassword,
    role: 'super_admin'
  });

  return admin;
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
