'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminAuth from '@/components/admin/AdminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageUploadWithCompression from '@/components/ImageUploadWithCompression';
import { ArrowLeft, Save, RefreshCw } from 'lucide-react';

export default function CreateEventDebugPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [compressedImageFile, setCompressedImageFile] = useState<File | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'teknologi',
    organizer: '',
    isActive: true,
    isFeatured: true,
    registrationRequired: false,
    isFree: true
  });

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);
    setDebugLog(prev => [...prev, logEntry]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    addDebugLog(`Input changed: ${name} = ${value}`);
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageSelect = (dataUrl: string, file: File) => {
    addDebugLog(`Image selected: ${file.name} (${file.size} bytes)`);
    setImagePreview(dataUrl);
    setCompressedImageFile(file);
    addDebugLog(`Image preview set, compressed file stored`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addDebugLog('=== FORM SUBMISSION STARTED ===');
    setLoading(true);

    try {
      addDebugLog('Creating FormData object...');
      const submitData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value.toString());
        addDebugLog(`Added to FormData: ${key} = ${value}`);
      });

      // Add compressed image if selected
      if (compressedImageFile) {
        submitData.append('image', compressedImageFile);
        addDebugLog(`Added image to FormData: ${compressedImageFile.name}`);
      } else {
        addDebugLog('No image to add to FormData');
      }

      addDebugLog('Sending API request to /api/admin/events...');
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        body: submitData,
      });

      addDebugLog(`API response received: ${response.status} ${response.statusText}`);
      const result = await response.json();
      addDebugLog(`API response data: ${JSON.stringify(result)}`);

      if (result.success) {
        addDebugLog('=== SUCCESS: Event created successfully ===');
        alert('Event berhasil dibuat!');
        addDebugLog('Success alert shown, redirecting...');
        router.push('/admin/events');
      } else {
        addDebugLog(`=== ERROR: ${result.error || 'Unknown error'} ===`);
        alert(result.error || 'Gagal membuat event');
      }
    } catch (error) {
      addDebugLog(`=== EXCEPTION: ${error} ===`);
      console.error('Error creating event:', error);
      alert('Terjadi kesalahan saat membuat event');
    } finally {
      setLoading(false);
      addDebugLog('=== FORM SUBMISSION COMPLETED ===');
    }
  };

  // Override window.alert to track when it's called (client-side only)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const originalAlert = window.alert;
      window.alert = (message: string) => {
        addDebugLog(`ALERT CALLED: "${message}"`);
        addDebugLog(`Stack trace: ${new Error().stack}`);
        return originalAlert(message);
      };

      return () => {
        window.alert = originalAlert;
      };
    }
  }, []);

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
                <h1 className="text-2xl font-bold text-gray-900">Debug Event Creation</h1>
                <p className="text-gray-600">Test event creation with detailed logging</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Form</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Deskripsi event"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Event
                  </label>
                  <ImageUploadWithCompression
                    onImageSelect={handleImageSelect}
                    imageType="featured"
                    currentImage={imagePreview || undefined}
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2"
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
              </form>
            </div>

            {/* Debug Log */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Debug Log</h3>
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                {debugLog.length === 0 ? (
                  <p className="text-gray-500 text-sm">No debug messages yet...</p>
                ) : (
                  <div className="space-y-1">
                    {debugLog.map((log, index) => (
                      <div key={index} className="text-xs font-mono text-gray-700">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                onClick={() => setDebugLog([])}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Clear Log
              </Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminAuth>
  );
}
