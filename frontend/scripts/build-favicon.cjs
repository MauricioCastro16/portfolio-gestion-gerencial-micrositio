/**
 * Regenera favicon.ico (16/32/48) y, desde media/logo.png, favicon-64.png y apple-touch-icon.png.
 * Redimensionado vecino más cercano (pixel art) con pngjs — sin dependencias nativas extra.
 */
const fs = require('fs')
const path = require('path')
const toIco = require('to-ico')
const { PNG } = require('pngjs')

const media = path.resolve(__dirname, '../../media')
const logo = path.join(media, 'logo.png')
const icoOut = path.join(media, 'favicon.ico')
const favicon64Out = path.join(media, 'favicon-64.png')
const appleTouchOut = path.join(media, 'apple-touch-icon.png')

/**
 * @param {import('pngjs').PNG} input
 * @param {number} targetW
 * @param {number} targetH
 */
function resizeNearest(input, targetW, targetH) {
  const output = new PNG({ width: targetW, height: targetH })
  const sw = input.width
  const sh = input.height
  for (let y = 0; y < targetH; y++) {
    for (let x = 0; x < targetW; x++) {
      const sx = Math.min(Math.floor((x * sw) / targetW), sw - 1)
      const sy = Math.min(Math.floor((y * sh) / targetH), sh - 1)
      const si = (sy * sw + sx) * 4
      const oi = (y * targetW + x) * 4
      output.data[oi] = input.data[si]
      output.data[oi + 1] = input.data[si + 1]
      output.data[oi + 2] = input.data[si + 2]
      output.data[oi + 3] = input.data[si + 3]
    }
  }
  return output
}

async function main() {
  if (!fs.existsSync(logo)) {
    throw new Error(`Missing source logo: ${logo}`)
  }

  const buf = await toIco([fs.readFileSync(logo)], {
    resize: true,
    sizes: [16, 32, 48],
  })
  fs.writeFileSync(icoOut, buf)
  console.log('Wrote', icoOut, `(${buf.length} bytes)`)

  const input = PNG.sync.read(fs.readFileSync(logo))
  fs.writeFileSync(favicon64Out, PNG.sync.write(resizeNearest(input, 64, 64)))
  console.log('Wrote', favicon64Out)
  fs.writeFileSync(appleTouchOut, PNG.sync.write(resizeNearest(input, 180, 180)))
  console.log('Wrote', appleTouchOut)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
