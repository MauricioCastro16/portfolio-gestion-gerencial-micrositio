import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Safari en localhost suele ignorar favicons por URL (/favicon.ico) y mostrar la letra
 * inicial del host ("L"). Un rel="icon" con data URI evita esa heurística en desarrollo.
 */
function faviconDataUriPlugin(): Plugin {
  return {
    name: 'favicon-data-uri',
    transformIndexHtml(html) {
      const icoPath = path.resolve(__dirname, '../media/favicon.ico')
      try {
        const b64 = fs.readFileSync(icoPath).toString('base64')
        const line = `    <link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,${b64}" />\n`
        return html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n${line}`)
      } catch {
        return html
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  publicDir: '../media',
  plugins: [vue(), faviconDataUriPlugin()],
})
