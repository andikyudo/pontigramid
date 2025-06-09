# 🌐 Panduan Setup Domain: www.pontigram.com

Panduan ini memberikan instruksi langkah demi langkah untuk mengkonfigurasi domain kustom `www.pontigram.com` untuk website berita Pontigram.

## 📋 Prasyarat

- Akses ke registrar domain (tempat pontigram.com didaftarkan)
- Akun Vercel dengan akses proyek
- Kemampuan manajemen DNS

## 🔧 Langkah 1: Pembelian & Registrasi Domain .com

### 🌐 Registrar Domain Internasional yang Direkomendasikan

**Registrar .com Terpercaya:**

1. **Namecheap** - https://namecheap.com
   - Harga: $8.88 - $12.98/tahun
   - Privacy protection gratis
   - Interface user-friendly

2. **GoDaddy** - https://godaddy.com
   - Harga: $9.99 - $14.99/tahun
   - Support 24/7
   - Banyak fitur tambahan

3. **Cloudflare** - https://cloudflare.com
   - Harga: $8.03/tahun (at cost)
   - DNS management gratis
   - CDN terintegrasi

4. **Google Domains** - https://domains.google
   - Harga: $12/tahun
   - Integrasi dengan Google services
   - Privacy protection included

### 📋 Persyaratan Registrasi Domain .com

**Dokumen yang Diperlukan:**
- **Email address** (untuk verifikasi)
- **Contact information** (nama, alamat, telepon)
- **Payment method** (kartu kredit/PayPal)

**Persyaratan Khusus:**
- Domain .com dapat didaftarkan oleh siapa saja di seluruh dunia
- Verifikasi email diperlukan
- Proses aktivasi instan setelah pembayaran

### 🔍 Cek Ketersediaan Domain

**Langkah Pengecekan:**
1. Kunjungi https://whois.net atau registrar pilihan
2. Masukkan "pontigram.com"
3. Cek status ketersediaan

**Alternatif Domain jika pontigram.com Tidak Tersedia:**
- `pontigramnews.com`
- `pontigram-id.com`
- `beritapontigram.com`
- `pontigramportal.com`
- `pontigram.net` (alternatif TLD)

### 💰 Estimasi Biaya

| Registrar | Harga/Tahun | Renewal | DNS Management |
|-----------|-------------|---------|----------------|
| Pandi.id | Rp 150.000 | Rp 150.000 | Gratis |
| Niagahoster | Rp 165.000 | Rp 180.000 | Gratis |
| Dewaweb | Rp 170.000 | Rp 190.000 | Gratis |
| Qwords | Rp 160.000 | Rp 185.000 | Gratis |

### � Proses Registrasi Step-by-Step

**1. Pilih Registrar dan Buat Akun**
```
- Daftar di salah satu registrar yang direkomendasikan
- Verifikasi email dan nomor telepon
- Lengkapi profil dengan data yang valid
```

**2. Cari dan Pilih Domain**
```
- Masukkan "pontigram.id" di kolom pencarian
- Jika tersedia, tambahkan ke keranjang
- Jika tidak tersedia, pilih alternatif domain
```

**3. Proses Pembayaran**
```
- Pilih periode registrasi (minimal 1 tahun)
- Pilih metode pembayaran (Transfer Bank/E-wallet/Kartu Kredit)
- Selesaikan pembayaran
```

**4. Upload Dokumen Verifikasi**
```
- Upload scan KTP/Passport yang jelas
- Pastikan nama sesuai dengan data registrasi
- Tunggu proses verifikasi 1-3 hari kerja
```

**5. Konfirmasi Registrasi**
```
- Cek email konfirmasi dari registrar
- Domain aktif setelah verifikasi selesai
- Akses panel DNS management
```

## ⚙️ Langkah 2: Konfigurasi Domain di Vercel

### 2.1 Tambahkan Domain di Dashboard Vercel

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih proyek PontigramID Anda
3. Navigasi ke **Settings** → **Domains**
4. Klik **Add Domain**
5. Masukkan: `www.pontigram.id`
6. Klik **Add**

### 2.2 Konfigurasi DNS Records

Vercel akan memberikan instruksi konfigurasi DNS. Biasanya:

