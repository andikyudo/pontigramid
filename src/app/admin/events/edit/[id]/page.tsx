'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import ImageUploadWithCompression from '@/components/ImageUploadWithCompression';
import {
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  Users,
  Star,
  RefreshCw
} from 'lucide-react';

interface EventData {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  date: string;
  time: string;
  location: string;
  category: string;
  organizer: string;
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  registrationRequired: boolean;
  maxParticipants?: number;
  registrationDeadline?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWebsite?: string;
  tags?: string[];
  price?: {
    amount: number;
    currency: string;
    isFree: boolean;
  };
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [event, setEvent] = useState<EventData | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
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
    priceCurrency: 'IDR',
    isFree: true
  });

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/events/${eventId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const eventData = data.data;
        setEvent(eventData);
        
        // Populate form with existing data
        setFormData({
          title: eventData.title || '',
          description: eventData.description || '',
          imageUrl: eventData.imageUrl || '',
          date: eventData.date ? eventData.date.split('T')[0] : '',
          time: eventData.time || '',
          location: eventData.location || '',
          category: eventData.category || 'lainnya',
          organizer: eventData.organizer || '',
          isActive: eventData.isActive ?? true,
          isFeatured: eventData.isFeatured ?? false,
          registrationRequired: eventData.registrationRequired ?? false,
          maxParticipants: eventData.maxParticipants?.toString() || '',
          registrationDeadline: eventData.registrationDeadline ? eventData.registrationDeadline.split('T')[0] : '',
          contactEmail: eventData.contactEmail || '',
          contactPhone: eventData.contactPhone || '',
          contactWebsite: eventData.contactWebsite || '',
          tags: eventData.tags?.join(', ') || '',
          priceAmount: eventData.price?.amount?.toString() || '',
          priceCurrency: eventData.price?.currency || 'IDR',
          isFree: eventData.price?.isFree ?? true
        });
      } else {
        console.error('Event not found');
        router.push('/admin/events');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      router.push('/admin/events');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleImageSelect = (dataUrl: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: dataUrl
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-|-$/g, '') + '-';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Judul dan deskripsi event harus diisi');
      return;
    }

    setSaving(true);

    try {
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl,
        date: formData.date,
        time: formData.time,
        location: formData.location.trim(),
        category: formData.category,
        organizer: formData.organizer.trim(),
        slug: generateSlug(formData.title),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        registrationRequired: formData.registrationRequired,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        registrationDeadline: formData.registrationDeadline || undefined,
        contactEmail: formData.contactEmail.trim() || undefined,
        contactPhone: formData.contactPhone.trim() || undefined,
        contactWebsite: formData.contactWebsite.trim() || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        price: {
          amount: formData.isFree ? 0 : (parseFloat(formData.priceAmount) || 0),
          currency: formData.priceCurrency,
          isFree: formData.isFree
        }
      };

      // Create FormData for the API
      const formDataToSend = new FormData();
      formDataToSend.append('title', eventData.title);
      formDataToSend.append('description', eventData.description);
      formDataToSend.append('date', eventData.date);
      formDataToSend.append('time', eventData.time);
      formDataToSend.append('location', eventData.location);
      formDataToSend.append('category', eventData.category);
      formDataToSend.append('organizer', eventData.organizer);
      formDataToSend.append('isActive', eventData.isActive.toString());
      formDataToSend.append('isFeatured', eventData.isFeatured.toString());
      formDataToSend.append('registrationRequired', eventData.registrationRequired.toString());

      if (eventData.maxParticipants) {
        formDataToSend.append('maxParticipants', eventData.maxParticipants.toString());
      }
      if (eventData.registrationDeadline) {
        formDataToSend.append('registrationDeadline', eventData.registrationDeadline);
      }
      if (eventData.contactEmail) {
        formDataToSend.append('contactEmail', eventData.contactEmail);
      }
      if (eventData.contactPhone) {
        formDataToSend.append('contactPhone', eventData.contactPhone);
      }
      if (eventData.contactWebsite) {
        formDataToSend.append('contactWebsite', eventData.contactWebsite);
      }
      if (eventData.tags && eventData.tags.length > 0) {
        formDataToSend.append('tags', eventData.tags.join(', '));
      }

      formDataToSend.append('isFree', eventData.price.isFree.toString());
      if (!eventData.price.isFree && eventData.price.amount > 0) {
        formDataToSend.append('priceAmount', eventData.price.amount.toString());
      }

      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        alert('Event berhasil diperbarui!');
        router.push('/admin/events');
      } else {
        alert(result.error || 'Gagal memperbarui event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Terjadi kesalahan saat memperbarui event');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  if (!event) {
    return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Event Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Event yang Anda cari tidak ditemukan atau telah dihapus.</p>
          <Button onClick={() => router.push('/admin/events')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Event
          </Button>
        </div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/events')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
              <p className="text-gray-600">Perbarui informasi event</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Informasi Dasar
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title">Judul Event *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Masukkan judul event"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Masukkan deskripsi event"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Kategori</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="konferensi">Konferensi</option>
                  <option value="seminar">Seminar</option>
                  <option value="workshop">Workshop</option>
                  <option value="pameran">Pameran</option>
                  <option value="festival">Festival</option>
                  <option value="olahraga">Olahraga</option>
                  <option value="budaya">Budaya</option>
                  <option value="pendidikan">Pendidikan</option>
                  <option value="teknologi">Teknologi</option>
                  <option value="bisnis">Bisnis</option>
                  <option value="kesehatan">Kesehatan</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <Label htmlFor="organizer">Penyelenggara</Label>
                <Input
                  id="organizer"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  placeholder="Nama penyelenggara"
                />
              </div>
            </div>
          </div>

          {/* Date, Time & Location */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Waktu & Lokasi
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="date">Tanggal Event</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="time">Waktu</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Lokasi event"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Gambar Event
            </h2>

            <ImageUploadWithCompression
              onImageSelect={handleImageSelect}
              currentImage={formData.imageUrl}
              imageType="featured"
            />
          </div>

          {/* Registration & Pricing */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Pendaftaran & Harga
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="registrationRequired">Memerlukan Pendaftaran</Label>
                  <p className="text-sm text-gray-500">Apakah event ini memerlukan pendaftaran?</p>
                </div>
                <Switch
                  id="registrationRequired"
                  checked={formData.registrationRequired}
                  onCheckedChange={(checked) => handleSwitchChange('registrationRequired', checked)}
                />
              </div>

              {formData.registrationRequired && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="maxParticipants">Maksimal Peserta</Label>
                    <Input
                      id="maxParticipants"
                      name="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      placeholder="Kosongkan jika tidak terbatas"
                    />
                  </div>

                  <div>
                    <Label htmlFor="registrationDeadline">Batas Pendaftaran</Label>
                    <Input
                      id="registrationDeadline"
                      name="registrationDeadline"
                      type="date"
                      value={formData.registrationDeadline}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isFree">Event Gratis</Label>
                  <p className="text-sm text-gray-500">Apakah event ini gratis?</p>
                </div>
                <Switch
                  id="isFree"
                  checked={formData.isFree}
                  onCheckedChange={(checked) => handleSwitchChange('isFree', checked)}
                />
              </div>

              {!formData.isFree && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="priceAmount">Harga</Label>
                    <Input
                      id="priceAmount"
                      name="priceAmount"
                      type="number"
                      value={formData.priceAmount}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="priceCurrency">Mata Uang</Label>
                    <select
                      id="priceCurrency"
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="IDR">IDR (Rupiah)</option>
                      <option value="USD">USD (Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informasi Kontak
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="contactEmail">Email Kontak</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Nomor Telepon</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="+62 xxx xxxx xxxx"
                />
              </div>

              <div>
                <Label htmlFor="contactWebsite">Website</Label>
                <Input
                  id="contactWebsite"
                  name="contactWebsite"
                  type="url"
                  value={formData.contactWebsite}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Pengaturan Tambahan
            </h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isActive">Status Aktif</Label>
                  <p className="text-sm text-gray-500">Event akan ditampilkan di website</p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isFeatured">Event Unggulan</Label>
                  <p className="text-sm text-gray-500">Event akan ditampilkan di posisi prioritas</p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleSwitchChange('isFeatured', checked)}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/events')}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Perbarui Event
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
  );
}
