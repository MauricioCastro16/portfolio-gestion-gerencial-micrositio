import fs from 'node:fs'

const html = fs.readFileSync('c:/Users/castr/Desktop/Ishikawa.drawio.html', 'utf8')
const m = html.match(/content="([^"]+)"/)
if (!m) {
  console.error('No content attribute')
  process.exit(1)
}
const xml = m[1]
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#10;/g, '\n')
  .replace(/&amp;/g, '&')

const vals = [...xml.matchAll(/value="([^"]*)"/g)]
  .map((x) => x[1])
  .filter((v) => v.length > 2 && !v.startsWith('html=1') && !v.startsWith('rounded='))

console.log(vals.join('\n'))
