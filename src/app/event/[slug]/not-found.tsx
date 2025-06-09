import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Calendar, Search } from 'lucide-react';

export default function EventNotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-12">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4">
              <Calendar className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
              Event Tidak Ditemukan
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Maaf, event yang Anda cari tidak ditemukan atau mungkin sudah tidak tersedia.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
            
            <Link
              href="/#events"
              className="inline-flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Lihat Event Lainnya</span>
            </Link>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-lg shadow-md p-6 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Saran untuk Anda:</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Periksa kembali URL yang Anda masukkan</li>
              <li>• Event mungkin sudah berakhir atau dihapus</li>
              <li>• Coba cari event serupa di halaman utama</li>
              <li>• Hubungi kami jika Anda yakin ini adalah kesalahan</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
