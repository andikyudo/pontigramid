/**
 * Utility functions untuk menangani masalah dengan ekstensi browser
 */

/**
 * Daftar atribut yang biasanya ditambahkan oleh ekstensi browser
 */
const EXTENSION_ATTRIBUTES = [
  // Grammarly
  'data-new-gr-c-s-check-loaded',
  'data-gr-ext-installed',
  'data-gr-ext-disabled',
  
  // LastPass
  'data-lastpass-icon-root',
  'data-lastpass-root',
  
  // 1Password
  'data-1password-root',
  'data-onepassword-root',
  
  // AdBlock
  'data-adblock',
  'data-adblock-key',
  
  // Honey
  'data-honey-extension',
  
  // MetaMask
  'data-metamask',
  
  // Generic extension markers
  'data-extension',
  'data-ext-installed'
];

/**
 * Membersihkan atribut ekstensi dari elemen
 */
export function cleanExtensionAttributes(element: HTMLElement): void {
  EXTENSION_ATTRIBUTES.forEach(attr => {
    if (element.hasAttribute(attr)) {
      element.removeAttribute(attr);
    }
  });
}

/**
 * Membersihkan atribut ekstensi dari body element
 */
export function cleanBodyExtensionAttributes(): void {
  if (typeof window !== 'undefined' && document.body) {
    cleanExtensionAttributes(document.body);
  }
}

/**
 * Observer untuk memantau perubahan atribut pada body
 */
export function createExtensionAttributeObserver(): MutationObserver | null {
  if (typeof window === 'undefined') return null;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.target === document.body) {
        const attributeName = mutation.attributeName;
        if (attributeName && EXTENSION_ATTRIBUTES.includes(attributeName)) {
          // Hapus atribut ekstensi yang baru ditambahkan
          document.body.removeAttribute(attributeName);
        }
      }
    });
  });

  // Mulai observasi
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: EXTENSION_ATTRIBUTES
  });

  return observer;
}

/**
 * Inisialisasi pembersihan ekstensi
 */
export function initializeExtensionCleaner(): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  // Bersihkan atribut yang sudah ada
  cleanBodyExtensionAttributes();

  // Setup observer untuk perubahan di masa depan
  const observer = createExtensionAttributeObserver();

  // Return cleanup function
  return () => {
    if (observer) {
      observer.disconnect();
    }
  };
}

/**
 * Hook untuk digunakan dalam komponen React
 */
export function useExtensionCleaner(): (() => void) | void {
  if (typeof window === 'undefined') return;

  // Jalankan setelah komponen mount
  const cleanup = initializeExtensionCleaner();

  // Cleanup saat unmount
  return cleanup;
}

/**
 * Deteksi apakah ada ekstensi yang aktif
 */
export function detectActiveExtensions(): string[] {
  if (typeof window === 'undefined') return [];

  const activeExtensions: string[] = [];
  
  // Check Grammarly
  if (document.body.hasAttribute('data-new-gr-c-s-check-loaded') || 
      document.body.hasAttribute('data-gr-ext-installed')) {
    activeExtensions.push('Grammarly');
  }
  
  // Check LastPass
  if (document.querySelector('[data-lastpass-icon-root]') || 
      document.querySelector('[data-lastpass-root]')) {
    activeExtensions.push('LastPass');
  }
  
  // Check 1Password
  if (document.querySelector('[data-1password-root]') || 
      document.querySelector('[data-onepassword-root]')) {
    activeExtensions.push('1Password');
  }
  
  // Check AdBlock
  if (document.querySelector('[data-adblock]')) {
    activeExtensions.push('AdBlock');
  }
  
  // Check MetaMask
  if ((window as any).ethereum || document.querySelector('[data-metamask]')) {
    activeExtensions.push('MetaMask');
  }

  return activeExtensions;
}

/**
 * Log informasi ekstensi untuk debugging
 */
export function logExtensionInfo(): void {
  if (typeof window === 'undefined') return;

  const extensions = detectActiveExtensions();
  
  if (extensions.length > 0) {
    console.info('🔌 Ekstensi browser terdeteksi:', extensions.join(', '));
    console.info('💡 Jika mengalami masalah hydration, coba disable ekstensi sementara');
  } else {
    console.info('✅ Tidak ada ekstensi browser yang terdeteksi');
  }
}
