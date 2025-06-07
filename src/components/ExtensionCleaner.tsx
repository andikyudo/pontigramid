'use client';

import { useEffect } from 'react';
import { initializeExtensionCleaner, logExtensionInfo } from '@/lib/browser-extensions';

/**
 * Komponen untuk membersihkan atribut ekstensi browser
 * yang dapat menyebabkan hydration mismatch
 */
export default function ExtensionCleaner() {
  useEffect(() => {
    // Inisialisasi pembersihan ekstensi
    const cleanup = initializeExtensionCleaner();
    
    // Log informasi ekstensi untuk debugging (hanya di development)
    if (process.env.NODE_ENV === 'development') {
      logExtensionInfo();
    }

    // Cleanup saat komponen unmount
    return cleanup;
  }, []);

  // Komponen ini tidak merender apa-apa
  return null;
}
