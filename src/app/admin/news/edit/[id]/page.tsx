'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react';
import AdminAuth from '@/components/admin/AdminAuth';

const categories = [
  { value: 'politik', label: 'Politik' },
  { value: 'ekonomi', label: 'Ekonomi' },
  { value: 'olahraga', label: 'Olahraga' },
  { value: 'teknologi', label: 'Teknologi' },
  { value: 'hiburan', label: 'Hiburan' },
  { value: 'kesehatan', label: 'Kesehatan' },
  { value: 'pendidikan', label: 'Pendidikan' },
  { value: 'hukum', label: 'Hukum' },
  { value: 'sosial', label: 'Sosial' },
  { value: 'budaya', label: 'Budaya' },
  { value: 'umum', label: 'Umum' }
];

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  imageUrl?: string;
  published: boolean;
}

export default function EditNews() {
  const [formData, setFormData] = useState<NewsItem>({
    _id: '',
    title: '',
    content: '',
    excerpt: '',
    category: '',
    author: '',
    imageUrl: '',
    published: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const fetchNews = useCallback(async () => {
    try {
      const response = await fetch(`/api/news/${id}`);
      const data = await response.json();

      if (data.success) {
        setFormData(data.data);
      } else {
        setError('Berita tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Gagal memuat data berita');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Validasi
    if (!formData.title || !formData.content || !formData.excerpt || !formData.category || !formData.author) {
      setError('Semua field wajib diisi');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          published: publish
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Gagal mengupdate berita');
      }
    } catch (error) {
      console.error('Error updating news:', error);
      setError('Terjadi kesalahan saat mengupdate berita');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data berita...</p>
        </div>
      </div>
    );
  }

  if (error && !formData._id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/admin/dashboard">
            <Button>Kembali ke Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Berita</CardTitle>
            <CardDescription>
              Edit informasi berita di bawah ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => handleSubmit(e, formData.published)} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Berita *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan judul berita"
                />
              </div>

              {/* Category and Author */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                    Penulis *
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    required
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nama penulis"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  URL Gambar
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                  Ringkasan *
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  required
                  rows={3}
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ringkasan singkat berita (maksimal 300 karakter)"
                  maxLength={300}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.excerpt.length}/300 karakter
                </p>
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Konten Berita *
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={12}
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tulis konten berita lengkap di sini..."
                />
              </div>

              {/* Published Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                  Publikasikan berita
                </label>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button
                  type="submit"
                  disabled={saving}
                  variant="outline"
                  className="flex-1"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Simpan & Publikasikan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
    </AdminAuth>
  );
}
