import { NextResponse } from 'next/server';
import { setCSRFToken } from '@/lib/auth';

export async function GET() {
  try {
    const token = await setCSRFToken();
    
    return NextResponse.json({
      success: true,
      csrfToken: token
    });
    
  } catch (error) {
    console.error('CSRF token generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
