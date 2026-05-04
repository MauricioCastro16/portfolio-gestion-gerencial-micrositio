<script setup lang="ts">
import ELK from 'elkjs/lib/elk.bundled.js'
import type { ElkExtendedEdge, ElkNode } from 'elkjs'
import { computed, nextTick, shallowRef, useId, watch } from 'vue'
import type { MapaElkGraph, MapaElkTheme } from '../mapaConceptual/elkTypes'

const props = defineProps<{
  graph: MapaElkGraph
}>()

const emit = defineEmits<{
  ready: []
  'layout-error': [message: string]
}>()

const layoutRoot = shallowRef<ElkNode | null>(null)
const elk = new ELK()
const idBase = useId().replace(/[^a-zA-Z0-9_-]/g, '_')
const arrowMarkerId = `${idBase}-arrow`

const metaById = computed(() => {
  const m = new Map<string, { label: string; depth: number }>()
  for (const n of props.graph.nodes) m.set(n.id, { label: n.label, depth: n.depth })
  return m
})

const theme = computed<MapaElkTheme>(() => props.graph.theme ?? 'operativo')

/** Degradé en profundidad: marca #432e8c (--brand-purple) → violetas más claros */
const depthPaletteOperativo: { fill: string; stroke: string; text: string }[] = [
  { fill: '#432e8c', stroke: '#2d2060', text: '#ffffff' },
  { fill: '#4e379f', stroke: '#362870', text: '#ffffff' },
  { fill: '#5d45b2', stroke: '#40307e', text: '#ffffff' },
  { fill: '#6f58c2', stroke: '#4d3a8f', text: '#ffffff' },
  { fill: '#856fd0', stroke: '#5c4898', text: '#ffffff' },
  { fill: '#a48fe0', stroke: '#7560a8', text: '#160d28' },
  { fill: '#c4b2ee', stroke: '#9480bf', text: '#160d28' },
  { fill: '#e2daf8', stroke: '#b4a6d8', text: '#160d28' },
]

const operativoEdgeStroke = '#5a4a85'
const defaultEdgeStroke = '#5a4d78'

function nodeColors(depth: number): { fill: string; stroke: string; text: string } {
  const t = theme.value
  if (t === 'tactico' && depth === 0) return { fill: '#7a1e2e', stroke: '#5a1522', text: '#ffffff' }
  if (t === 'gerencial' && depth === 0) return { fill: '#b8860b', stroke: '#8a6508', text: '#1a1610' }
  const i = Math.min(Math.max(depth, 0), 7)
  return depthPaletteOperativo[i]
}

const edgeStroke = computed(() => (theme.value === 'operativo' ? operativoEdgeStroke : defaultEdgeStroke))

function estimateNodeSize(label: string): { width: number; height: number } {
  const width = Math.min(480, Math.max(88, Math.ceil(label.length * 6.2 + 28)))
  const charsPerLine = 44
  const lines = Math.max(1, Math.ceil(label.length / charsPerLine))
  const height = Math.max(38, 14 + lines * 22)
  return { width, height }
}

function edgePathD(edge: ElkExtendedEdge): string {
  if (!edge.sections?.length) return ''
  const chunks: string[] = []
  for (const sec of edge.sections) {
    const pts = [sec.startPoint, ...(sec.bendPoints ?? []), sec.endPoint].filter(
      (p): p is { x: number; y: number } => !!p && typeof p.x === 'number' && typeof p.y === 'number',
    )
    if (pts.length === 0) continue
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 1; i < pts.length; i++) d += ` L ${pts[i].x} ${pts[i].y}`
    chunks.push(d)
  }
  return chunks.join(' ')
}

const layoutNodes = computed(() => {
  const r = layoutRoot.value
  const ch = r?.children
  if (!ch) return [] as ElkNode[]
  return ch.filter((c): c is ElkNode => !!(c.id && c.width != null && c.height != null))
})

const layoutEdges = computed(() => {
  const e = layoutRoot.value?.edges
  return (e ?? []) as ElkExtendedEdge[]
})

async function runLayout(): Promise<void> {
  layoutRoot.value = null
  const g = props.graph
  const children: ElkNode[] = g.nodes.map((n) => {
    const { width, height } = estimateNodeSize(n.label)
    return { id: n.id, width, height }
  })

  const edges: ElkExtendedEdge[] = g.edges.map((e) => ({
    id: e.id,
    sources: [e.source],
    targets: [e.target],
  }))

  const graph: ElkNode = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.spacing.nodeNode': '26',
      'elk.layered.spacing.nodeNodeBetweenLayers': '44',
      'elk.edgeRouting': 'ORTHOGONAL',
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
      'elk.padding': '[top=22,left=22,bottom=22,right=22]',
    },
    children,
    edges,
  }

  try {
    const laid = await elk.layout(graph)
    layoutRoot.value = laid
    await nextTick()
    emit('ready')
  } catch (e) {
    emit('layout-error', e instanceof Error ? e.message : String(e))
  }
}

watch(
  () => props.graph,
  () => {
    void runLayout()
  },
  { deep: true },
)

void runLayout()
</script>

<template>
  <svg
    v-if="layoutRoot && layoutRoot.width != null && layoutRoot.height != null"
    xmlns="http://www.w3.org/2000/svg"
    :width="layoutRoot.width"
    :height="layoutRoot.height"
    class="mapa-elk-svg"
    role="img"
    :aria-label="`Mapa conceptual (${graph.nodes.length} nodos)`"
  >
    <defs>
      <marker
        :id="arrowMarkerId"
        markerWidth="12"
        markerHeight="12"
        refX="10"
        refY="6"
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <path d="M2,2 L10,6 L2,10 Z" :fill="edgeStroke" stroke="none" />
      </marker>
    </defs>

    <rect x="0" y="0" :width="layoutRoot.width" :height="layoutRoot.height" fill="#ffffff" />

    <g class="mapa-elk-edges">
      <path
        v-for="edge in layoutEdges"
        :key="edge.id"
        class="mapa-elk-edge"
        fill="none"
        :stroke="edgeStroke"
        stroke-width="2"
        stroke-linejoin="round"
        stroke-linecap="round"
        :d="edgePathD(edge)"
        :marker-end="`url(#${arrowMarkerId})`"
      />
    </g>

    <g class="mapa-elk-nodes">
      <g
        v-for="node in layoutNodes"
        :key="node.id"
        class="mapa-elk-node"
        :class="{ 'mapa-elk-node--root': node.id === graph.rootId }"
        :transform="`translate(${node.x ?? 0},${node.y ?? 0})`"
      >
        <rect
          :width="node.width"
          :height="node.height"
          rx="10"
          ry="10"
          :fill="nodeColors(metaById.get(node.id!)?.depth ?? 0).fill"
          :stroke="nodeColors(metaById.get(node.id!)?.depth ?? 0).stroke"
          stroke-width="1.5"
        />
        <foreignObject :width="node.width" :height="node.height">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            class="mapa-elk-node-label"
            :style="{ color: nodeColors(metaById.get(node.id!)?.depth ?? 0).text }"
          >
            {{ metaById.get(node.id!)?.label ?? node.id }}
          </div>
        </foreignObject>
      </g>
    </g>
  </svg>
</template>

<style scoped>
.mapa-elk-svg {
  display: block;
  max-width: none;
  height: auto;
}

.mapa-elk-node-label {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.35rem 0.5rem;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;
  overflow: visible;
  word-break: break-word;
  hyphens: auto;
}
</style>
