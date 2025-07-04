import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply middleware to admin routes
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin/')) {
    return NextResponse.next();
  }

  // Public routes that don't require authentication
  const publicRoutes = [
    '/admin/login',
    '/admin/test-news',
    '/admin/test-api',
    '/admin/test',
    '/admin/test-login'
  ];

  // Check if the route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Admin routes that require authentication
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin/')) {
    try {
      const session = await getSession();

      if (!session) {
        // Redirect to login for admin pages
        if (pathname.startsWith('/admin')) {
          const loginUrl = new URL('/admin/login', request.url);
          loginUrl.searchParams.set('redirect', pathname);
          return NextResponse.redirect(loginUrl);
        }

        // Return 401 for API routes
        if (pathname.startsWith('/api/admin/')) {
          return NextResponse.json(
            { success: false, error: 'Authentication required' },
            { status: 401 }
          );
        }
      }

      // Check if user has admin privileges
      if (session && !['admin', 'super_admin'].includes(session.role)) {
        if (pathname.startsWith('/admin')) {
          return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        if (pathname.startsWith('/api/admin/')) {
          return NextResponse.json(
            { success: false, error: 'Admin privileges required' },
            { status: 403 }
          );
        }
      }

      return NextResponse.next();

    } catch (error) {
      console.error('Middleware authentication error:', error);

      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      if (pathname.startsWith('/api/admin/')) {
        return NextResponse.json(
          { success: false, error: 'Authentication error' },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
};
