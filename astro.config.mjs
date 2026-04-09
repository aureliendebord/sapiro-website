import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://sapiro.app',
  adapter: cloudflare(),
  integrations: [sitemap({
    lastmod: new Date(),
  })],
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'es'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
