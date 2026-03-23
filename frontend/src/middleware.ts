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

  if (
    PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/')) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/dashboard')) {
    const hasSession = request.cookies.get('td_session')?.value;
    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
