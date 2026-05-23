import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const src = 'c:/Users/castr/Desktop/Ishikawa.drawio.html'
const outDir = path.join(__dirname, '../../media/desafios')
const outFile = path.join(outDir, 'ishikawa-bagit.svg')

const html = fs.readFileSync(src, 'utf8')
const start = html.indexOf('<svg')
const end = html.lastIndexOf('</svg>') + 6
if (start < 0 || end <= start) {
  console.error('No se encontró SVG en el archivo draw.io')
  process.exit(1)
}
const svg = html.slice(start, end)

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(outFile, svg)
console.log('Escrito:', outFile, `(${svg.length} bytes)`)
