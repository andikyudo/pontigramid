'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Eye,
  Upload,
  X,
  AlertCircle,
  Clock,
  Globe,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RichTextEditor from './RichTextEditor';
import ErrorBoundary from '@/components/ErrorBoundary';
import { createSlug } from '@/lib/utils';

interface NewsFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  imageUrl: string;
  status: 'draft' | 'published';
  slug: string;
  isBreakingNews: boolean;
}

interface NewsFormProps {
  initialData?: Partial<NewsFormData>;
  isEdit?: boolean;
  newsId?: string;
}

export default function NewsForm({ initialData, isEdit = false, newsId }: NewsFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: 'Admin User',
    imageUrl: '',
    status: 'draft',
    slug: '',
    isBreakingNews: false,
    ...initialData
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (formData.title && !isEdit) {
      setFormData(prev => ({
        ...prev,
        slug: createSlug(prev.title)
      }));
    }
  }, [formData.title, isEdit]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Judul wajib diisi';
    }
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt wajib diisi';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Konten wajib diisi';
    }
    if (!formData.category) {
      newErrors.category = 'Kategori wajib dipilih';
    }
    if (!formData.author.trim()) {
      newErrors.author = 'Penulis wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const submitData = { ...formData, status };

      const url = isEdit ? `/api/admin/news/${newsId}` : '/api/admin/news';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Show success message before redirect
        alert(`Artikel berhasil ${status === 'published' ? 'dipublish' : 'disimpan sebagai draft'}!`);
        router.push('/admin/news');
      } else {
        setErrors({ submit: result.error || result.message || 'Terjadi kesalahan saat menyimpan artikel' });
      }
    } catch (error) {
      console.error('Error saving news:', error);
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan artikel';
      setErrors({ submit: `Gagal menyimpan artikel: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        setFormData(prev => ({ ...prev, imageUrl: result.url }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setImageUploading(false);
    }
  };

  const categories = [
    { value: 'politik', label: 'Politik' },
    { value: 'ekonomi', label: 'Ekonomi' },
    { value: 'olahraga', label: 'Olahraga' },
    { value: 'teknologi', label: 'Teknologi' },
    { value: 'hiburan', label: 'Hiburan' },
    { value: 'kesehatan', label: 'Kesehatan' },
    { value: 'pendidikan', label: 'Pendidikan' },
    { value: 'umum', label: 'Umum' }
  ];

  // Show loading state during SSR/hydration
  if (!isClient) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading form...</div>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Preview Artikel</h1>
          <Button onClick={() => setShowPreview(false)}>
            <X className="mr-2 h-4 w-4" />
            Tutup Preview
          </Button>
        </div>
        
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            {formData.imageUrl && (
              <div className="relative w-full h-64 mb-6">
                <Image
                  src={formData.imageUrl}
                  alt={formData.title || 'Preview image'}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                />
              </div>
            )}
            
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {categories.find(c => c.value === formData.category)?.label}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{formData.title}</h1>
            
            <p className="text-lg text-gray-600 mb-6">{formData.excerpt}</p>
            
            <div className="prose prose-lg max-w-none" 
                 dangerouslySetInnerHTML={{ __html: formData.content }} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit ? 'Edit Berita' : 'Buat Berita Baru'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Perbarui artikel berita' : 'Tulis artikel berita baru'}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            disabled={!formData.title || !formData.content}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleSubmit('draft')}
            disabled={loading}
          >
            <Clock className="mr-2 h-4 w-4" />
            Simpan Draft
          </Button>
          
          <Button
            onClick={() => handleSubmit('published')}
            disabled={loading}
          >
            <Globe className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{errors.submit}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle>Judul Artikel</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Masukkan judul artikel..."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
              
              {formData.slug && (
                <p className="text-sm text-gray-500 mt-2">
                  URL: /berita/{formData.slug}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card>
            <CardHeader>
              <CardTitle>Excerpt</CardTitle>
              <CardDescription>
                Ringkasan singkat artikel (akan ditampilkan di daftar berita)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Masukkan ringkasan artikel..."
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.excerpt ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.excerpt && (
                <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>
              )}
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Konten Artikel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px]">
                <ErrorBoundary
                  fallback={({ resetError }) => (
                    <div className="border border-gray-300 rounded-lg p-4">
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">
                          Editor gagal dimuat. Menggunakan editor sederhana.
                        </p>
                        <textarea
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          placeholder="Mulai menulis artikel..."
                          className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={resetError}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          Coba muat editor lagi
                        </button>
                      </div>
                    </div>
                  )}
                >
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Mulai menulis artikel..."
                  />
                </ErrorBoundary>
              </div>
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Gambar Utama</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.imageUrl ? (
                <div className="relative w-full h-40">
                  <Image
                    src={formData.imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <button
                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload gambar utama</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    {imageUploading ? 'Uploading...' : 'Pilih File'}
                  </label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </CardContent>
          </Card>

          {/* Author */}
          <Card>
            <CardHeader>
              <CardTitle>Penulis</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Nama penulis"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.author ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.author && (
                <p className="text-red-500 text-sm mt-1">{errors.author}</p>
              )}
            </CardContent>
          </Card>

          {/* Breaking News Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 text-red-500 mr-2" />
                Breaking News
              </CardTitle>
              <CardDescription>
                Tandai artikel ini sebagai berita breaking news untuk ditampilkan di slider utama
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isBreakingNews"
                  checked={formData.isBreakingNews}
                  onChange={(e) => setFormData({ ...formData, isBreakingNews: e.target.checked })}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                />
                <label htmlFor="isBreakingNews" className="text-sm font-medium text-gray-700">
                  Jadikan sebagai Breaking News
                </label>
              </div>
              {formData.isBreakingNews && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm text-red-700 font-medium">
                      Artikel ini akan ditampilkan sebagai Breaking News
                    </span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    Breaking news akan muncul di slider utama homepage dengan badge khusus
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
