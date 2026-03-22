import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const fallbackLocale = routing.defaultLocale;
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const protectedPaths = ['/listings/create', '/profile', '/favorites'];
const authPaths = ['/login', '/register', '/reset-password'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('cargo_token')?.value;

  // Strip locale prefix to check the path
  const pathWithoutLocale = pathname.replace(/^\/(en|ru|tk)/, '') || '/';

  // Redirect to login if accessing protected routes without token
  if (protectedPaths.some((p) => pathWithoutLocale.startsWith(p)) && !token) {
    const locale = pathname.match(/^\/(en|ru|tk)/)?.[1] || fallbackLocale;
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Redirect to home if accessing auth pages while logged in
  if (authPaths.some((p) => pathWithoutLocale.startsWith(p)) && token) {
    const locale = pathname.match(/^\/(en|ru|tk)/)?.[1] || fallbackLocale;
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
