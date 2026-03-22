import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/signup',
  '/onboarding',
  '/forgot-password',
  '/reset-password',
  '/auth',
  '/client-portal',
  '/features',
  '/pricing',
  '/about',
  '/blog',
  '/changelog',
  '/roadmap',
  '/careers',
  '/press',
  '/docs',
  '/help',
  '/contact',
  '/status',
  '/privacy',
  '/terms',
  '/cookies',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and static assets
  if (
    PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/')) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Protect /dashboard routes — cookie name is refresh_token (underscore, not camelCase)
  if (pathname.startsWith('/dashboard')) {
    const refreshToken = request.cookies.get('refresh_token')?.value;
    if (!refreshToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
