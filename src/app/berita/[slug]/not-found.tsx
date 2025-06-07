import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <FileX className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Berita Tidak Ditemukan
          </h1>
          <p className="text-gray-600">
            Maaf, berita yang Anda cari tidak dapat ditemukan atau mungkin sudah dihapus.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="outline" className="w-full">
              Lihat Berita Lainnya
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
