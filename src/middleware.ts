import { defineMiddleware } from 'astro:middleware';
import { locales, defaultLocale } from './i18n/index';

// Accept-Language detection — only active in dev (SSR context).
// Static builds rely on Astro i18n routing for locale handling.
export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = base ? pathname.replace(base, '') || '/' : pathname;

  // Already on a non-default locale path — pass through
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (path === `/${locale}` || path.startsWith(`/${locale}/`)) {
      return next();
    }
  }

  // On root: try to detect preferred locale from Accept-Language
  if (path === '/') {
    const acceptLang = context.request.headers.get('accept-language') ?? '';
    const preferred = acceptLang
      .split(',')
      .map((s) => s.split(';')[0].trim().toLowerCase().slice(0, 2))
      .find((lang): lang is (typeof locales)[number] =>
        locales.includes(lang as (typeof locales)[number]) && lang !== defaultLocale
      );

    if (preferred) {
      return context.redirect(`${base}/${preferred}`);
    }
  }

  return next();
});
