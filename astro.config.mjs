import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sapiro.app',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'es'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
