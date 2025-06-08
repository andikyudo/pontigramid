import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Visitor from '@/models/Visitor';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { pageUrl, pageTitle, referrer } = body;
    
    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = forwarded?.split(',')[0] || realIP || 'unknown';
    
    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Track the visitor
    const visitor = await (Visitor as any).trackVisitor(
      clientIP,
      userAgent,
      pageUrl,
      pageTitle,
      referrer
    );
    
    return NextResponse.json({
      success: true,
      message: 'Visitor tracked successfully',
      data: {
        ipAddress: clientIP,
        visitCount: visitor?.visitCount || 1,
        location: visitor?.location || 'Unknown'
      }
    });
    
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get client IP for current visitor info
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = forwarded?.split(',')[0] || realIP || 'unknown';
    
    const visitor = await Visitor.findOne({ ipAddress: clientIP });
    
    return NextResponse.json({
      success: true,
      data: {
        ipAddress: clientIP,
        visitCount: visitor?.visitCount || 0,
        location: visitor?.location || 'Unknown',
        firstVisit: visitor?.firstVisit || null,
        lastVisit: visitor?.lastVisit || null
      }
    });
    
  } catch (error) {
    console.error('Error getting visitor info:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
