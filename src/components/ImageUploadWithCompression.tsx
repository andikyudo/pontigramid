'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { compressImage, isValidImageFile, formatFileSize, getCompressionSettings, CompressionResult } from '@/lib/imageCompression';

interface ImageUploadProps {
  onImageSelect: (dataUrl: string, file: File) => void;
  imageType?: 'thumbnail' | 'featured' | 'content';
  currentImage?: string;
  className?: string;
  maxFiles?: number;
}

interface UploadState {
  status: 'idle' | 'compressing' | 'success' | 'error';
  progress: number;
  message: string;
  result?: CompressionResult;
}

export default function ImageUploadWithCompression({
  onImageSelect,
  imageType = 'featured',
  currentImage,
  className = '',
  maxFiles = 1
}: ImageUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
    message: ''
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressionSettings = getCompressionSettings(imageType);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).slice(0, maxFiles);
    
    if (fileArray.length === 0) return;

    const file = fileArray[0]; // Handle single file for now

    if (!isValidImageFile(file)) {
      setUploadState({
        status: 'error',
        progress: 0,
        message: 'Format file tidak didukung. Gunakan JPEG, PNG, atau WebP.'
      });
      return;
    }

    setUploadState({
      status: 'compressing',
      progress: 0,
      message: 'Mengompres gambar...'
    });

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 100);

      const result = await compressImage(file, compressionSettings);

      clearInterval(progressInterval);

      setUploadState({
        status: 'success',
        progress: 100,
        message: `Berhasil dikompres ${result.compressionRatio.toFixed(1)}%`,
        result
      });

      // Call the parent callback with compressed image
      onImageSelect(result.dataUrl, result.compressedFile);

    } catch (error) {
      console.error('Compression error:', error);
      setUploadState({
        status: 'error',
        progress: 0,
        message: 'Gagal mengompres gambar. Silakan coba lagi.'
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setUploadState({
      status: 'idle',
      progress: 0,
      message: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusIcon = () => {
    switch (uploadState.status) {
      case 'compressing':
        return <Loader2 className="h-6 w-6 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Upload className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (uploadState.status) {
      case 'compressing':
        return 'border-blue-300 bg-blue-50';
      case 'success':
        return 'border-green-300 bg-green-50';
      case 'error':
        return 'border-red-300 bg-red-50';
      default:
        return dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${getStatusColor()}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-4">
          {/* Status Icon */}
          <div className="flex justify-center">
            {getStatusIcon()}
          </div>

          {/* Current Image Preview */}
          {(currentImage || uploadState.result) && (
            <div className="relative inline-block">
              <img
                src={uploadState.result?.dataUrl || currentImage}
                alt="Preview"
                className="max-w-full max-h-48 rounded-lg shadow-md"
              />
              <button
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Upload Instructions */}
          <div>
            <p className="text-sm font-medium text-gray-700">
              {uploadState.status === 'idle' ? 'Pilih atau seret gambar ke sini' : uploadState.message}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Format: JPEG, PNG, WebP • Maks: {compressionSettings.maxSizeKB}KB setelah kompresi
            </p>
          </div>

          {/* Progress Bar */}
          {uploadState.status === 'compressing' && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadState.progress}%` }}
              ></div>
            </div>
          )}

          {/* Compression Stats */}
          {uploadState.result && (
            <div className="text-xs text-gray-600 bg-white rounded-lg p-3 border">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <span className="font-medium">Ukuran asli:</span>
                  <br />
                  <span className="text-red-600 font-semibold">{formatFileSize(uploadState.result.originalSize)}</span>
                </div>
                <div>
                  <span className="font-medium">Setelah kompresi:</span>
                  <br />
                  <span className="text-green-600 font-semibold">{formatFileSize(uploadState.result.compressedSize)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="font-medium text-green-600">
                  💾 Hemat {uploadState.result.compressionRatio.toFixed(1)}%
                </span>
                {uploadState.result.compressedSize <= compressionSettings.maxSizeKB! * 1024 ? (
                  <span className="text-green-600 font-semibold text-xs">
                    ✅ Target tercapai
                  </span>
                ) : (
                  <span className="text-orange-600 font-semibold text-xs">
                    ⚠️ Melebihi target
                  </span>
                )}
              </div>

              <div className="mt-2 text-center">
                <div className="text-xs text-gray-500">
                  Target: {compressionSettings.maxSizeKB}KB •
                  Kualitas: {(compressionSettings.quality! * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {uploadState.status === 'idle' && (
            <button
              onClick={openFileDialog}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Pilih Gambar
            </button>
          )}
        </div>
      </div>

      {/* Compression Settings Info */}
      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
        <div className="font-medium mb-1">Pengaturan kompresi untuk {imageType}:</div>
        <div className="grid grid-cols-2 gap-2">
          <div>Dimensi maks: {compressionSettings.maxWidth}×{compressionSettings.maxHeight}px</div>
          <div>Kualitas: {(compressionSettings.quality! * 100).toFixed(0)}%</div>
        </div>
      </div>
    </div>
  );
}
