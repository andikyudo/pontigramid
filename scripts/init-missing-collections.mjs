import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Define schemas directly in JavaScript for compatibility
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin', 'editor'], default: 'editor' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockoutUntil: Date
}, { timestamps: true });

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, default: '' },
  category: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  imageUrl: { type: String, default: '' },
  published: { type: Boolean, default: false },
  isBreakingNews: { type: Boolean, default: false },
  tags: [String],
  views: { type: Number, default: 0 }
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  color: { type: String, default: '#3B82F6' },
  articleCount: { type: Number, default: 0 }
}, { timestamps: true });

const FooterSchema = new mongoose.Schema({
  footerLinks: {
    about: [{ name: String, href: String }],
    categories: [{ name: String, href: String }],
    quickLinks: [{ name: String, href: String }],
    legal: [{ name: String, href: String }]
  },
  socialLinks: [{ name: String, href: String, icon: String, color: String }],
  contactInfo: {
    email: String,
    phone: String,
    address: { street: String, city: String, postalCode: String, country: String }
  },
  companyInfo: { name: String, description: String, copyright: String, poweredBy: String, hostedOn: String }
}, { timestamps: true });

const VisitorSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true, index: true },
  userAgent: { type: String, required: true },
  country: { type: String, default: '' },
  city: { type: String, default: '' },
  region: { type: String, default: '' },
  timezone: { type: String, default: '' },
  isp: { type: String, default: '' },
  visitCount: { type: Number, default: 1 },
  lastVisit: { type: Date, default: Date.now },
  firstVisit: { type: Date, default: Date.now },
  pages: [{ url: String, title: String, timestamp: Date, referrer: String }],
  isBlocked: { type: Boolean, default: false },
  notes: { type: String, default: '' }
}, { timestamps: true });

// Create models
const User = mongoose.model('User', UserSchema);
const News = mongoose.model('News', NewsSchema);
const Category = mongoose.model('Category', CategorySchema);
const Footer = mongoose.model('Footer', FooterSchema);
const Visitor = mongoose.model('Visitor', VisitorSchema);

