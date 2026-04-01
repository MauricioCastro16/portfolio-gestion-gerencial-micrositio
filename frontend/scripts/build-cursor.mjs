import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PNG } from 'pngjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../..')
const SRC = path.join(repoRoot, 'media', 'iconocursor-source.png')
const OUT = path.join(repoRoot, 'media', 'iconocursor.png')
const OUT_SIZE = 32
const PAD = 2

function isBackground(r, g, b, a) {
  if (a < 16) return true
  return r > 248 && g > 248 && b > 248
}

const buf = fs.readFileSync(SRC)
const src = PNG.sync.read(buf)
const { width: W, height: H, data } = src

let minX = W,
  minY = H,
  maxX = -1,
  maxY = -1
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (W * y + x) << 2
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2],
      a = data[i + 3]
    if (!isBackground(r, g, b, a)) {
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }
}

if (maxX < minX) {
  minX = 0
  minY = 0
  maxX = W - 1
  maxY = H - 1
}

minX = Math.max(0, minX - PAD)
minY = Math.max(0, minY - PAD)
maxX = Math.min(W - 1, maxX + PAD)
maxY = Math.min(H - 1, maxY + PAD)

const cw = maxX - minX + 1
const ch = maxY - minY + 1

const dst = new PNG({ width: OUT_SIZE, height: OUT_SIZE, colorType: 6 })
for (let y = 0; y < OUT_SIZE; y++) {
  for (let x = 0; x < OUT_SIZE; x++) {
    const sx = minX + Math.floor((x / (OUT_SIZE - 1 || 1)) * (cw - 1 || 0))
    const sy = minY + Math.floor((y / (OUT_SIZE - 1 || 1)) * (ch - 1 || 0))
    const si = (W * sy + sx) << 2
    const di = (OUT_SIZE * y + x) << 2
    let r = data[si],
      g = data[si + 1],
      b = data[si + 2],
      a = data[si + 3] ?? 255
    if (isBackground(r, g, b, a)) {
      r = g = b = a = 0
    }
    dst.data[di] = r
    dst.data[di + 1] = g
    dst.data[di + 2] = b
    dst.data[di + 3] = a
  }
}

fs.writeFileSync(OUT, PNG.sync.write(dst))
console.log('Wrote', OUT, `(${OUT_SIZE}x${OUT_SIZE}) from crop ${cw}x${ch}`)
