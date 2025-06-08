import mongoose, { Document, Schema } from 'mongoose';

export interface INews extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  imageUrl?: string;
  published: boolean;
  isBreakingNews: boolean;
  tags: string[];
  views: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>({
  title: {
    type: String,
    required: [true, 'Judul berita wajib diisi'],
    trim: true,
    maxlength: [200, 'Judul tidak boleh lebih dari 200 karakter']
  },
  content: {
    type: String,
    required: [true, 'Konten berita wajib diisi']
  },
  excerpt: {
    type: String,
    default: '',
    maxlength: [300, 'Ringkasan tidak boleh lebih dari 300 karakter']
  },
  category: {
    type: String,
    required: [true, 'Kategori wajib dipilih'],
    enum: ['politik', 'ekonomi', 'olahraga', 'teknologi', 'hiburan', 'kesehatan', 'pendidikan', 'umum']
  },
  author: {
    type: String,
    default: 'Admin',
    trim: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  published: {
    type: Boolean,
    default: false
  },
  isBreakingNews: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  views: {
    type: Number,
    default: 0
  },
  seoTitle: {
    type: String,
    default: ''
  },
  seoDescription: {
    type: String,
    default: ''
  },
  seoKeywords: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index untuk pencarian
NewsSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
NewsSchema.index({ category: 1 });
NewsSchema.index({ published: 1 });
NewsSchema.index({ isBreakingNews: 1 });
NewsSchema.index({ createdAt: -1 });

// Middleware untuk membuat slug otomatis
NewsSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

export default mongoose.models.News || mongoose.model<INews>('News', NewsSchema);
