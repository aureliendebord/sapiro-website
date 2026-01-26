import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sapiro.app',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'es'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
