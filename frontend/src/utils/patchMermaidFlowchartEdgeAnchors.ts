import { curveStepBefore, line } from 'd3-shape'

type Pt = { x: number; y: number }

/** `flowchart-op_0-12` → `op_0` (evita regex ambigua con varios guiones). */
function logicalIdFromDomId(domId: string): string | null {
  if (!domId.startsWith('flowchart-')) return null
  const rest = domId.slice('flowchart-'.length)
  const lastDash = rest.lastIndexOf('-')
  if (lastDash <= 0) return null
  const suffix = rest.slice(lastDash + 1)
  if (!/^\d+$/.test(suffix)) return null
  return rest.slice(0, lastDash)
}

/** `L_${from}_${to}_${counter}` */
function parseEdgeEndpoints(edgeId: string, nodeIds: Set<string>): { from: string; to: string } | null {
  if (!edgeId.startsWith('L_')) return null
  const body = edgeId.slice(2)
  const lastUnderscore = body.lastIndexOf('_')
  if (lastUnderscore <= 0) return null
  const counterStr = body.slice(lastUnderscore + 1)
  if (!/^\d+$/.test(counterStr)) return null
  const withoutCounter = body.slice(0, lastUnderscore)
  const sorted = [...nodeIds].sort((a, b) => b.length - a.length)
  for (const from of sorted) {
    if (!withoutCounter.startsWith(`${from}_`)) continue
    const to = withoutCounter.slice(from.length + 1)
    if (nodeIds.has(to)) return { from, to }
  }
  return null
}

function buildNodeElementByLogicalId(svg: SVGSVGElement): Map<string, SVGGElement> {
  const map = new Map<string, SVGGElement>()
  for (const g of svg.querySelectorAll<SVGGElement>('g.node')) {
    if (g.closest('defs') || g.classList.contains('cluster')) continue
    const dataId = g.getAttribute('data-id')
    if (dataId) {
      map.set(dataId, g)
      continue
    }
    const domId = g.getAttribute('id') ?? ''
    const lid = logicalIdFromDomId(domId)
    if (lid) map.set(lid, g)
  }
  return map
}

/**
 * Salida: centro inferior del padre. Entrada: centro superior del hijo.
 * Tramos: bajar → horizontal → bajar; el último tramo es vertical hacia abajo (punta de flecha hacia abajo).
 */
function orthoTbPoints(sourceBottomCenter: Pt, targetTopCenter: Pt, eps = 2): Pt[] {
  const { x: x1, y: y1 } = sourceBottomCenter
  const { x: x2, y: y2 } = targetTopCenter

  if (y2 <= y1 + eps) {
    return Math.abs(x1 - x2) < eps ? [{ x: x1, y: y1 }, { x: x2, y: y2 }] : [{ x: x1, y: y1 }, { x: x1, y: y2 }, { x: x2, y: y2 }]
  }

  if (Math.abs(x1 - x2) < eps) {
    return [
      { x: x1, y: y1 },
      { x: x2, y: y2 },
    ]
  }

  const midY = (y1 + y2) / 2
  return [
    { x: x1, y: y1 },
    { x: x1, y: midY },
    { x: x2, y: midY },
    { x: x2, y: y2 },
  ]
}

const lineStepBefore = line<Pt>()
  .x((d) => d.x)
  .y((d) => d.y)
  .curve(curveStepBefore)

function collectEdgePaths(svg: SVGSVGElement): SVGPathElement[] {
  const links = [...svg.querySelectorAll<SVGPathElement>('path.flowchart-link')].filter((p) => !p.closest('defs'))
  if (links.length > 0) return links
  const byEt = [...svg.querySelectorAll<SVGPathElement>('path[data-et="edge"]')].filter((p) => !p.closest('defs'))
  if (byEt.length > 0) return byEt
  return [...svg.querySelectorAll<SVGPathElement>('path.edge-thickness-normal, path.edge-thickness-thick')].filter(
    (p) => !p.closest('defs'),
  )
}

function edgeKeyFromPath(pathEl: SVGPathElement): string {
  return (
    pathEl.getAttribute('data-id') ??
    (() => {
      const full = pathEl.getAttribute('id') ?? ''
      const i = full.indexOf('L_')
      return i >= 0 ? full.slice(i) : ''
    })()
  )
}

/**
 * Redibuja aristas TB: salen del **centro inferior** del nodo origen y llegan al **centro superior**
 * del destino, con esquinas a 90°. El último tramo es vertical descendente → la punta apunta hacia abajo.
 */
export function patchFlowchartEdgesExitBottomCenter(svg: SVGSVGElement): void {
  const nodeById = buildNodeElementByLogicalId(svg)
  const nodeIds = new Set(nodeById.keys())
  if (nodeIds.size === 0) return

  const paths = collectEdgePaths(svg)

  for (const pathEl of paths) {
    const cls = pathEl.getAttribute('class') ?? ''
    if (cls.includes('edge-thickness-invisible')) continue

    const edgeKey = edgeKeyFromPath(pathEl)
    if (!edgeKey) continue

    const ends = parseEdgeEndpoints(edgeKey, nodeIds)
    if (!ends) continue

    const srcEl = nodeById.get(ends.from)
    const tgtEl = nodeById.get(ends.to)
    if (!srcEl || !tgtEl) continue

    const sb = srcEl.getBBox()
    const tb = tgtEl.getBBox()
    const start: Pt = { x: sb.x + sb.width / 2, y: sb.y + sb.height }
    const end: Pt = { x: tb.x + tb.width / 2, y: tb.y }

    const next = orthoTbPoints(start, end)
    const d = lineStepBefore(next)
    if (d) {
      pathEl.setAttribute('d', d)
      pathEl.setAttribute('data-points', btoa(JSON.stringify(next)))
    }
  }
}
