import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/admin/login',
    '/api/auth/login',
    '/api/auth/csrf',
    '/api/auth/logout',
    // Public API routes
    '/api/events',
    '/api/news',
    '/api/categories',
    '/api/team',
    '/api/advertisements',
    '/api/track-visitor',
    '/api/test',
    // Test routes for debugging
    '/admin/test-news',
    '/admin/test-api',
    '/admin/test',
    '/admin/test-login'
  ];

  // Check if the route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow public API routes with query parameters
  if (pathname.startsWith('/api/events') ||
      pathname.startsWith('/api/news') ||
      pathname.startsWith('/api/categories') ||
      pathname.startsWith('/api/team') ||
      pathname.startsWith('/api/advertisements') ||
      pathname.startsWith('/api/track-visitor') ||
      pathname.startsWith('/api/test')) {
    return NextResponse.next();
  }

  // Admin routes that require authentication
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin/')) {
    try {
      const session = await getSession();

      // Temporary bypass for main admin page and dashboard for testing
      if (pathname === '/admin' || pathname === '/admin/dashboard' || pathname === '/admin/news' || pathname === '/admin/footer' || pathname === '/admin/team' || pathname === '/admin/advertisements' || pathname === '/admin/events') {
        console.log('Middleware: Bypassing authentication for testing:', pathname);
        return NextResponse.next();
      }

      if (!session) {
        // Redirect to login for admin pages
        if (pathname.startsWith('/admin')) {
          const loginUrl = new URL('/admin/login', request.url);
          loginUrl.searchParams.set('redirect', pathname);
          return NextResponse.redirect(loginUrl);
        }

        // Return 401 for API routes (except test routes)
        if (pathname.startsWith('/api/admin/')) {
          // Temporary bypass for admin API testing
          if (pathname === '/api/admin/news' || pathname === '/api/admin/footer' || pathname === '/api/admin/team' || pathname === '/api/admin/advertisements' || pathname === '/api/admin/events') {
            console.log('Middleware: Bypassing API authentication for testing:', pathname);
            return NextResponse.next();
          }

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

      console.log('Middleware: Authenticated access to', pathname, 'by', session?.username);
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
    '/api/admin/:path*',
    '/api/auth/:path*'
  ]
};
