import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://strdr4605.github.io',
  base: '/hanter.md',
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    locales: ['ro', 'ru', 'en'],
    defaultLocale: 'ro',
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: true,
    },
  },
  output: 'static',
});
