import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['pl', 'en'],

  // Used when no locale matches
  defaultLocale: 'pl',

  // Do not show the prefix for the default language (keeps E2E tests and SEO working)
  localePrefix: 'as-needed',

  // Disable language redirection based on browser headers (keeps Playwright tests on PL routes)
  localeDetection: false
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
