/**
 * Lee public/mapa/unidad1.xml (draw.io) y genera:
 *   src/mapaConceptual/nivel-operativo-unidad-1.graph.json (ELK en la app)
 * Ejecutar desde frontend/: node scripts/generate-unidad1-graph-from-xml.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const xmlPath = path.join(root, 'public', 'mapa', 'unidad1.xml')
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
  t = t.replace(/<\/div>\s*<div\b[^>]*>/gi, ' ')
  t = t.replace(/<[^>]+>/g, '')
  return t.replace(/\s+/g, ' ').trim()
}

const EXTRA_EDGES = [
  ['321', '330'],
  ['321', '331'],
  ['321', '335'],
]

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

const sortedIds = [...vertices.keys()].sort((a, b) => Number(a) - Number(b))

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
console.log(
  `Wrote ${outJsonPath} (${vertices.size} nodes, ${deduped.length} edges, root n${ROOT})`,
)
