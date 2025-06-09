interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  const {
    maxWidth = 1200,
    maxHeight = 800,
    quality = 0.8,
    format = 'jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        
        const mimeType = `image/${format}`;
        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
        
        resolve(compressedDataUrl);
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Convert File to data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
}

export async function validateImageFile(file: File): Promise<boolean> {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Format file tidak didukung. Gunakan JPEG, PNG, WebP, atau GIF.');
  }

  if (file.size > maxSize) {
    throw new Error('Ukuran file terlalu besar. Maksimal 10MB.');
  }

  return true;
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

// Server-side image compression using sharp (if available)
export async function compressImageServer(
  buffer: Buffer,
  options: CompressOptions = {}
): Promise<Buffer> {
  const {
    maxWidth = 1200,
    maxHeight = 800,
    quality = 80
  } = options;

  try {
    // Try to use sharp if available
    const sharp = require('sharp');
    
    return await sharp(buffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality })
      .toBuffer();
  } catch (error) {
    // Fallback: return original buffer if sharp is not available
    console.warn('Sharp not available, returning original buffer');
    return buffer;
  }
}

// Convert base64 to buffer for server-side processing
export function base64ToBuffer(base64: string): Buffer {
  const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}

// Convert buffer to base64 data URL
export function bufferToBase64(buffer: Buffer, mimeType: string = 'image/jpeg'): string {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}
