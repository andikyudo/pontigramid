/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/pontigramid');

// Define News schema (same as in the app)
const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300
  },
  category: {
    type: String,
    required: true,
    enum: ['politik', 'ekonomi', 'olahraga', 'teknologi', 'hiburan', 'kesehatan', 'pendidikan', 'umum']
  },
  author: {
    type: String,
    required: true,
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
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  }
}, {
  timestamps: true
});

// Index untuk pencarian
NewsSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
NewsSchema.index({ category: 1 });
NewsSchema.index({ published: 1 });
NewsSchema.index({ createdAt: -1 });

// Middleware untuk membuat slug otomatis
NewsSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

const News = mongoose.model('News', NewsSchema);

// Sample news data
const sampleNews = [
  {
    title: "Pemerintah Luncurkan Program Digitalisasi UMKM Nasional",
    content: "Jakarta - Pemerintah Indonesia resmi meluncurkan program digitalisasi UMKM (Usaha Mikro, Kecil, dan Menengah) nasional yang bertujuan untuk meningkatkan daya saing ekonomi digital Indonesia. Program ini akan memberikan bantuan teknis dan finansial kepada lebih dari 1 juta UMKM di seluruh Indonesia.\n\nMenteri Koperasi dan UKM, Teten Masduki, menjelaskan bahwa program ini merupakan bagian dari upaya pemerintah untuk mempercepat transformasi digital sektor UMKM. 'Kami berkomitmen untuk membantu UMKM Indonesia beradaptasi dengan era digital dan memanfaatkan teknologi untuk meningkatkan produktivitas,' ujar Teten.\n\nProgram ini akan dilaksanakan dalam tiga tahap selama periode 2024-2026. Tahap pertama akan fokus pada pelatihan digital literacy, tahap kedua pada implementasi platform e-commerce, dan tahap ketiga pada integrasi sistem pembayaran digital.\n\nPara pelaku UMKM yang tertarik dapat mendaftar melalui platform resmi yang telah disediakan pemerintah. Bantuan yang diberikan meliputi pelatihan gratis, subsidi perangkat teknologi, dan akses ke platform pemasaran digital.",
    excerpt: "Pemerintah meluncurkan program digitalisasi UMKM nasional untuk meningkatkan daya saing ekonomi digital Indonesia dengan target 1 juta UMKM.",
    category: "ekonomi",
    author: "Redaksi PontigramID",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
    published: true,
    slug: "pemerintah-luncurkan-program-digitalisasi-umkm-nasional"
  },
  {
    title: "Tim Nasional Indonesia Raih Medali Emas di Kejuaraan Badminton Asia",
    content: "Kuala Lumpur - Tim nasional bulutangkis Indonesia berhasil meraih medali emas di nomor beregu putra pada Kejuaraan Badminton Asia 2024. Kemenangan ini diraih setelah mengalahkan tim Malaysia dengan skor 3-1 di partai final yang berlangsung sengit.\n\nPertandingan final dimulai dengan kemenangan Anthony Sinisuka Ginting di nomor tunggal pertama. Dilanjutkan dengan kemenangan ganda putra Kevin Sanjaya/Marcus Fernaldi Gideon. Meskipun sempat tertinggal di nomor kedua, Indonesia berhasil bangkit dan menutup pertandingan dengan kemenangan Jonatan Christie di nomor tunggal ketiga.\n\n'Ini adalah hasil kerja keras seluruh tim. Kami sangat bangga bisa mengharumkan nama Indonesia di kancah internasional,' kata pelatih kepala tim nasional, Herry Iman Pierngadi.\n\nKemenangan ini sekaligus menjadi modal positif untuk persiapan menghadapi Olimpiade Paris 2024. Indonesia kini menempati posisi teratas di ranking dunia untuk nomor beregu putra.",
    excerpt: "Tim nasional bulutangkis Indonesia meraih medali emas nomor beregu putra di Kejuaraan Badminton Asia 2024 setelah mengalahkan Malaysia 3-1.",
    category: "olahraga",
    author: "Redaksi PontigramID",
    imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=400&fit=crop",
    published: true,
    slug: "tim-nasional-indonesia-raih-medali-emas-di-kejuaraan-badminton-asia"
  },
  {
    title: "Breakthrough AI Indonesia Kembangkan Teknologi Penerjemah Bahasa Daerah",
    content: "Bandung - Startup teknologi Indonesia, Breakthrough AI, berhasil mengembangkan teknologi artificial intelligence yang mampu menerjemahkan bahasa daerah Indonesia ke dalam bahasa Indonesia dan sebaliknya. Teknologi ini mendukung lebih dari 50 bahasa daerah di Indonesia.\n\nCEO Breakthrough AI, Dr. Andi Wijaya, menjelaskan bahwa teknologi ini menggunakan deep learning dan natural language processing untuk memahami struktur dan konteks bahasa daerah. 'Kami ingin melestarikan kekayaan bahasa daerah Indonesia sambil memudahkan komunikasi antar daerah,' ungkap Andi.\n\nTeknologi ini telah diuji coba di beberapa daerah seperti Jawa, Sumatra, dan Sulawesi dengan tingkat akurasi mencapai 95%. Platform ini akan tersedia dalam bentuk aplikasi mobile dan web yang dapat diakses secara gratis oleh masyarakat.\n\nKementerian Pendidikan dan Kebudayaan menyambut baik inovasi ini dan berencana mengintegrasikannya dalam kurikulum pendidikan untuk mendukung pembelajaran bahasa daerah di sekolah-sekolah.",
    excerpt: "Startup Indonesia mengembangkan AI penerjemah bahasa daerah yang mendukung 50+ bahasa daerah dengan akurasi 95% untuk melestarikan kekayaan budaya.",
    category: "teknologi",
    author: "Redaksi PontigramID",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    published: true,
    slug: "breakthrough-ai-indonesia-kembangkan-teknologi-penerjemah-bahasa-daerah"
  },
  {
    title: "Festival Film Indonesia 2024 Hadirkan 100 Film dari Berbagai Genre",
    content: "Jakarta - Festival Film Indonesia (FFI) 2024 resmi dibuka dengan menampilkan 100 film dari berbagai genre yang diproduksi oleh sineas Indonesia. Festival yang berlangsung selama satu minggu ini mengusung tema 'Diversity in Unity' untuk merayakan keberagaman sinema Indonesia.\n\nKetua Panitia FFI 2024, Riri Riza, menyatakan bahwa festival tahun ini menampilkan karya-karya terbaik dari seluruh Indonesia, mulai dari film independen hingga produksi studio besar. 'Kami ingin menunjukkan bahwa industri film Indonesia semakin matang dan beragam,' kata Riri.\n\nBeberapa film yang menjadi sorotan antara lain 'Nusantara' karya sutradara Hanung Bramantyo, 'Sang Pencerah' karya Riri Riza, dan 'Marlina si Pembunuh dalam Empat Babak' karya Mouly Surya. Festival ini juga menghadirkan program khusus untuk film-film dokumenter dan animasi.\n\nSelain pemutaran film, FFI 2024 juga mengadakan workshop, diskusi panel, dan masterclass dengan para sineas ternama Indonesia dan internasional.",
    excerpt: "Festival Film Indonesia 2024 menampilkan 100 film beragam genre dengan tema 'Diversity in Unity' untuk merayakan keberagaman sinema Indonesia.",
    category: "hiburan",
    author: "Redaksi PontigramID",
    imageUrl: "https://images.unsplash.com/photo-1489599904472-445b83c3fb52?w=800&h=400&fit=crop",
    published: true,
    slug: "festival-film-indonesia-2024-hadirkan-100-film-dari-berbagai-genre"
  },
  {
    title: "Kementerian Kesehatan Luncurkan Program Vaksinasi HPV Gratis Nasional",
    content: "Jakarta - Kementerian Kesehatan Republik Indonesia resmi meluncurkan program vaksinasi Human Papillomavirus (HPV) gratis untuk seluruh anak perempuan usia 9-14 tahun di Indonesia. Program ini bertujuan untuk mencegah kanker serviks yang menjadi salah satu penyebab kematian tertinggi pada perempuan Indonesia.\n\nMenteri Kesehatan, Budi Gunadi Sadikin, menjelaskan bahwa program ini merupakan bagian dari upaya pemerintah untuk meningkatkan kesehatan reproduksi perempuan Indonesia. 'Vaksin HPV terbukti efektif mencegah kanker serviks hingga 90%. Ini adalah investasi jangka panjang untuk kesehatan generasi mendatang,' ujar Menkes.\n\nProgram vaksinasi akan dilaksanakan secara bertahap di seluruh Indonesia, dimulai dari daerah dengan angka kejadian kanker serviks tertinggi. Vaksinasi akan diberikan di sekolah-sekolah dan puskesmas dengan melibatkan tenaga kesehatan terlatih.\n\nBIOFarma sebagai produsen vaksin dalam negeri akan menyediakan vaksin HPV untuk program ini. Diperkirakan sekitar 5 juta anak perempuan akan mendapat manfaat dari program vaksinasi gratis ini.",
    excerpt: "Kemenkes luncurkan program vaksinasi HPV gratis untuk anak perempuan usia 9-14 tahun guna mencegah kanker serviks dengan target 5 juta anak.",
    category: "kesehatan",
    author: "Redaksi PontigramID",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    published: true,
    slug: "kementerian-kesehatan-luncurkan-program-vaksinasi-hpv-gratis-nasional"
  }
];

async function seedData() {
  try {
    // Clear existing data
    await News.deleteMany({});
    console.log('Cleared existing news data');

    // Insert sample data one by one to trigger pre-save middleware
    for (const newsData of sampleNews) {
      const news = new News(newsData);
      await news.save();
    }
    console.log('Sample news data inserted successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedData();