**Untuk www.pontigram.id:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Untuk pontigram.id (apex domain):**
```
Type: A
Name: @
Value: 76.76.19.19

Type: AAAA
Name: @
Value: 2606:4700:10::6816:1313
```

### 2.3 Sertifikat SSL

- Vercel secara otomatis menyediakan sertifikat SSL
- Tunggu 24-48 jam untuk propagasi DNS
- Sertifikat akan diterbitkan secara otomatis

### 2.4 Pengaturan DNS di Registrar Indonesia

**Untuk Niagahoster:**
1. Login ke panel Niagahoster
2. Pilih "Domain" → "Kelola DNS"
3. Tambahkan record DNS sesuai instruksi Vercel
4. Simpan perubahan

**Untuk Dewaweb:**
1. Login ke panel Dewaweb
2. Pilih "Domain Management" → "DNS Zone"
3. Edit DNS records sesuai konfigurasi Vercel
4. Apply changes

**Untuk Qwords:**
1. Login ke panel Qwords
2. Pilih "Domain" → "DNS Management"
3. Tambahkan/edit DNS records
4. Save configuration

## 🔄 Langkah 3: Update Environment Variables

Update environment variables di Vercel:

```bash
# Di Vercel Dashboard → Settings → Environment Variables
NEXT_PUBLIC_BASE_URL=https://www.pontigram.id
NEXTAUTH_URL=https://www.pontigram.id
```

## 🧪 Langkah 4: Testing & Verifikasi

### 4.1 Cek Propagasi DNS
```bash
# Cek propagasi DNS
nslookup www.pontigram.id
dig www.pontigram.id

# Cek sertifikat SSL
curl -I https://www.pontigram.id
```

**Tools Online untuk Cek DNS:**
- https://dnschecker.org
- https://www.whatsmydns.net
- https://mxtoolbox.com/dnscheck.aspx

### 4.2 Test Fungsionalitas Website
- [ ] Homepage loading dengan benar
- [ ] Fungsi pencarian bekerja
- [ ] Kompresi gambar berfungsi
- [ ] Berita terkait tampil
- [ ] Social sharing berfungsi
- [ ] Panel admin dapat diakses
- [ ] API endpoints merespons
- [ ] Sitemap.xml dapat diakses
- [ ] Robots.txt dapat diakses

### 4.3 Test Performa Website
```bash
# Test kecepatan loading
curl -w "@curl-format.txt" -o /dev/null -s https://www.pontigram.id

# Test dari berbagai lokasi Indonesia
# Gunakan tools online seperti:
# - GTmetrix.com
# - PageSpeed Insights
# - WebPageTest.org
```

## 📊 Langkah 5: Update SEO & Analytics

### 5.1 Google Search Console
1. Tambahkan `https://www.pontigram.id` sebagai property baru
2. Verifikasi kepemilikan via DNS atau file HTML
3. Submit sitemap yang sudah diupdate: `https://www.pontigram.id/sitemap.xml`

**Langkah Detail:**
```
1. Buka https://search.google.com/search-console
2. Klik "Add Property" → "URL prefix"
3. Masukkan https://www.pontigram.id
4. Pilih metode verifikasi (DNS record direkomendasikan)
5. Submit sitemap di bagian "Sitemaps"
```

### 5.2 Update Social Media
Update profil media sosial dengan domain baru:
- **Facebook Page**: Update info dan link website
- **Twitter Profile**: Update bio dan website link
- **Instagram Bio**: Update link di bio
- **YouTube Channel**: Update deskripsi channel

### 5.3 Konfigurasi Analytics
Update Google Analytics:
- Tambahkan domain baru ke property
- Update konfigurasi tracking
- Setup goal tracking untuk konversi

**Setup Google Analytics 4:**
```
1. Buka https://analytics.google.com
2. Pilih property yang sesuai
3. Admin → Data Streams → Web
4. Update URL stream ke www.pontigram.id
5. Verifikasi tracking code di website
```

## 🔒 Langkah 6: Konfigurasi Keamanan

### 6.1 Security Headers
Sudah dikonfigurasi di `vercel.json`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### 6.2 HTTPS Redirect
Redirect HTTPS otomatis sudah diaktifkan oleh Vercel.

