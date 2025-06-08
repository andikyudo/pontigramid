'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Newspaper } from 'lucide-react';
import SearchBox from '@/components/SearchBox';

const categories = [
  { id: 'all', name: 'Semua' },
  { id: 'politik', name: 'Politik' },
  { id: 'ekonomi', name: 'Ekonomi' },
  { id: 'olahraga', name: 'Olahraga' },
  { id: 'teknologi', name: 'Teknologi' },
  { id: 'hiburan', name: 'Hiburan' },
  { id: 'kesehatan', name: 'Kesehatan' },
  { id: 'pendidikan', name: 'Pendidikan' }
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
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-lg sticky top-0 z-[100]">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-blue-700/90 to-indigo-800/90"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Newspaper className="h-8 w-8 text-white group-hover:text-yellow-300 transition-colors duration-300" />
              <div className="absolute -inset-1 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">
                PontigramID
              </span>
              <span className="text-xs text-blue-100 hidden sm:block">
                Portal Berita Terpercaya
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="w-full relative">
              <SearchBox onSearch={handleSearch} className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-blue-100" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:text-yellow-300 hover:bg-white/10 transition-all duration-300"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop Categories */}
        <div className="hidden md:flex items-center space-x-1 py-3 border-t border-white/20">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                currentCategory === category.id
                  ? 'bg-white text-blue-700 shadow-lg transform scale-105'
                  : 'text-blue-100 hover:text-white hover:bg-white/20 hover:scale-105'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/20 bg-gradient-to-b from-blue-700 to-blue-800 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <SearchBox onSearch={handleSearch} className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-blue-100" />
            </div>

            {/* Mobile Categories */}
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    currentCategory === category.id
                      ? 'bg-white text-blue-700 shadow-lg'
                      : 'text-blue-100 hover:text-white hover:bg-white/20 border border-white/20'
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
