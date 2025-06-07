'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
  _id: string;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
}

interface SearchBoxProps {
  onSearch: (query: string) => void;
  className?: string;
}

export default function SearchBox({ onSearch, className }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchNews(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const searchNews = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/news?search=${encodeURIComponent(searchQuery)}&limit=5&published=true`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const newRecentSearches = [
        searchQuery,
        ...recentSearches.filter(s => s !== searchQuery)
      ].slice(0, 5);
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recent_searches', JSON.stringify(newRecentSearches));
      
      onSearch(searchQuery);
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  const popularSearches = ['politik', 'ekonomi', 'teknologi', 'olahraga'];

  return (
    <div ref={searchRef} className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari berita..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {query.length >= 2 ? (
            // Search Results
            <div>
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2">Mencari...</p>
                </div>
              ) : results.length > 0 ? (
                <div>
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                    Hasil Pencarian
                  </div>
                  {results.map((result) => (
                    <a
                      key={result._id}
                      href={`/berita/${result.slug}`}
                      className="block px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
                      onClick={() => setIsOpen(false)}
                    >
                      <h4 className="font-medium text-gray-900 line-clamp-1">
                        {result.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {result.excerpt}
                      </p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {result.category}
                      </span>
                    </a>
                  ))}
                  {results.length === 5 && (
                    <button
                      onClick={() => handleSearch(query)}
                      className="w-full px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 border-t"
                    >
                      Lihat semua hasil untuk &ldquo;{query}&rdquo;
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>Tidak ada hasil ditemukan untuk &ldquo;{query}&rdquo;</p>
                </div>
              )}
            </div>
          ) : (
            // Recent and Popular Searches
            <div>
              {recentSearches.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Pencarian Terakhir
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              )}
              
              <div>
                <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Pencarian Populer
                </div>
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
