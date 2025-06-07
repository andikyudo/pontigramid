# PontigramID - Portal Berita

Portal berita modern dengan desain mobile-first yang dibangun menggunakan Next.js, MongoDB, dan Tailwind CSS.

## 🚀 Fitur Utama

### Portal Berita (Client)
- **Tampilan Mobile-First**: Desain responsif yang mengutamakan pengalaman mobile
- **Kategori Berita**: Politik, Ekonomi, Olahraga, Teknologi, Hiburan, Kesehatan, Pendidikan, Umum
- **Pencarian Berita**: Fitur pencarian real-time dengan full-text search
- **Filter Kategori**: Filter berita berdasarkan kategori
- **Pagination**: Load more untuk performa yang optimal
- **SEO Optimized**: Meta tags dan struktur URL yang SEO-friendly

### Dashboard Admin
- **Autentikasi Admin**: Login sistem untuk admin
- **CRUD Berita**: Create, Read, Update, Delete berita
- **Draft & Publish**: Sistem draft dan publikasi berita
- **Manajemen Kategori**: Organisasi berita berdasarkan kategori
- **Upload Gambar**: Support URL gambar untuk berita
- **Statistics**: Dashboard dengan statistik berita

## 🛠️ Teknologi

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB dengan Mongoose
- **UI Components**: Radix UI, Lucide React
- **Authentication**: Custom JWT authentication
- **Styling**: Tailwind CSS dengan custom components

## 📋 Prasyarat

- Node.js 18+
- MongoDB (lokal atau cloud)
- Docker (opsional, untuk MongoDB)

## 🚀 Instalasi & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd pontigramid
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env.local` di root directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/pontigramid

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Admin credentials (untuk login pertama kali)
ADMIN_EMAIL=admin@pontigramid.com
ADMIN_PASSWORD=admin123
```

### 4. Setup MongoDB
Pastikan MongoDB berjalan di sistem Anda. Jika menggunakan Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Seed Data (Opsional)
Tambahkan data contoh:
```bash
node scripts/seed-data.js
```

### 6. Jalankan Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 📱 Penggunaan

### Portal Berita
1. Kunjungi halaman utama untuk melihat daftar berita
2. Gunakan filter kategori untuk melihat berita spesifik
3. Gunakan fitur pencarian untuk mencari berita
4. Klik berita untuk membaca detail lengkap

### Admin Dashboard
1. Kunjungi `/admin` untuk login
2. Gunakan kredensial default:
   - Email: `admin@pontigramid.com`
   - Password: `admin123`
3. Setelah login, Anda dapat:
   - Melihat dashboard dengan statistik
   - Membuat berita baru
   - Edit berita yang ada
   - Hapus berita
   - Toggle status publikasi

## 🏗️ Struktur Project

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── berita/            # News detail pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── Header.tsx        # Main header
│   └── NewsCard.tsx      # News card component
├── lib/                  # Utility libraries
│   ├── mongodb.ts        # Database connection
│   └── utils.ts          # Helper functions
└── models/               # Database models
    ├── News.ts           # News model
    └── User.ts           # User model
```

## 🔧 API Endpoints

### Berita
- `GET /api/news` - Ambil daftar berita
- `POST /api/news` - Buat berita baru
- `GET /api/news/[id]` - Ambil berita berdasarkan ID
- `PUT /api/news/[id]` - Update berita
- `DELETE /api/news/[id]` - Hapus berita
- `GET /api/news/slug/[slug]` - Ambil berita berdasarkan slug

### Authentication
- `POST /api/auth/login` - Login admin

## 🎨 Customization

### Menambah Kategori Baru
Edit file `src/models/News.ts` dan tambahkan kategori baru di enum:
```typescript
enum: ['politik', 'ekonomi', 'olahraga', 'teknologi', 'hiburan', 'kesehatan', 'pendidikan', 'umum', 'kategori-baru']
```

### Mengubah Tema Warna
Edit file `src/app/globals.css` untuk mengubah color scheme:
```css
:root {
  --primary: #2563eb;  /* Ubah warna primary */
  --secondary: #f1f5f9; /* Ubah warna secondary */
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Connect repository di Vercel
3. Set environment variables di Vercel dashboard
4. Deploy

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Jika Anda memiliki pertanyaan atau butuh bantuan, silakan buat issue di repository ini.

---

**PontigramID** - Portal Berita Terpercaya 📰
# PontigramID - Indonesian News Portal
