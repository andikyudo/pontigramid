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
    <header className="bg-white shadow-sm border-b sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Newspaper className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">PontigramID</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchBox onSearch={handleSearch} className="w-full" />
          </div>



          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop Categories */}
        <div className="hidden md:flex items-center space-x-1 py-3 border-t">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                currentCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-3">
            {/* Mobile Search */}
            <SearchBox onSearch={handleSearch} />

            {/* Mobile Categories */}
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-200'
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
