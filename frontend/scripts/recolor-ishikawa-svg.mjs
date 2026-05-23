import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcDrawio = 'c:/Users/castr/Desktop/Ishikawa.drawio.html'
const svgPath = path.join(__dirname, '../../media/desafios/ishikawa-bagit.svg')

const C = {
  purple: '#432e8c',
  purpleDark: '#2d2060',
  purpleMid: '#6f58c2',
  purpleFill: '#e2daf8',
  text: '#241838',
  white: '#ffffff',
}

const CATEGORY_LABELS = [
  'Métodos',
  'Maquinaria',
  'Mano de obra',
  'Materiales',
  'Medición',
  'Medio ambiente',
  'Errores en las facturas de las mercaderías enviadas',
]

// Re-extraer desde draw.io si existe
if (fs.existsSync(srcDrawio)) {
  const html = fs.readFileSync(srcDrawio, 'utf8')
  const start = html.indexOf('<svg')
  const end = html.lastIndexOf('</svg>') + 6
  if (start >= 0 && end > start) {
    fs.mkdirSync(path.dirname(svgPath), { recursive: true })
    fs.writeFileSync(svgPath, html.slice(start, end))
    console.log('Re-extraído desde draw.io')
  }
}

let svg = fs.readFileSync(svgPath, 'utf8')

// Solo la parte renderizada (no tocar el atributo content= del mxfile)
const defsIdx = svg.indexOf('"><defs/>')
const renderStart = defsIdx >= 0 ? defsIdx + 2 : svg.indexOf('<defs')
let header = svg.slice(0, renderStart)
let body = svg.slice(renderStart)

// Cabecera SVG: fondo blanco fijo
header = header.replace(
  /style="[^"]*"/,
  `style="background:${C.white};background-color:${C.white}"`,
)

body = body.replace(/<image\b[^>]*\/>/g, '')
body = body.replace(/light-dark\([^)]+\)/gi, C.text)

const blueMap = [
  ['#0056d6', C.purple],
  ['#00c7fc', C.purpleMid],
  ['#53d5fd', C.purpleMid],
  ['#99ccff', C.purpleFill],
  ['#dae8fc', '#f0ecf8'],
]
for (const [from, to] of blueMap) {
  body = body.replaceAll(from, to)
}

// Quitar estilos inline de dark mode que pisan fill/stroke del atributo
body = body.replace(/\s+style="fill:[^"]*"/gi, '')
body = body.replace(/\s+style="stroke:[^"]*"/gi, '')

// Cajas de las 6 M (120×60): violeta marca + texto blanco
body = body.replace(
  /(<rect[^>]*width="120" height="60"[^>]*fill=")#e2daf8("[^>]*stroke=")#6f58c2/gi,
  `$1${C.purple}$2${C.purpleDark}`,
)

// Efecto principal (180×80)
body = body.replace(
  /(<rect[^>]*width="180" height="80"[^>]*fill=")#e2daf8("[^>]*stroke=")#6f58c2/gi,
  `$1${C.purple}$2${C.purpleDark}`,
)

// Títulos de categoría y efecto: texto blanco
for (const label of CATEGORY_LABELS) {
  const esc = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  body = body.replace(
    new RegExp(
      `(color:\\s*${C.text.replace('#', '#')};[^>]*font-weight:\\s*bold;[^>]*>${esc})`,
      'gi',
    ),
    (m) => m.replace(/color:\s*#241838/gi, `color: ${C.white}`),
  )
  // Variante sin font-weight en el mismo bloque (efecto multilínea)
  body = body.replace(
    new RegExp(
      `(display: inline-block; font-size: 12px;[^>]*color: )${C.text}([^>]*>${esc})`,
      'gi',
    ),
    `$1${C.white}$2`,
  )
}

// Líneas principales del espinazo: violeta oscuro
body = body.replace(/stroke="#6f58c2"/g, `stroke="${C.purple}"`)
body = body.replace(/fill="#6f58c2"/g, `fill="${C.purple}"`)

// Causas secundarias: texto legible
body = body.replace(/color:\s*#000000/gi, `color: ${C.text}`)
body = body.replace(/font-family:\s*Helvetica/gi, 'font-family: system-ui, Segoe UI, sans-serif')

svg = header + body
fs.writeFileSync(svgPath, svg)
console.log('Guardado:', svgPath, `(${svg.length} bytes)`)
