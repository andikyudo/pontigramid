'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminAuth from '@/components/admin/AdminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageUploadWithCompression from '@/components/ImageUploadWithCompression';
import {
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Star,
  Eye,
  RefreshCw
} from 'lucide-react';

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [compressedImageFile, setCompressedImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'lainnya',
    organizer: '',
    isActive: true,
    isFeatured: false,
    registrationRequired: false,
    maxParticipants: '',
    registrationDeadline: '',
    contactEmail: '',
    contactPhone: '',
    contactWebsite: '',
    tags: '',
    priceAmount: '',
    isFree: true
  });

  const categories = [
    'konferensi', 'seminar', 'workshop', 'pameran', 'festival', 
    'olahraga', 'budaya', 'pendidikan', 'teknologi', 'bisnis', 
    'kesehatan', 'lainnya'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageSelect = (dataUrl: string, file: File) => {
    console.log('handleImageSelect called:', { fileName: file.name, fileSize: file.size });
    setImagePreview(dataUrl);
    setCompressedImageFile(file);
    console.log('Image preview and compressed file set successfully');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== FORM SUBMIT STARTED ===');
    console.log('Event triggered by:', e.target);
    console.log('Form data:', formData);
    console.log('Has compressed image:', !!compressedImageFile);
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value.toString());
      });

      // Add compressed image if selected
      if (compressedImageFile) {
        submitData.append('image', compressedImageFile);
      }

      const response = await fetch('/api/admin/events', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        console.log('=== SUCCESS: Event created successfully ===');
        console.log('API Response:', result);
        alert('Event berhasil dibuat!');
        console.log('Success alert shown, redirecting to /admin/events');
        router.push('/admin/events');
      } else {
        console.log('=== ERROR: Event creation failed ===');
        console.log('Error response:', result);
        alert(result.error || 'Gagal membuat event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Terjadi kesalahan saat membuat event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuth>
      <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Buat Event Baru</h1>
              <p className="text-gray-600">Tambahkan event baru ke website</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Event *
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Masukkan judul event"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Deskripsi lengkap event"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Tanggal *
                      </label>
                      <Input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Waktu *
                      </label>
                      <Input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Lokasi *
                    </label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Lokasi event"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Penyelenggara *
                      </label>
                      <Input
                        name="organizer"
                        value={formData.organizer}
                        onChange={handleInputChange}
                        placeholder="Nama penyelenggara"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (pisahkan dengan koma)
                    </label>
                    <Input
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="teknologi, workshop, gratis"
                    />
                  </div>
                </div>
              </div>

              {/* Registration & Pricing */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pendaftaran & Harga</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="registrationRequired"
                      name="registrationRequired"
                      checked={formData.registrationRequired}
                      onChange={handleInputChange}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="registrationRequired" className="text-sm font-medium text-gray-700">
                      Memerlukan pendaftaran
                    </label>
                  </div>

                  {formData.registrationRequired && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Users className="w-4 h-4 inline mr-1" />
                          Maksimal Peserta
                        </label>
                        <Input
                          type="number"
                          name="maxParticipants"
                          value={formData.maxParticipants}
                          onChange={handleInputChange}
                          placeholder="100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Batas Pendaftaran
                        </label>
                        <Input
                          type="date"
                          name="registrationDeadline"
                          value={formData.registrationDeadline}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFree"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={handleInputChange}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="isFree" className="text-sm font-medium text-gray-700">
                      Event gratis
                    </label>
                  </div>

                  {!formData.isFree && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        Harga (Rupiah)
                      </label>
                      <Input
                        type="number"
                        name="priceAmount"
                        value={formData.priceAmount}
                        onChange={handleInputChange}
                        placeholder="150000"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Image Upload with Compression */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gambar Event</h3>

                <div className="space-y-4">
                  <ImageUploadWithCompression
                    onImageSelect={handleImageSelect}
                    imageType="featured"
                    currentImage={imagePreview || undefined}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Gambar akan dikompres otomatis untuk performa optimal.
                    Format yang didukung: JPG, PNG, WebP.
                  </p>
                </div>
              </div>

              {/* Settings */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pengaturan</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      <Eye className="w-4 h-4 inline mr-1" />
                      Status Aktif
                    </label>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="rounded border-gray-300"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      <Star className="w-4 h-4 inline mr-1" />
                      Event Unggulan
                    </label>
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="rounded border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kontak</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      placeholder="info@event.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telepon
                    </label>
                    <Input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="0561-123456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <Input
                      type="url"
                      name="contactWebsite"
                      value={formData.contactWebsite}
                      onChange={handleInputChange}
                      placeholder="https://event.com"
                    />
                  </div>
                </div>
              </div>

              {/* Form Status */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Status Form</h4>
                <p className="text-xs text-blue-700">
                  {loading ? 'Sedang menyimpan event...' : 'Siap untuk disimpan'}
                </p>
                {imagePreview && (
                  <p className="text-xs text-green-700 mt-1">
                    ✓ Gambar telah dipilih dan dikompres
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Submit Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Event
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
      </AdminLayout>
    </AdminAuth>
  );
}
