/**
 * Lee public/mapa/unidad1.xml (draw.io) y genera:
 * - src/mapaConceptual/nivel-operativo-unidad-1.mmd (referencia / diff)
 * - src/mapaConceptual/nivel-operativo-unidad-1.graph.json (consumo en la app, ELK)
 * Ejecutar desde frontend/: node scripts/generate-unidad1-mmd-from-xml.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const xmlPath = path.join(root, 'public', 'mapa', 'unidad1.xml')
const outPath = path.join(root, 'src', 'mapaConceptual', 'nivel-operativo-unidad-1.mmd')
const outJsonPath = path.join(root, 'src', 'mapaConceptual', 'nivel-operativo-unidad-1.graph.json')

const xml = fs.readFileSync(xmlPath, 'utf8')

function decode(s) {
  let t = s.replace(/&amp;/g, '&')
  t = t.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  t = t.replace(/&nbsp;/g, ' ').replace(/\u00a0/g, ' ')
  t = t.replace(/&#xa;/g, '\n')
  return t
}

function stripHtml(s) {
  let t = decode(s)
  t = t.replace(/<br\s*\/?>/gi, ' ')
  // draw.io suele partir el texto en varios <div>: sin espacio queda "Influenciay"
  t = t.replace(/<\/div>\s*<div\b[^>]*>/gi, ' ')
  t = t.replace(/<[^>]+>/g, '')
  return t.replace(/\s+/g, ' ').trim()
}

/** Aristas que en el .xml no estaban modeladas pero corresponden al mapa conceptual. */
const EXTRA_EDGES = [
  ['321', '330'],
  ['321', '331'],
  ['321', '335'],
]

/** Textos revisados (ortografía / redacción) por id de celda draw.io. */
const LABEL_OVERRIDES = new Map([
  ['321', 'Rasgos de la personalidad'],
  ['329', 'Teorías situacionales del liderazgo'],
  ['362', 'Gestión de proyectos'],
  ['363', 'Gestión de procesos'],
  ['364', 'Gestión de recursos humanos'],
  ['365', 'Gestión de la información'],
  ['366', 'Gestión de la comunicación'],
  ['370', 'Fenómeno de influencia interpersonal'],
  ['371', 'Proceso de reducción de la incertidumbre de un grupo'],
  ['372', 'Relación funcional entre el líder y los subordinados'],
  ['373', 'Proceso en función del líder, de los seguidores y de las variables de la situación.'],
])

const vertices = new Map()
const reV = /<mxCell id="(\d+)"([^>]*)>/g
let m
while ((m = reV.exec(xml)) !== null) {
  const attrs = m[2]
  if (!attrs.includes('vertex="1"')) continue
  const id = m[1]
  const vm = /value="([^"]*)"/.exec(attrs)
  if (!vm) continue
  const raw = stripHtml(vm[1])
  if (!raw) continue
  vertices.set(id, LABEL_OVERRIDES.has(id) ? LABEL_OVERRIDES.get(id) : raw)
}

const edges = []
const reE = /<mxCell id="\d+" edge="1"[^>]+>/g
while ((m = reE.exec(xml)) !== null) {
  const b = m[0]
  const s = /source="(\d+)"/.exec(b)
  const t = /target="(\d+)"/.exec(b)
  if (s && t) edges.push([s[1], t[1]])
}

const edgeKey = new Set()
const deduped = []
for (const [a, b] of edges) {
  const k = `${a}->${b}`
  if (edgeKey.has(k)) continue
  edgeKey.add(k)
  deduped.push([a, b])
}
for (const [a, b] of EXTRA_EDGES) {
  const k = `${a}->${b}`
  if (edgeKey.has(k)) continue
  edgeKey.add(k)
  deduped.push([a, b])
}

const ROOT = '4'
const adj = new Map()
for (const [a, b] of deduped) {
  if (!adj.has(a)) adj.set(a, [])
  adj.get(a).push(b)
}

