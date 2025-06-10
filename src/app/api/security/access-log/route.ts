import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

// Simple in-memory rate limiting (in production, use Redis or database)
const accessAttempts = new Map<string, { count: number; lastAttempt: number }>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, userAgent, timestamp } = body;
    
    // Get real IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    // Rate limiting check
    const now = Date.now();
    const clientKey = `${ip}-${userAgent}`;
    const existing = accessAttempts.get(clientKey);
    
    if (existing) {
      // Reset counter if more than 1 hour has passed
      if (now - existing.lastAttempt > 3600000) {
        existing.count = 1;
        existing.lastAttempt = now;
      } else {
        existing.count++;
        existing.lastAttempt = now;
        
        // If too many attempts, return error
        if (existing.count > 10) {
          console.warn(`Rate limit exceeded for ${ip} - ${userAgent}`);
          return NextResponse.json(
            { success: false, error: 'Too many requests' },
            { status: 429 }
          );
        }
      }
    } else {
      accessAttempts.set(clientKey, { count: 1, lastAttempt: now });
    }

    // Log the access attempt
    console.log(`Admin portal access attempt:`, {
      ip,
      userAgent,
      path,
      timestamp: new Date(timestamp).toISOString(),
      count: accessAttempts.get(clientKey)?.count || 1
    });

    // In production, you might want to store this in a database
    // For now, we'll just log it to console
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error logging access attempt:', error);
    return NextResponse.json(
      { success: false, error: 'Logging failed' },
      { status: 500 }
    );
  }
}

// Clean up old entries periodically (simple cleanup)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of accessAttempts.entries()) {
    if (now - value.lastAttempt > 3600000) { // 1 hour
      accessAttempts.delete(key);
    }
  }
}, 300000); // Clean every 5 minutes
