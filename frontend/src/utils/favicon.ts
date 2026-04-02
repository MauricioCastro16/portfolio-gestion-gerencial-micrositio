import faviconAssetUrl from '../assets/logo.png?url'

/** Mismo logo que el hero: en build queda en /assets/logo-[hash].png (Vercel/Safari). */

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
  const href = faviconAssetUrl
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
