'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Globe, Zap } from 'lucide-react';
import SearchBox from '@/components/SearchBox';

const categories = [
  { id: 'all', name: 'Semua' },
  { id: 'politik', name: 'Politik' },
  { id: 'ekonomi', name: 'Ekonomi' },
  { id: 'olahraga', name: 'Olahraga' },
  { id: 'teknologi', name: 'Teknologi' },
  { id: 'hiburan', name: 'Hiburan' },
  { id: 'kesehatan', name: 'Kesehatan' },
  { id: 'pendidikan', name: 'Pendidikan' },
  { id: 'sosial', name: 'Sosial' },
  { id: 'budaya', name: 'Budaya' },
  { id: 'umum', name: 'Umum' },
  { id: 'hukum', name: 'Hukum' }
];

interface HeaderProps {
  onSearch?: (query: string) => void;
  onCategoryChange?: (category: string) => void;
  currentCategory?: string;
}

export default function Header({ onSearch, onCategoryChange, currentCategory = 'all' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    } else {
      // If no onSearch handler provided, navigate to home with search query
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set('search', query.trim());
      }
      router.push(`/?${params.toString()}`);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    } else {
      // If no onCategoryChange handler provided, navigate to home with category filter
      const params = new URLSearchParams();
      if (categoryId !== 'all') {
        params.set('category', categoryId);
      }
      router.push(`/?${params.toString()}`);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 shadow-xl sticky top-0 z-[100]">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-slate-800/95 to-gray-900/95"></div>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10 10-4.5 10-10 10-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Subtle red accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="relative p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg group-hover:shadow-red-500/25 transition-all duration-300">
                <Globe className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-300">
                Pontigram
              </span>
              <span className="text-xs text-gray-300 block">
                Jaringan Informasi Kota Pontianak dan Sekitarnya
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="w-full relative">
              <SearchBox onSearch={handleSearch} className="w-full bg-white/10 backdrop-blur-sm border-gray-600 text-white placeholder-gray-300" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:text-red-400 hover:bg-white/10 transition-all duration-300"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop Categories */}
        <div className="hidden md:flex items-center space-x-1 py-3 border-t border-gray-700">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                currentCategory === category.id
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/25 transform scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700 hover:scale-105'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <SearchBox onSearch={handleSearch} className="bg-white/10 backdrop-blur-sm border-gray-600 text-white placeholder-gray-300" />
            </div>

            {/* Mobile Categories */}
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    currentCategory === category.id
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