const depth = new Map()
const q = [ROOT]
depth.set(ROOT, 0)
while (q.length) {
  const u = q.shift()
  const du = depth.get(u)
  for (const v of adj.get(u) || []) {
    if (depth.has(v)) continue
    depth.set(v, du + 1)
    q.push(v)
  }
}

const MAX_DEPTH_CLASS = 7
for (const id of vertices.keys()) {
  if (!depth.has(id)) depth.set(id, MAX_DEPTH_CLASS)
  else depth.set(id, Math.min(depth.get(id), MAX_DEPTH_CLASS))
}

function mermaidSafeLabel(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/"/g, "'")
    .replace(/\[/g, '(')
    .replace(/\]/g, ')')
    .replace(/\|/g, '/')
    .replace(/#/g, '·')
    .replace(/\n/g, ' ')
}

const init =
  "%%{init: {'theme':'neutral','themeVariables':{'lineColor':'#3d5a72','primaryTextColor':'#0a1530','fontSize':'18px','fontWeight':'bold'},'flowchart':{'htmlLabels':true,'curve':'stepBefore','nodeSpacing':44,'rankSpacing':60,'padding':20,'wrappingWidth':640}}}%%"

const lines = [
  '%% Mapa Unidad 1 — traducido desde public/mapa/unidad1.xml (draw.io)',
  '%% Regenerar: node scripts/generate-unidad1-mmd-from-xml.mjs',
  init,
  'flowchart TB',
]

const sortedIds = [...vertices.keys()].sort((a, b) => Number(a) - Number(b))
for (const id of sortedIds) {
  const mid = `n${id}`
  lines.push(`  ${mid}["${mermaidSafeLabel(vertices.get(id))}"]`)
}

for (const [a, b] of deduped) {
  lines.push(`  n${a} --> n${b}`)
}

const byDepth = new Map()
for (const id of sortedIds) {
  const d = depth.get(id)
  if (!byDepth.has(d)) byDepth.set(d, [])
  byDepth.get(d).push(`n${id}`)
}

lines.push('')
lines.push('  classDef depth0 fill:#00364a,stroke:#001a26,stroke-width:1.5px,color:#ffffff')
lines.push('  classDef depth1 fill:#054060,stroke:#002030,stroke-width:1.5px,color:#ffffff')
lines.push('  classDef depth2 fill:#0a5672,stroke:#00364a,stroke-width:1.5px,color:#ffffff')
lines.push('  classDef depth3 fill:#0f6d8f,stroke:#004560,stroke-width:1.5px,color:#ffffff')
lines.push('  classDef depth4 fill:#1489b0,stroke:#005a78,stroke-width:1.5px,color:#ffffff')
lines.push('  classDef depth5 fill:#3aa3d4,stroke:#0a6d90,stroke-width:1.5px,color:#0a1530')
lines.push('  classDef depth6 fill:#6bc4eb,stroke:#2a8fba,stroke-width:1.5px,color:#0a1530')
lines.push('  classDef depth7 fill:#a8e3fc,stroke:#4aa8cc,stroke-width:1.5px,color:#0a1530')
lines.push('')

for (let d = 0; d <= MAX_DEPTH_CLASS; d++) {
  const ids = byDepth.get(d)
  if (!ids?.length) continue
  lines.push(`  class ${ids.join(',')} depth${d}`)
}

fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf8')
console.log(`Wrote ${outPath} (${vertices.size} nodes, ${deduped.length} edges)`)

const graphDoc = {
  version: 1,
  rootId: 'n4',
  nodes: sortedIds.map((id) => ({
    id: `n${id}`,
    label: vertices.get(id),
    depth: depth.get(id) ?? MAX_DEPTH_CLASS,
  })),
  edges: deduped.map(([a, b], i) => ({
    id: `e_${a}_${b}_${i}`,
    source: `n${a}`,
    target: `n${b}`,
  })),
}
fs.writeFileSync(outJsonPath, `${JSON.stringify(graphDoc, null, 2)}\n`, 'utf8')
console.log(`Wrote ${outJsonPath}`)
