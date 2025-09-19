import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

// Create the internationalization middleware
const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'zh'],

  // Used when no locale matches
  defaultLocale: 'en',

  // When using domain-based routing, you can set
  // different default locales per domain
  localePrefix: 'as-needed',

  // Redirect to default locale when visiting root
  pathnames: {
    '/': '/',
    '/products': {
      en: '/products',
      zh: '/products'
    },
    '/products/[slug]': {
      en: '/products/[slug]',
      zh: '/products/[slug]'
    },
    '/custom-cake': {
      en: '/custom-cake',
      zh: '/custom-cake'
    },
    '/cart': {
      en: '/cart',
      zh: '/cart'
    },
    '/checkout': {
      en: '/checkout',
      zh: '/checkout'
    }
  }
});

export default function middleware(request: NextRequest) {
  // Handle API routes and static files
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.includes('/icon') ||
    request.nextUrl.pathname.includes('/favicon')
  ) {
    return;
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(zh|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};