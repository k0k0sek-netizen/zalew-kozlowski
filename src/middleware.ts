import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames, skipping api, static resources, next internals, metadata and images
  matcher: [
    '/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml|opengraph-image|icon.png|.*\\..*).*)'
  ]
};
