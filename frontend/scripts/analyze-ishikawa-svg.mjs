import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const svgPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../media/desafios/ishikawa-bagit.svg',
)
const s = fs.readFileSync(svgPath, 'utf8')
console.log('image tags', (s.match(/<image /g) || []).length)
console.log('path tags', (s.match(/<path /g) || []).length)
console.log('rect tags', (s.match(/<rect /g) || []).length)
const strokes = [...new Set(s.match(/stroke="[^"]+"/g) || [])]
console.log('strokes sample:', strokes.slice(0, 20).join('\n'))
const fills = [...new Set(s.match(/fill="[^"]+"/g) || [])]
console.log('fills sample:', fills.slice(0, 20).join('\n'))
