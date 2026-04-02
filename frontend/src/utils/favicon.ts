/**
 * Safari (macOS/iOS) suele ignorar o cachear mal un único <link rel="icon"> PNG.
 * Refuerzo: shortcut icon + apple-touch-icon, URL con BASE_URL (subrutas) y query de versión.
 */
const ICON_FILE = 'logo.png'
/** Incrementar si Safari sigue mostrando un favicon viejo (caché agresiva). */
const CACHE_BUSTER = '2'

function publicAssetUrl(file: string): string {
  const base = import.meta.env.BASE_URL
  const prefix = base === '/' ? '' : base.replace(/\/$/, '')
  const path = file.replace(/^\//, '')
  const pathOnly = `${prefix}/${path}`.replace(/\/{2,}/g, '/')
  return `${pathOnly}?v=${CACHE_BUSTER}`
}

function findLinkByRel(head: HTMLHeadElement, rel: string): HTMLLinkElement | null {
  const found = Array.from(head.querySelectorAll('link')).find(
    (n) => n.getAttribute('rel') === rel,
  )
  return found instanceof HTMLLinkElement ? found : null
}

function upsertLink(
  head: HTMLHeadElement,
  rel: string,
  href: string,
  attrs: Record<string, string>,
): void {
  let link = findLinkByRel(head, rel)
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', rel)
    head.appendChild(link)
  }
  link.href = href
  for (const [k, v] of Object.entries(attrs)) {
    link.setAttribute(k, v)
  }
}

export function installFavicons(): void {
  if (typeof document === 'undefined') return
  const href = publicAssetUrl(ICON_FILE)
  const head = document.head

  upsertLink(head, 'icon', href, {
    type: 'image/png',
    sizes: '32x32',
  })
  upsertLink(head, 'shortcut icon', href, {
    type: 'image/png',
  })
  upsertLink(head, 'apple-touch-icon', href, {
    type: 'image/png',
  })
}
