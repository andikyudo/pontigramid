'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
// import Link from 'next/link';
import { 
  Save, 
  Eye, 
  Upload, 
  X, 
  Bold, 
  Italic, 
  Underline,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface ArticleData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  imageUrl: string;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export default function NewsEditor() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<ArticleData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    imageUrl: '',
    published: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      seoTitle: title
    }));
  };

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
        alert('Gambar berhasil diupload!');
      } else {
        alert(data.error || 'Gagal upload gambar');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Gagal upload gambar');
    } finally {
      setImageUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB. Silakan kompres gambar terlebih dahulu.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar');
        return;
      }

      handleImageUpload(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (contentRef.current) {
      setFormData(prev => ({ ...prev, content: contentRef.current!.innerHTML }));
    }
  };

  const insertLink = () => {
    const url = prompt('Masukkan URL:');
    if (url) {
      formatText('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Masukkan URL gambar:');
    if (url) {
      formatText('insertImage', url);
    }
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      setFormData(prev => ({ ...prev, content: contentRef.current!.innerHTML }));
    }
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    // Validation
    if (!formData.title.trim()) {
      alert('Judul artikel wajib diisi');
      return;
    }

    if (!formData.content.trim()) {
      alert('Konten artikel wajib diisi');
      return;
    }

    if (!formData.category) {
      alert('Kategori wajib dipilih');
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting article data:', {
        ...formData,
        published: !isDraft
      });

      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          published: !isDraft
        }),
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (response.ok && result.success) {
        alert(isDraft ? 'Artikel berhasil disimpan sebagai draft' : 'Artikel berhasil dipublikasi');
        router.push('/admin/news');
      } else {
        console.error('API Error:', result);
        alert(result.error || result.message || 'Gagal menyimpan artikel');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Gagal menyimpan artikel: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buat Artikel Baru</h1>
          <p className="text-gray-600">Tulis dan publikasikan artikel berita</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Eye className="h-4 w-4" />
            <span>{showPreview ? 'Edit' : 'Preview'}</span>
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Draft</span>
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>Publikasi</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {!showPreview ? (
            <>
              {/* Title */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Artikel *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Masukkan judul artikel..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                  Slug URL
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-artikel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ringkasan Artikel
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Tulis ringkasan singkat artikel..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Content Editor */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konten Artikel *
                </label>
                
                {/* Toolbar */}
                <div className="border border-gray-300 rounded-t-lg p-3 bg-gray-50 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => formatText('bold')}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText('italic')}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText('underline')}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    <Underline className="h-4 w-4" />
                  </button>
                  <div className="w-px bg-gray-300 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => formatText('justifyLeft')}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText('justifyCenter')}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText('justifyRight')}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    <AlignRight className="h-4 w-4" />
                  </button>
                  <div className="w-px bg-gray-300 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => formatText('insertUnorderedList')}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={insertLink}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={insertImage}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Content Area */}
                <div
                  ref={contentRef}
                  contentEditable
                  onInput={handleContentChange}
                  className="w-full min-h-[400px] p-4 border border-gray-300 border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              </div>
            </>
          ) : (
            /* Preview Mode */
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{formData.title}</h2>
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt={formData.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <p className="text-gray-600 text-lg mb-6">{formData.excerpt}</p>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gambar Utama</h3>
            
            {formData.imageUrl ? (
              <div className="relative">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50"
              >
                {imageUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Klik untuk upload gambar</p>
                    <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, WebP, GIF • Maksimal: 2MB</p>
                  </>
                )}
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Category */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori *</h3>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih Kategori</option>
              <option value="politik">Politik</option>
              <option value="ekonomi">Ekonomi</option>
              <option value="olahraga">Olahraga</option>
              <option value="teknologi">Teknologi</option>
              <option value="hiburan">Hiburan</option>
              <option value="kesehatan">Kesehatan</option>
              <option value="pendidikan">Pendidikan</option>
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>

            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Tambah tag..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                +
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                  placeholder="SEO title (opsional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description
                </label>
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                  placeholder="SEO description (opsional)"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={formData.seoKeywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoKeywords: e.target.value }))}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
