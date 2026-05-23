import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const svgPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../media/desafios/ishikawa-bagit.svg',
)
const s = fs.readFileSync(svgPath, 'utf8')
const i = s.indexOf('>Métodos</div>')
console.log(s.slice(i - 280, i + 80))
console.log('inline bad style fill', (s.match(/style="fill: #241838/g) || []).length)
console.log('fill #432e8c', (s.match(/fill="#432e8c"/g) || []).length)
console.log('white text in categories', (s.match(/color: #ffffff;[^>]*font-weight: bold/g) || []).length)
console.log('images', (s.match(/<image /g) || []).length)
