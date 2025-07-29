import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Development only middleware - no authentication checks
export function middleware(request: NextRequest) {
  // Check if there's a dummy token for admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && 
      request.nextUrl.pathname !== '/admin/login') {
    // Simple check for dummy token in development
    const dummyToken = request.cookies.get('adminToken');
    if (!dummyToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
  