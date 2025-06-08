import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required');
  process.exit(1);
}

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockoutUntil: { type: Date }
}, {
  timestamps: true
});

// News Schema
const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  published: { type: Boolean, default: false },
  isBreakingNews: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  tags: [{ type: String }]
}, {
  timestamps: true
});

// Category Schema
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  color: { type: String, default: '#3B82F6' },
  icon: { type: String, default: 'FileText' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Footer Schema
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
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: String
    }
  },
  companyInfo: {
    name: String,
    description: String,
    copyright: String,
    poweredBy: String,
    hostedOn: String
  },
  newsletter: {
    title: String,
    description: String,
    placeholder: String
  }
}, {
  timestamps: true
});

// Visitor Schema
const VisitorSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true, index: true },
  userAgent: { type: String, required: true },
  country: { type: String, default: '' },
  city: { type: String, default: '' },
  region: { type: String, default: '' },
  timezone: { type: String, default: '' },
  isp: { type: String, default: '' },
  firstVisit: { type: Date, default: Date.now },
  lastVisit: { type: Date, default: Date.now },
  visitCount: { type: Number, default: 1 },
  pages: [{
    url: String,
    title: String,
    visitedAt: { type: Date, default: Date.now },
    referrer: String
  }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

async function setupProductionDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Create models
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const News = mongoose.models.News || mongoose.model('News', NewsSchema);
    const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
    const Footer = mongoose.models.Footer || mongoose.model('Footer', FooterSchema);
    const Visitor = mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);

    console.log('📊 Setting up database collections...');

    // 1. Create default admin user
    console.log('👤 Creating default admin user...');
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (!adminExists) {
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 12);
      
      await User.create({
        username: 'admin',
        email: 'admin@pontigramid.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      });
      
      console.log('✅ Default admin user created');
      console.log(`   Username: admin`);
      console.log(`   Password: ${defaultPassword}`);
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // 2. Create default categories
    console.log('📂 Creating default categories...');
    const defaultCategories = [
      { name: 'Politik', slug: 'politik', description: 'Berita politik dan pemerintahan', color: '#DC2626', icon: 'Users' },
      { name: 'Ekonomi', slug: 'ekonomi', description: 'Berita ekonomi dan bisnis', color: '#059669', icon: 'TrendingUp' },
      { name: 'Olahraga', slug: 'olahraga', description: 'Berita olahraga dan kompetisi', color: '#7C3AED', icon: 'Trophy' },
      { name: 'Teknologi', slug: 'teknologi', description: 'Berita teknologi dan inovasi', color: '#2563EB', icon: 'Smartphone' },
      { name: 'Hiburan', slug: 'hiburan', description: 'Berita hiburan dan selebriti', color: '#DB2777', icon: 'Music' },
      { name: 'Kesehatan', slug: 'kesehatan', description: 'Berita kesehatan dan medis', color: '#16A34A', icon: 'Heart' },
      { name: 'Pendidikan', slug: 'pendidikan', description: 'Berita pendidikan dan akademik', color: '#EA580C', icon: 'BookOpen' }
    ];

    for (const category of defaultCategories) {
      const exists = await Category.findOne({ slug: category.slug });
      if (!exists) {
        await Category.create(category);
        console.log(`   ✅ Created category: ${category.name}`);
      }
    }

    // 3. Create sample news articles
    console.log('📰 Creating sample news articles...');
    const sampleNews = [
      {
        title: 'Selamat Datang di PontigramID - Portal Berita Terpercaya',
        slug: 'selamat-datang-di-pontigramid-portal-berita-terpercaya',
        content: `
          <h2>Selamat Datang di PontigramID</h2>
          <p>PontigramID adalah portal berita digital yang berkomitmen menyajikan informasi terkini, akurat, dan terpercaya untuk masyarakat Indonesia.</p>
          
          <h3>Visi Kami</h3>
          <p>Menjadi portal berita digital terpercaya dan terdepan di Indonesia yang memberikan kontribusi positif bagi kemajuan bangsa melalui penyebaran informasi yang akurat, edukatif, dan inspiratif.</p>
          
          <h3>Misi Kami</h3>
          <ul>
            <li>Menyajikan berita yang akurat, berimbang, dan dapat dipertanggungjawabkan</li>
            <li>Memberikan analisis mendalam terhadap isu-isu penting bangsa</li>
            <li>Mendukung transparansi dan akuntabilitas publik</li>
            <li>Mengedukasi masyarakat melalui konten yang berkualitas</li>
          </ul>
          
          <p>Terima kasih telah mempercayai PontigramID sebagai sumber informasi Anda.</p>
        `,
        excerpt: 'PontigramID adalah portal berita digital yang berkomitmen menyajikan informasi terkini, akurat, dan terpercaya untuk masyarakat Indonesia.',
        author: 'Tim Redaksi PontigramID',
        category: 'politik',
        imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop',
        published: true,
        isBreakingNews: false,
        views: 0,
        tags: ['welcome', 'pontigramid', 'portal berita']
      },
      {
        title: 'Perkembangan Teknologi AI di Indonesia Tahun 2024',
        slug: 'perkembangan-teknologi-ai-di-indonesia-tahun-2024',
        content: `
          <h2>Revolusi Teknologi AI di Indonesia</h2>
          <p>Tahun 2024 menjadi tahun yang menandai perkembangan pesat teknologi Artificial Intelligence (AI) di Indonesia. Berbagai sektor mulai mengadopsi teknologi ini untuk meningkatkan efisiensi dan produktivitas.</p>
          
          <h3>Sektor yang Terdampak</h3>
          <ul>
            <li><strong>Perbankan:</strong> Implementasi chatbot dan fraud detection</li>
            <li><strong>Kesehatan:</strong> Diagnosis medis berbasis AI</li>
            <li><strong>Pendidikan:</strong> Personalized learning systems</li>
            <li><strong>Transportasi:</strong> Smart traffic management</li>
          </ul>
          
          <h3>Tantangan dan Peluang</h3>
          <p>Meskipun memberikan banyak manfaat, adopsi AI juga menghadapi tantangan seperti kebutuhan SDM yang kompeten dan regulasi yang mendukung inovasi.</p>
          
          <p>Pemerintah Indonesia telah menyiapkan roadmap pengembangan AI nasional untuk memastikan Indonesia tidak tertinggal dalam revolusi teknologi ini.</p>
        `,
        excerpt: 'Tahun 2024 menjadi tahun yang menandai perkembangan pesat teknologi Artificial Intelligence (AI) di Indonesia dengan adopsi di berbagai sektor.',
        author: 'Dr. Teknologi',
        category: 'teknologi',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        published: true,
        isBreakingNews: true,
        views: 0,
        tags: ['AI', 'teknologi', 'indonesia', 'inovasi']
      },
      {
        title: 'Prestasi Gemilang Atlet Indonesia di Kompetisi Internasional',
        slug: 'prestasi-gemilang-atlet-indonesia-di-kompetisi-internasional',
        content: `
          <h2>Kebanggaan Indonesia di Kancah Internasional</h2>
          <p>Atlet-atlet Indonesia kembali mengharumkan nama bangsa dengan meraih prestasi gemilang di berbagai kompetisi internasional sepanjang tahun 2024.</p>
          
          <h3>Pencapaian Terbaru</h3>
          <ul>
            <li><strong>Badminton:</strong> Juara dunia kategori tunggal putra dan putri</li>
            <li><strong>Sepak Bola:</strong> Lolos ke babak final Piala Asia U-23</li>
            <li><strong>Renang:</strong> Memecahkan rekor nasional di SEA Games</li>
            <li><strong>Atletik:</strong> Medali emas lari marathon internasional</li>
          </ul>
          
          <h3>Dukungan Pemerintah</h3>
          <p>Prestasi ini tidak lepas dari dukungan penuh pemerintah melalui program pembinaan atlet nasional dan penyediaan fasilitas olahraga yang memadai.</p>
          
          <p>Ke depannya, Indonesia menargetkan peningkatan prestasi di ajang Olimpiade dan kompetisi internasional lainnya.</p>
        `,
        excerpt: 'Atlet-atlet Indonesia kembali mengharumkan nama bangsa dengan meraih prestasi gemilang di berbagai kompetisi internasional sepanjang tahun 2024.',
        author: 'Reporter Olahraga',
        category: 'olahraga',
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
        published: true,
        isBreakingNews: false,
        views: 0,
        tags: ['olahraga', 'prestasi', 'indonesia', 'internasional']
      }
    ];

    for (const article of sampleNews) {
      const exists = await News.findOne({ slug: article.slug });
      if (!exists) {
        await News.create(article);
        console.log(`   ✅ Created article: ${article.title}`);
      }
    }

    // 4. Create default footer
    console.log('🦶 Creating default footer...');
    const footerExists = await Footer.findOne();
    
    if (!footerExists) {
      await Footer.create({
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
          description: 'Portal berita terpercaya yang menyajikan informasi terkini dan akurat dari berbagai kategori. Komitmen kami adalah memberikan berita berkualitas untuk masyarakat Indonesia.',
          copyright: 'All rights reserved. Made with ❤️ in Indonesia',
          poweredBy: 'Next.js',
          hostedOn: 'Vercel'
        },
        newsletter: {
          title: 'Newsletter',
          description: 'Dapatkan ringkasan berita terbaru langsung di email Anda.',
          placeholder: 'Email Anda'
        }
      });
      
      console.log('✅ Default footer created');
    } else {
      console.log('ℹ️  Footer already exists');
    }

    console.log('\n🎉 Production database setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   👤 Admin user: admin / ${process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'}`);
    console.log(`   📂 Categories: ${defaultCategories.length} created`);
    console.log(`   📰 Sample articles: ${sampleNews.length} created`);
    console.log(`   🦶 Footer: configured`);
    console.log('\n🌐 Your application is now ready at: https://pontigramid.vercel.app');
    console.log('🔧 Admin panel: https://pontigramid.vercel.app/admin');

  } catch (error) {
    console.error('❌ Error setting up production database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Database connection closed');
  }
}

// Run the setup
setupProductionDatabase();
