import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: 'Analytics API is working',
      timestamp: new Date().toISOString(),
      url: request.url
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Analytics API error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      success: true,
      message: 'Analytics POST received',
      data: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Analytics POST error' },
      { status: 500 }
    );
  }
}
