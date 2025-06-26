import Link from 'next/link';
import Image from 'next/image';
import { memo } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatDateShort, truncateText } from '@/lib/utils';
import { Calendar, User } from 'lucide-react';

interface NewsCardProps {
  news: {
    _id: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    imageUrl?: string;
    createdAt: string;
    slug: string;
  };
}

const categoryColors: { [key: string]: string } = {
  politik: 'bg-red-100 text-red-800',
  ekonomi: 'bg-green-100 text-green-800',
  olahraga: 'bg-blue-100 text-blue-800',
  teknologi: 'bg-purple-100 text-purple-800',
  hiburan: 'bg-pink-100 text-pink-800',
  kesehatan: 'bg-yellow-100 text-yellow-800',
  pendidikan: 'bg-indigo-100 text-indigo-800',
  umum: 'bg-gray-100 text-gray-800'
};

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/berita/${news.slug}`}>
        <div className="relative h-48 w-full">
          {news.imageUrl ? (
            news.imageUrl.startsWith('data:') ? (
              // Handle base64 images with regular img tag
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            ) : (
              // Handle regular URLs with Next.js Image
              <Image
                src={news.imageUrl}
                alt={news.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm">Tidak ada gambar</p>
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[news.category] || categoryColors.umum}`}>
              {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
            </span>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link href={`/berita/${news.slug}`}>
          <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {news.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {truncateText(news.excerpt, 120)}
        </p>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0">
        <div className="flex flex-col gap-2 w-full text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{news.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDateShort(news.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default memo(NewsCard);
