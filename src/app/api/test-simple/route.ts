import { NextRequest, NextResponse } from 'next/server';

// Simple test API without database connection
export async function GET(request: NextRequest) {
  try {
    console.log('Simple Test API: Starting...');
    
    return NextResponse.json({
      success: true,
      message: 'Simple test API is working',
      timestamp: new Date().toISOString(),
      url: request.url
    });

  } catch (error) {
    console.error('Simple Test API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to run simple test',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
