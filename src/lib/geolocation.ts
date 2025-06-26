interface GeolocationData {
  country?: string;
  region?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isp?: string;
}

interface PontianakDistrict {
  name: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  center: {
    lat: number;
    lng: number;
  };
}

// Pontianak district boundaries (approximate coordinates)
const PONTIANAK_DISTRICTS: Record<string, PontianakDistrict> = {
  'pontianak-utara': {
    name: 'Pontianak Utara',
    bounds: {
      north: -0.0200,
      south: -0.0800,
      east: 109.3600,
      west: 109.3000
    },
    center: { lat: -0.0500, lng: 109.3300 }
  },
  'pontianak-timur': {
    name: 'Pontianak Timur',
    bounds: {
      north: -0.0300,
      south: -0.1000,
      east: 109.3800,
      west: 109.3400
    },
    center: { lat: -0.0650, lng: 109.3600 }
  },
  'pontianak-selatan': {
    name: 'Pontianak Selatan',
    bounds: {
      north: -0.0800,
      south: -0.1400,
      east: 109.3600,
      west: 109.3000
    },
    center: { lat: -0.1100, lng: 109.3300 }
  },
  'pontianak-barat': {
    name: 'Pontianak Barat',
    bounds: {
      north: -0.0400,
      south: -0.1000,
      east: 109.3200,
      west: 109.2800
    },
    center: { lat: -0.0700, lng: 109.3000 }
  },
  'pontianak-kota': {
    name: 'Pontianak Kota',
    bounds: {
      north: -0.0200,
      south: -0.0800,
      east: 109.3400,
      west: 109.3000
    },
    center: { lat: -0.0500, lng: 109.3200 }
  },
  'pontianak-tenggara': {
    name: 'Pontianak Tenggara',
    bounds: {
      north: -0.0800,
      south: -0.1200,
      east: 109.3800,
      west: 109.3400
    },
    center: { lat: -0.1000, lng: 109.3600 }
  }
};

// Surrounding areas
const SURROUNDING_AREAS: Record<string, PontianakDistrict> = {
  'kubu-raya': {
    name: 'Kubu Raya',
    bounds: {
      north: 0.1000,
      south: -0.3000,
      east: 109.8000,
      west: 109.0000
    },
    center: { lat: -0.1000, lng: 109.4000 }
  },
  'mempawah': {
    name: 'Mempawah',
    bounds: {
      north: 0.2000,
      south: -0.1000,
      east: 109.2000,
      west: 108.8000
    },
    center: { lat: 0.0500, lng: 109.0000 }
  },
  'landak': {
    name: 'Landak',
    bounds: {
      north: 0.5000,
      south: -0.5000,
      east: 109.5000,
      west: 108.5000
    },
    center: { lat: 0.0000, lng: 109.0000 }
  }
};

/**
 * Determine Pontianak district based on coordinates
 */
export function determinePontianakDistrict(lat: number, lng: number): string | null {
  // Check Pontianak districts first
  for (const [key, district] of Object.entries(PONTIANAK_DISTRICTS)) {
    if (
      lat >= district.bounds.south &&
      lat <= district.bounds.north &&
      lng >= district.bounds.west &&
      lng <= district.bounds.east
    ) {
      return district.name;
    }
  }
  
  // Check surrounding areas
  for (const [key, area] of Object.entries(SURROUNDING_AREAS)) {
    if (
      lat >= area.bounds.south &&
      lat <= area.bounds.north &&
      lng >= area.bounds.west &&
      lng <= area.bounds.east
    ) {
      return area.name;
    }
  }
  
  return null;
}

/**
 * Get geolocation data from IP address using multiple services
 */
export async function getGeolocationFromIP(ipAddress: string): Promise<GeolocationData> {
  // Skip localhost and private IPs
  if (
    ipAddress === '127.0.0.1' ||
    ipAddress === '::1' ||
    ipAddress.startsWith('192.168.') ||
    ipAddress.startsWith('10.') ||
    ipAddress.startsWith('172.')
  ) {
    return {
      country: 'Indonesia',
      region: 'Kalimantan Barat',
      city: 'Pontianak',
      district: 'Pontianak Kota',
      latitude: -0.0500,
      longitude: 109.3200,
      timezone: 'Asia/Pontianak'
    };
  }

  try {
    // Try ip-api.com first (free, no API key required)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,country,regionName,city,lat,lon,timezone,isp`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.status === 'success') {
        const district = data.lat && data.lon ? 
          determinePontianakDistrict(data.lat, data.lon) : null;
        
        return {
          country: data.country || 'Unknown',
          region: data.regionName || 'Unknown',
          city: data.city || 'Unknown',
          district: district || undefined,
          latitude: data.lat || undefined,
          longitude: data.lon || undefined,
          timezone: data.timezone || undefined,
          isp: data.isp || undefined
        };
      }
    }
  } catch (error) {
    console.error('Error fetching geolocation from ip-api:', error);
  }

  try {
    // Fallback to ipapi.co
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      
      if (!data.error) {
        const district = data.latitude && data.longitude ? 
          determinePontianakDistrict(data.latitude, data.longitude) : null;
        
        return {
          country: data.country_name || 'Unknown',
          region: data.region || 'Unknown',
          city: data.city || 'Unknown',
          district: district || undefined,
          latitude: data.latitude || undefined,
          longitude: data.longitude || undefined,
          timezone: data.timezone || undefined,
          isp: data.org || undefined
        };
      }
    }
  } catch (error) {
    console.error('Error fetching geolocation from ipapi.co:', error);
  }

  // Default fallback for Indonesian users
  return {
    country: 'Indonesia',
    region: 'Unknown',
    city: 'Unknown',
    latitude: undefined,
    longitude: undefined,
    timezone: 'Asia/Jakarta'
  };
}

/**
 * Parse User-Agent to determine device type and browser
 */
export function parseUserAgent(userAgent: string): {
  type: 'desktop' | 'mobile' | 'tablet';
  os?: string;
  browser?: string;
} {
  const ua = userAgent.toLowerCase();
  
  // Determine device type
  let type: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  if (ua.includes('mobile') && !ua.includes('tablet')) {
    type = 'mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    type = 'tablet';
  }
  
  // Determine OS
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  // Determine browser
  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edge')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';
  
  return { type, os, browser };
}

/**
 * Get client IP address from request headers
 */
export function getClientIP(headers: Headers): string {
  // Check various headers for the real IP
  const xForwardedFor = headers.get('x-forwarded-for');
  const xRealIP = headers.get('x-real-ip');
  const cfConnectingIP = headers.get('cf-connecting-ip');
  const xClientIP = headers.get('x-client-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (xRealIP) return xRealIP;
  if (xForwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return xForwardedFor.split(',')[0].trim();
  }
  if (xClientIP) return xClientIP;
  
  return '127.0.0.1'; // fallback
}

/**
 * Generate session ID for tracking
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if location tracking consent is given
 */
export function hasLocationConsent(headers: Headers): boolean {
  const consent = headers.get('x-location-consent');
  return consent === 'true' || consent === '1';
}
