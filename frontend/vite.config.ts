import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * Inyecta href del logo empaquetado (assets/logo-*.png) en index.html.
 * Evita depender de /logo.png en publicDir (media/) en Vercel y el favicon genérico tipo "V".
 */
function htmlInjectFaviconLinks(): Plugin {
  let base = '/'
  return {
    name: 'html-inject-favicon-links',
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        let href = '/src/assets/logo.png'
        const bundle = ctx.bundle
        if (bundle) {
          for (const item of Object.values(bundle)) {
            if (
              item.type === 'asset' &&
              item.fileName.startsWith('assets/logo-') &&
              item.fileName.endsWith('.png')
            ) {
              const path = item.fileName.startsWith('/') ? item.fileName : `/${item.fileName}`
              href = base === '/' ? path : `${base.replace(/\/$/, '')}${path}`
              break
            }
          }
        }
        const links = [
          `<link rel="icon" type="image/png" href="${href}" sizes="32x32" />`,
          `<link rel="shortcut icon" type="image/png" href="${href}" />`,
          `<link rel="apple-touch-icon" type="image/png" href="${href}" />`,
        ].join('\n    ')
        return html.replace(
          '<!-- Favicon: se asigna en main.ts',
          `${links}\n    <!-- Favicon: se asigna en main.ts`,
        )
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  publicDir: '../media',
  plugins: [vue(), htmlInjectFaviconLinks()],
})
