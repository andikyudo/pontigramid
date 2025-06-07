import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  articleCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add virtual for article count
CategorySchema.virtual('articles', {
  ref: 'News',
  localField: 'slug',
  foreignField: 'category',
  count: true
});

// Update article count when category is saved
CategorySchema.pre('save', async function() {
  if (this.isNew) {
    this.articleCount = 0;
  }
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default Category;
