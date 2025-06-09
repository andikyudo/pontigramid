'use client';

import { useState } from 'react';
import { Upload, Download, Image as ImageIcon, Zap } from 'lucide-react';
import { compressImage, getCompressionSettings, formatFileSize, isValidImageFile } from '@/lib/imageCompression';

interface CompressionResult {
  original: {
    file: File;
    size: number;
    dataUrl: string;
  };
  compressed: {
    file: File;
    size: number;
    dataUrl: string;
    quality: number;
    compressionRatio: number;
  };
}

export default function TestCompressionPage() {
  const [results, setResults] = useState<CompressionResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [selectedType, setSelectedType] = useState<'thumbnail' | 'featured' | 'content'>('featured');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setProcessing(true);
    const newResults: CompressionResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!isValidImageFile(file)) {
        alert(`File ${file.name} bukan format gambar yang didukung`);
        continue;
      }

      try {
        const originalDataUrl = URL.createObjectURL(file);
        const settings = getCompressionSettings(selectedType);
        
        console.log(`Compressing ${file.name} with settings:`, settings);
        
        const compressionResult = await compressImage(file, settings);
        
        newResults.push({
          original: {
            file,
            size: file.size,
            dataUrl: originalDataUrl
          },
          compressed: {
            file: compressionResult.compressedFile,
            size: compressionResult.compressedSize,
            dataUrl: compressionResult.dataUrl,
            quality: 0, // Will be updated
            compressionRatio: compressionResult.compressionRatio
          }
        });

        console.log(`Compression complete for ${file.name}:`, {
          originalSize: formatFileSize(file.size),
          compressedSize: formatFileSize(compressionResult.compressedSize),
          ratio: compressionResult.compressionRatio.toFixed(1) + '%'
        });

      } catch (error) {
        console.error(`Error compressing ${file.name}:`, error);
        alert(`Gagal mengompres ${file.name}: ${error}`);
      }
    }

    setResults(prev => [...prev, ...newResults]);
    setProcessing(false);
  };

  const downloadCompressed = (result: CompressionResult) => {
    const link = document.createElement('a');
    link.href = result.compressed.dataUrl;
    link.download = `compressed_${result.original.file.name}`;
    link.click();
  };

  const clearResults = () => {
    setResults([]);
  };

  const settings = getCompressionSettings(selectedType);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🗜️ Test Kompresi Gambar
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Uji coba sistem kompresi gambar otomatis dengan berbagai pengaturan untuk memastikan ukuran file minimal.
          </p>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Pengaturan Kompresi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Gambar
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="thumbnail">Thumbnail (Sangat Kecil)</option>
                <option value="featured">Featured Image (Kecil)</option>
                <option value="content">Content Image (Sedang)</option>
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Pengaturan Aktif:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Dimensi Maks: {settings.maxWidth}×{settings.maxHeight}px</div>
                <div>Kualitas: {(settings.quality! * 100).toFixed(0)}%</div>
                <div>Target Ukuran: <span className="font-semibold text-red-600">{settings.maxSizeKB}KB</span></div>
                <div>Format: {settings.format?.toUpperCase()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Gambar untuk Ditest
            </h3>
            <p className="text-gray-600 mb-4">
              Pilih satu atau beberapa gambar untuk menguji kompresi
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={processing}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${
                processing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ImageIcon className="h-5 w-5 mr-2" />
              {processing ? 'Memproses...' : 'Pilih Gambar'}
            </label>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Hasil Kompresi</h2>
              <button
                onClick={clearResults}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Hapus Semua
              </button>
            </div>

            <div className="space-y-6">
              {results.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Original */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">📁 Original</h3>
                      <div className="space-y-3">
                        <img
                          src={result.original.dataUrl}
                          alt="Original"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm space-y-1">
                            <div><span className="font-medium">Nama:</span> {result.original.file.name}</div>
                            <div><span className="font-medium">Ukuran:</span> <span className="text-red-600 font-semibold">{formatFileSize(result.original.size)}</span></div>
                            <div><span className="font-medium">Tipe:</span> {result.original.file.type}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Compressed */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">⚡ Terkompresi</h3>
                      <div className="space-y-3">
                        <img
                          src={result.compressed.dataUrl}
                          alt="Compressed"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-sm space-y-1">
                            <div><span className="font-medium">Nama:</span> {result.compressed.file.name}</div>
                            <div><span className="font-medium">Ukuran:</span> <span className="text-green-600 font-semibold">{formatFileSize(result.compressed.size)}</span></div>
                            <div><span className="font-medium">Penghematan:</span> <span className="text-green-600 font-semibold">{result.compressed.compressionRatio.toFixed(1)}%</span></div>
                            <div><span className="font-medium">Target:</span> {settings.maxSizeKB}KB</div>
                          </div>
                          <button
                            onClick={() => downloadCompressed(result)}
                            className="mt-3 w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compression Stats */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Status Kompresi:</span>
                      {result.compressed.size <= settings.maxSizeKB! * 1024 ? (
                        <span className="text-green-600 font-semibold flex items-center">
                          <Zap className="h-4 w-4 mr-1" />
                          ✅ Target Tercapai
                        </span>
                      ) : (
                        <span className="text-orange-600 font-semibold">
                          ⚠️ Melebihi Target ({formatFileSize(result.compressed.size)} &gt; {settings.maxSizeKB}KB)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