### 6.3 Keamanan Tambahan untuk Domain .id
```bash
# Aktifkan DNSSEC (jika didukung registrar)
# Konfigurasi CAA record untuk sertifikat SSL
# Setup monitoring domain untuk perubahan DNS
```

## 🚀 Langkah 7: Deployment

Deploy konfigurasi yang sudah diupdate:

```bash
# Deploy dengan konfigurasi domain baru
vercel --prod

# Verifikasi deployment
curl -I https://www.pontigram.id
```

## 📝 Langkah 8: Checklist Post-Deployment

- [ ] Domain resolve dengan benar
- [ ] Sertifikat SSL aktif
- [ ] Semua halaman loading tanpa error
- [ ] API endpoints berfungsi
- [ ] Upload dan kompresi gambar bekerja
- [ ] Fungsi pencarian operasional
- [ ] Berita terkait tampil dengan benar
- [ ] Tombol social sharing berfungsi
- [ ] Panel admin dapat diakses
- [ ] Koneksi database stabil
- [ ] Performa website optimal
- [ ] SEO metadata terupdate

## 🔧 Troubleshooting

### Masalah Umum dan Solusi:

**DNS Tidak Propagasi:**
- Tunggu 24-48 jam untuk propagasi penuh
- Clear DNS cache: `sudo dscacheutil -flushcache` (Mac) atau `ipconfig /flushdns` (Windows)
- Gunakan DNS server berbeda untuk testing (8.8.8.8, 1.1.1.1)
- Cek propagasi di https://dnschecker.org

**Masalah Sertifikat SSL:**
- Pastikan DNS sudah dikonfigurasi dengan benar
- Tunggu provisioning sertifikat otomatis (bisa sampai 24 jam)
- Hubungi support Vercel jika masalah berlanjut
- Cek status sertifikat di Vercel dashboard

**Error 404:**
- Cek log deployment Vercel
- Verifikasi environment variables
- Pastikan semua route dikonfigurasi dengan benar
- Cek file `vercel.json` untuk redirect rules

**Masalah Koneksi Database:**
- Update connection string MongoDB jika diperlukan
- Verifikasi environment variables di Vercel
- Cek IP whitelist MongoDB Atlas
- Test koneksi database dari local

**Domain .id Specific Issues:**
- Verifikasi dokumen KTP/Passport sudah diapprove
- Cek status domain di panel registrar
- Pastikan domain tidak dalam status hold/suspended
- Hubungi support registrar untuk masalah verifikasi

## 📞 Kontak Support

### Support Teknis:
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **MongoDB Atlas**: [support.mongodb.com](https://support.mongodb.com)

### Support Registrar Indonesia:
- **Niagahoster**: support@niagahoster.co.id / 0804-1-808-888
- **Dewaweb**: support@dewaweb.com / 021-2212-4702
- **Qwords**: support@qwords.com / 0804-1-808-888
- **Pandi.id**: info@pandi.id / 021-2350-5555

### Emergency Contacts:
- **WhatsApp Niagahoster**: +62 812-4000-1982
- **Live Chat**: Tersedia di semua registrar 24/7

## 🎯 Kriteria Sukses

Setup domain berhasil ketika:
1. ✅ `https://www.pontigram.id` loading homepage dengan benar
2. ✅ Sertifikat SSL valid dan aktif
3. ✅ Semua fungsionalitas website bekerja
4. ✅ SEO metadata mencerminkan domain baru
5. ✅ Social sharing menggunakan domain baru
6. ✅ Panel admin dapat diakses
7. ✅ API endpoints merespons dengan benar
8. ✅ Operasi database berjalan normal
9. ✅ Performa website optimal untuk pengguna Indonesia
10. ✅ Semua redirect berfungsi dengan baik

## 📚 Referensi Tambahan

### Dokumentasi Resmi:
- [Panduan Domain .id](https://pandi.id/panduan-domain/)
- [Vercel Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Tools Berguna:
- **DNS Checker**: https://dnschecker.org
- **SSL Checker**: https://www.sslshopper.com/ssl-checker.html
- **Website Speed Test**: https://pagespeed.web.dev
- **Domain Whois**: https://whois.pandi.id

---

**Catatan**: Simpan panduan ini untuk referensi masa depan dan tugas manajemen domain.