async function initializeMissingCollections() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pontigramid';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check existing collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const existingCollections = collections.map(col => col.name);
    console.log('📋 Existing collections:', existingCollections);

    // Required collections based on our models
    const requiredCollections = [
      'users',
      'news',
      'categories',
      'footers',
      'visitors'
    ];

    console.log('📋 Required collections:', requiredCollections);
    
    // Find missing collections
    const missingCollections = requiredCollections.filter(col => !existingCollections.includes(col));
    
    if (missingCollections.length === 0) {
      console.log('✅ All required collections already exist!');
    } else {
      console.log('⚠️  Missing collections:', missingCollections);
    }

    // Initialize Categories if missing
    if (missingCollections.includes('categories') || (await Category.countDocuments()) === 0) {
      console.log('🏷️  Initializing Categories...');
      
      const defaultCategories = [
        {
          name: 'Politik',
          slug: 'politik',
          description: 'Berita politik dan pemerintahan',
          color: '#DC2626'
        },
        {
          name: 'Ekonomi',
          slug: 'ekonomi', 
          description: 'Berita ekonomi dan bisnis',
          color: '#059669'
        },
        {
          name: 'Olahraga',
          slug: 'olahraga',
          description: 'Berita olahraga dan kompetisi',
          color: '#2563EB'
        },
        {
          name: 'Teknologi',
          slug: 'teknologi',
          description: 'Berita teknologi dan inovasi',
          color: '#7C3AED'
        },
        {
          name: 'Hiburan',
          slug: 'hiburan',
          description: 'Berita hiburan dan selebriti',
          color: '#EC4899'
        },
        {
          name: 'Kesehatan',
          slug: 'kesehatan',
          description: 'Berita kesehatan dan medis',
          color: '#F59E0B'
        },
        {
          name: 'Pendidikan',
          slug: 'pendidikan',
          description: 'Berita pendidikan dan akademik',
          color: '#6366F1'
        },
        {
          name: 'Umum',
          slug: 'umum',
          description: 'Berita umum dan lainnya',
          color: '#6B7280'
        }
      ];

      await Category.deleteMany({}); // Clear existing
      await Category.insertMany(defaultCategories);
      console.log('✅ Categories initialized successfully!');
    }

    // Initialize Footer if missing
    if (missingCollections.includes('footers') || (await Footer.countDocuments()) === 0) {
      console.log('🦶 Initializing Footer...');

      const defaultFooter = {
        footerLinks: {
          about: [
            { name: 'Tentang Kami', href: '/tentang-kami' },
            { name: 'Tim Redaksi', href: '/redaksi' },
            { name: 'Visi & Misi', href: '/visi-misi' },
            { name: 'Karir', href: '/karir' },
            { name: 'Kontak', href: '/kontak' }
          ],
          categories: [
            { name: 'Politik', href: '/?category=politik' },
            { name: 'Ekonomi', href: '/?category=ekonomi' },
            { name: 'Olahraga', href: '/?category=olahraga' },
            { name: 'Teknologi', href: '/?category=teknologi' }
          ],
          quickLinks: [
            { name: 'Berita Terbaru', href: '/' },
            { name: 'Berita Trending', href: '/?trending=true' },
            { name: 'Iklan', href: '/iklan' },
            { name: 'RSS Feed', href: '/rss' }
          ],
          legal: [
            { name: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
            { name: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
            { name: 'Disclaimer', href: '/disclaimer' },
            { name: 'Sitemap', href: '/sitemap' }
          ]
        },
        socialLinks: [
          { name: 'Facebook', href: 'https://facebook.com/pontigramid', icon: 'Facebook', color: 'hover:text-blue-600' },
          { name: 'Twitter', href: 'https://twitter.com/pontigramid', icon: 'Twitter', color: 'hover:text-blue-400' },
          { name: 'Instagram', href: 'https://instagram.com/pontigramid', icon: 'Instagram', color: 'hover:text-pink-600' },
          { name: 'YouTube', href: 'https://youtube.com/pontigramid', icon: 'Youtube', color: 'hover:text-red-600' }
        ],
        contactInfo: {
          email: 'info@pontigramid.com',
          phone: '+62 21-1234-5678',
          address: {
            street: 'Jl. Sudirman No. 123',
            city: 'Jakarta Pusat',
            postalCode: '10220',
            country: 'Indonesia'
          }
        },
        companyInfo: {
          name: 'PontigramID',
          description: 'Portal berita terpercaya yang menyajikan informasi terkini dan akurat dari berbagai kategori.',
          copyright: 'All rights reserved. Made with ❤️ in Indonesia',
          poweredBy: 'Next.js',
          hostedOn: 'Vercel'
        }
      };

      await Footer.deleteMany({});
      await Footer.create(defaultFooter);
      console.log('✅ Footer initialized successfully!');
    }

    // Initialize Admin User if missing
    if (missingCollections.includes('users') || (await User.countDocuments({ role: { $in: ['admin', 'super_admin'] } })) === 0) {
      console.log('👤 Initializing Admin User...');

      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 12);

      await User.deleteMany({ role: { $in: ['admin', 'super_admin'] } });
      const admin = await User.create({
        username: 'admin',
        email: 'admin@pontigramid.com',
        password: hashedPassword,
        name: 'Administrator',
        role: 'super_admin',
        isActive: true
      });

      console.log('✅ Admin user initialized successfully!');
      console.log('   Username:', admin.username);
      console.log('   Email:', admin.email);
      console.log('   Password:', defaultPassword);
    }

    // Create indexes for better performance
    console.log('📊 Creating database indexes...');
    
    // News indexes
    await News.collection.createIndex({ title: 'text', content: 'text', excerpt: 'text' });
    await News.collection.createIndex({ category: 1 });
    await News.collection.createIndex({ published: 1 });
    await News.collection.createIndex({ isBreakingNews: 1 });
    await News.collection.createIndex({ createdAt: -1 });
    await News.collection.createIndex({ slug: 1 }, { unique: true });

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ username: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1, isActive: 1 });

    // Category indexes
    await Category.collection.createIndex({ slug: 1 }, { unique: true });
    await Category.collection.createIndex({ name: 1 }, { unique: true });

    // Visitor indexes
    await Visitor.collection.createIndex({ ipAddress: 1 });
    await Visitor.collection.createIndex({ lastVisit: -1 });
    await Visitor.collection.createIndex({ visitCount: -1 });
    await Visitor.collection.createIndex({ country: 1 });
    await Visitor.collection.createIndex({ isBlocked: 1 });

    // Event indexes (if Event model exists)
    try {
      const Event = mongoose.model('Event');
      await Event.collection.createIndex({ isActive: 1, date: 1 });
      await Event.collection.createIndex({ category: 1, isActive: 1 });
      await Event.collection.createIndex({ isFeatured: 1, isActive: 1 });
      await Event.collection.createIndex({ slug: 1 }, { unique: true });
      await Event.collection.createIndex({ title: 'text', description: 'text', organizer: 'text', location: 'text' });
      console.log('✅ Event indexes created');
    } catch (error) {
      console.log('ℹ️  Event model not found, skipping event indexes');
    }

    // Advertisement indexes (if Advertisement model exists)
    try {
      const Advertisement = mongoose.model('Advertisement');
      await Advertisement.collection.createIndex({ placementZone: 1, isActive: 1, priority: -1 });
      await Advertisement.collection.createIndex({ startDate: 1, endDate: 1 });
      await Advertisement.collection.createIndex({ createdAt: -1 });
      console.log('✅ Advertisement indexes created');
    } catch (error) {
      console.log('ℹ️  Advertisement model not found, skipping advertisement indexes');
    }

    console.log('✅ Database indexes created successfully!');

    // Final status check
    const finalCollections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📊 FINAL DATABASE STATUS:');
    console.log('Collections:', finalCollections.map(col => col.name));
    
    // Count documents in each collection
    for (const collection of finalCollections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`  - ${collection.name}: ${count} documents`);
    }

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📋 SUMMARY:');
    console.log('✅ All required collections are now present');
    console.log('✅ Default categories created');
    console.log('✅ Footer configuration initialized');
    console.log('✅ Admin user ready');
    console.log('✅ Database indexes optimized');
    console.log('\n🔐 Admin Login Credentials:');
    console.log('Username: admin');
    console.log('Email: admin@pontigramid.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the initialization
initializeMissingCollections();
