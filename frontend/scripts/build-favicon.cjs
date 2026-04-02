/**
 * Regenera favicon.ico (16/32/48) desde media/logo.png.
 * En macOS también actualiza favicon-64.png y apple-touch-icon.png vía sips.
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const toIco = require('to-ico')

const media = path.resolve(__dirname, '../../media')
const logo = path.join(media, 'logo.png')
const icoOut = path.join(media, 'favicon.ico')

async function main() {
  const buf = await toIco([fs.readFileSync(logo)], {
    resize: true,
    sizes: [16, 32, 48],
  })
  fs.writeFileSync(icoOut, buf)
  console.log('Wrote', icoOut, `(${buf.length} bytes)`)

  if (process.platform === 'darwin') {
    execSync(`sips -z 64 64 "${logo}" --out "${path.join(media, 'favicon-64.png')}"`, {
      stdio: 'inherit',
    })
    execSync(`sips -z 180 180 "${logo}" --out "${path.join(media, 'apple-touch-icon.png')}"`, {
      stdio: 'inherit',
    })
    console.log('Updated favicon-64.png and apple-touch-icon.png (sips)')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
