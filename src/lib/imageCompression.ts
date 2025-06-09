/**
 * Image compression utility for PontigramID
 * Automatically compresses images to optimize file size while maintaining quality
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface CompressionResult {
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  dataUrl: string;
}

/**
 * Compress an image file with specified options
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 1200,
    maxHeight = 800,
    quality = 0.8,
    maxSizeKB = 500,
    format = 'jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        const { width, height } = calculateDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight,
          maxSizeKB
        );

        canvas.width = width;
        canvas.height = height;

        // Draw and compress the image with optimizations
        if (ctx) {
          // Optimasi rendering untuk kompresi yang lebih baik
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Untuk file sangat kecil, gunakan teknik tambahan
          if (maxSizeKB <= 100) {
            // Pre-filter untuk mengurangi noise
            ctx.filter = 'blur(0.5px)';
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Reset filter
          ctx.filter = 'none';
          
          // Try different quality levels to meet size requirements
          compressToTargetSize(canvas, format, quality, maxSizeKB)
            .then(result => {
              const compressedFile = dataURLToFile(result.dataUrl, file.name, format);
              
              resolve({
                compressedFile,
                originalSize: file.size,
                compressedSize: compressedFile.size,
                compressionRatio: (1 - compressedFile.size / file.size) * 100,
                dataUrl: result.dataUrl
              });
            })
            .catch(reject);
        } else {
          reject(new Error('Could not get canvas context'));
        }
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate optimal dimensions while maintaining aspect ratio
 * Dengan optimasi agresif untuk ukuran file kecil
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  targetSizeKB?: number
): { width: number; height: number } {
  let { width, height } = { width: originalWidth, height: originalHeight };

  // Pengurangan dimensi yang lebih agresif untuk target ukuran kecil
  if (targetSizeKB && targetSizeKB <= 100) {
    // Untuk file sangat kecil, kurangi dimensi lebih drastis
    maxWidth = Math.min(maxWidth, 400);
    maxHeight = Math.min(maxHeight, 300);
  } else if (targetSizeKB && targetSizeKB <= 200) {
    // Untuk file kecil, kurangi dimensi sedang
    maxWidth = Math.min(maxWidth, 600);
    maxHeight = Math.min(maxHeight, 450);
  }

  // Scale down if image is larger than max dimensions
  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Compress image to target file size with aggressive optimization
 */
async function compressToTargetSize(
  canvas: HTMLCanvasElement,
  format: string,
  initialQuality: number,
  maxSizeKB: number
): Promise<{ dataUrl: string; quality: number }> {
  let quality = initialQuality;
  let dataUrl = '';
  let attempts = 0;
  const maxAttempts = 15; // Lebih banyak percobaan

  // Mulai dengan kualitas yang lebih rendah untuk file yang sangat kecil
  if (maxSizeKB <= 100) {
    quality = Math.min(initialQuality, 0.6);
  }

  while (attempts < maxAttempts) {
    const mimeType = `image/${format}`;
    dataUrl = canvas.toDataURL(mimeType, quality);

    // Calculate file size from data URL (lebih akurat)
    const base64Length = dataUrl.split(',')[1].length;
    const sizeKB = (base64Length * 0.75) / 1024;

    console.log(`Compression attempt ${attempts + 1}: Quality ${quality.toFixed(2)}, Size: ${sizeKB.toFixed(1)}KB, Target: ${maxSizeKB}KB`);

    if (sizeKB <= maxSizeKB || quality <= 0.05) {
      break;
    }

    // Pengurangan kualitas yang lebih agresif untuk file kecil
    if (maxSizeKB <= 100) {
      quality -= 0.05; // Pengurangan lebih halus untuk kontrol yang lebih baik
    } else if (maxSizeKB <= 200) {
      quality -= 0.08;
    } else {
      quality -= 0.1;
    }

    attempts++;
  }

  return { dataUrl, quality };
}

/**
 * Convert data URL to File object
 */
function dataURLToFile(dataUrl: string, filename: string, format: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || `image/${format}`;
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  // Generate filename with proper extension
  const extension = format === 'jpeg' ? 'jpg' : format;
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  const newFilename = `${nameWithoutExt}_compressed.${extension}`;
  
  return new File([u8arr], newFilename, { type: mime });
}

/**
 * Validate if file is a supported image format
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get compression settings based on image type
 */
export function getCompressionSettings(imageType: 'thumbnail' | 'featured' | 'content'): CompressionOptions {
  // Deteksi dukungan WebP
  const supportsWebP = (() => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch {
      return false;
    }
  })();

  const baseFormat = supportsWebP ? 'webp' : 'jpeg';
  const webpQualityBonus = supportsWebP ? 0.1 : 0; // WebP bisa kualitas lebih tinggi dengan ukuran sama

  switch (imageType) {
    case 'thumbnail':
      return {
        maxWidth: 250,
        maxHeight: 180,
        quality: Math.min(0.5 + webpQualityBonus, 0.8),
        maxSizeKB: 30, // Sangat kecil untuk thumbnail
        format: baseFormat
      };
    case 'featured':
      return {
        maxWidth: 700,
        maxHeight: 500,
        quality: Math.min(0.6 + webpQualityBonus, 0.8),
        maxSizeKB: 150, // Maksimal 150KB untuk featured image
        format: baseFormat
      };
    case 'content':
      return {
        maxWidth: 500,
        maxHeight: 350,
        quality: Math.min(0.55 + webpQualityBonus, 0.8),
        maxSizeKB: 100, // Maksimal 100KB untuk content image
        format: baseFormat
      };
    default:
      return {
        maxWidth: 700,
        maxHeight: 500,
        quality: Math.min(0.6 + webpQualityBonus, 0.8),
        maxSizeKB: 150,
        format: baseFormat
      };
  }
}

/**
 * Batch compress multiple images
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {},
  onProgress?: (progress: number, currentFile: string) => void
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (onProgress) {
      onProgress((i / files.length) * 100, file.name);
    }
    
    if (isValidImageFile(file)) {
      try {
        const result = await compressImage(file, options);
        results.push(result);
      } catch (error) {
        console.error(`Failed to compress ${file.name}:`, error);
        // Add original file as fallback
        results.push({
          compressedFile: file,
          originalSize: file.size,
          compressedSize: file.size,
          compressionRatio: 0,
          dataUrl: URL.createObjectURL(file)
        });
      }
    }
  }
  
  if (onProgress) {
    onProgress(100, 'Complete');
  }
  
  return results;
}
