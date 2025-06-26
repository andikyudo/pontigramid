import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode');

  if (mode === 'analytics') {
    return NextResponse.json({
      success: true,
      message: 'Analytics mode detected',
      data: {
        mode,
        url: request.url,
        headers: {
          userAgent: request.headers.get('user-agent'),
          forwarded: request.headers.get('x-forwarded-for'),
          host: request.headers.get('host')
        }
      },
      timestamp: new Date().toISOString()
    });
  }

  return NextResponse.json({
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, articleSlug } = body;

    if (mode === 'track-view') {
      return NextResponse.json({
        success: true,
        message: 'Track view mode detected',
        data: {
          mode,
          articleSlug,
          ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
          userAgent: request.headers.get('user-agent') || 'Unknown'
        },
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'POST request received',
      data: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({
      success: false,
      error: 'Invalid JSON',
      timestamp: new Date().toISOString()
    }, { status: 400 });
  }
}
