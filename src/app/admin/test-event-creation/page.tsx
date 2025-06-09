'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminAuth from '@/components/admin/AdminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageUploadWithCompression from '@/components/ImageUploadWithCompression';

export default function TestEventCreationPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageSelect = (dataUrl: string, file: File) => {
    setImagePreview(dataUrl);
    setImageFile(file);
    console.log('Image selected:', {
      originalSize: file.size,
      compressedSize: file.size,
      type: file.type,
      name: file.name
    });
  };

  const testEventCreation = async () => {
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      
      // Add test event data
      formData.append('title', 'Test Event - Image Processing');
      formData.append('description', 'This is a test event to verify image processing functionality.');
      formData.append('date', '2024-12-31');
      formData.append('time', '10:00');
      formData.append('location', 'Test Location');
      formData.append('category', 'teknologi');
      formData.append('organizer', 'Test Organizer');
      formData.append('isActive', 'true');
      formData.append('isFeatured', 'false');
      formData.append('registrationRequired', 'false');
      formData.append('isFree', 'true');

      // Add compressed image if available
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch('/api/admin/events', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        console.log('Event created successfully:', data);
      } else {
        console.error('Event creation failed:', data.error);
      }

    } catch (error) {
      console.error('Test error:', error);
      setResult({ success: false, error: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuth>
      <AdminLayout>
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test Event Creation & Image Processing</h1>
            <p className="text-gray-600">Test the event creation functionality with image compression</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Upload Test</h3>
              <ImageUploadWithCompression
                onImageSelect={handleImageSelect}
                imageType="featured"
                currentImage={imagePreview || undefined}
                className="w-full"
              />
            </div>

            {imagePreview && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">Image Preview:</h4>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-md h-48 object-cover rounded-lg border"
                />
                {imageFile && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>File: {imageFile.name}</p>
                    <p>Size: {(imageFile.size / 1024).toFixed(1)} KB</p>
                    <p>Type: {imageFile.type}</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <Button
                onClick={testEventCreation}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2"
              >
                {loading ? 'Testing...' : 'Test Event Creation'}
              </Button>
            </div>

            {result && (
              <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <h4 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.success ? 'Success!' : 'Error!'}
                </h4>
                <pre className={`mt-2 text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Test Instructions:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Upload an image using the compression component above</li>
              <li>2. Verify the image is compressed and preview is shown</li>
              <li>3. Click "Test Event Creation" to test the API endpoint</li>
              <li>4. Check the result for success or error messages</li>
              <li>5. If successful, the event should be created with the compressed image</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Expected Behavior:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Image should be compressed automatically on upload</li>
              <li>• Compression ratio and file size should be displayed</li>
              <li>• Event creation should succeed without "Gagal Memproses Gambar" error</li>
              <li>• Response should include event data with imageUrl field</li>
              <li>• Image should be stored as base64 data URL in database</li>
            </ul>
          </div>
        </div>
      </AdminLayout>
    </AdminAuth>
  );
}
