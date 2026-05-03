<script setup lang="ts">
import Panzoom from '@panzoom/panzoom'
import mermaid from 'mermaid'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { getMapaConceptual } from '../mapaConceptual'
import { patchFlowchartEdgesExitBottomCenter } from '../utils/patchMermaidFlowchartEdgeAnchors'

const props = defineProps<{
  nivelId: string
}>()

const config = computed(() => getMapaConceptual(props.nivelId))

const viewportRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const renderError = ref<string | null>(null)

/** Panzoom sobre la escena del diagrama */
let panzoomInstance: ReturnType<typeof Panzoom> | null = null
let wheelHandler: ((e: WheelEvent) => void) | null = null

async function ensureMermaid(): Promise<void> {
  // Se llama en cada render: `strict` elimina data-id/data-points con DOMPurify y el parche de aristas deja de funcionar.
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'neutral',
    themeVariables: {
      fontSize: '18px',
      fontWeight: 'bold',
    },
    flowchart: { htmlLabels: true, curve: 'stepBefore' },
  })
}

function destroyPanzoom(): void {
  if (wheelHandler && viewportRef.value) {
    viewportRef.value.removeEventListener('wheel', wheelHandler)
    wheelHandler = null
  }
  panzoomInstance?.destroy()
  panzoomInstance = null
}

function findRootNodeGroup(svg: SVGSVGElement): SVGGraphicsElement | null {
  const depth0 = svg.querySelector('g.depth0') as SVGGraphicsElement | null
  if (depth0) return depth0
  return (
    (svg.querySelector('g.rootOp') as SVGGraphicsElement | null) ??
    (svg.querySelector('g.rootTa') as SVGGraphicsElement | null) ??
    (svg.querySelector('g.rootGe') as SVGGraphicsElement | null) ??
    (svg.querySelector('g.node') as SVGGraphicsElement | null)
  )
}

/**
 * Centra el nodo raíz en el viewport.
 * `preserveZoom`: si es true (botón Raíz), solo desplaza sin cambiar la escala.
 */
function frameRootNode(options: { preserveZoom: boolean } = { preserveZoom: false }): void {
  const viewport = viewportRef.value
  const scene = sceneRef.value
  const svg = scene?.querySelector('svg')
  if (!panzoomInstance || !viewport || !svg) return

  const root = findRootNodeGroup(svg)
  if (!root) return

  const { preserveZoom } = options

  const attempt = (tryIdx: number): void => {
    const vr = viewport.getBoundingClientRect()
    if (vr.width < 2 || vr.height < 2) {
      if (tryIdx < 8) setTimeout(() => attempt(tryIdx + 1), 75)
      return
    }

    if (!preserveZoom) {
      panzoomInstance!.reset({ animate: false })

      const rr = root.getBoundingClientRect()
      const w = Math.max(rr.width, 1)
      const h = Math.max(rr.height, 1)

      if ((rr.width < 1 || rr.height < 1) && tryIdx < 12) {
        setTimeout(() => attempt(tryIdx + 1), 75)
        return
      }

      const pad = 48
      const scale = Math.min(
        (vr.width - 2 * pad) / w,
        (vr.height - 2 * pad) / h,
        2.8,
      )
      const s = Math.min(Math.max(scale, 0.12), 3)
      if (!Number.isFinite(s) || s <= 0) {
        panzoomInstance!.zoom(0.45, { animate: false })
      } else {
        panzoomInstance!.zoom(s, { animate: false })
      }
    } else if ((root.getBoundingClientRect().width < 1 || root.getBoundingClientRect().height < 1) && tryIdx < 12) {
      setTimeout(() => attempt(tryIdx + 1), 75)
      return
    }

    // Panzoom traduce el arrastre como deltaPantalla/scale; el encuadre debe hacer lo mismo.
    // El transform del zoom se aplica en un rAF interno: medir en el siguiente frame (o dos).
    const applyPanToCenter = (): void => {
      const panzoom = panzoomInstance!
      const sc = panzoom.getScale()
      const rr2 = root.getBoundingClientRect()
      const vr2 = viewport.getBoundingClientRect()
      const dx = vr2.left + vr2.width / 2 - (rr2.left + rr2.width / 2)
      const dy = vr2.top + vr2.height / 2 - (rr2.top + rr2.height / 2)
      if (!Number.isFinite(dx) || !Number.isFinite(dy) || !Number.isFinite(sc) || sc <= 0) return
      const pan = panzoom.getPan()
      panzoom.pan(pan.x + dx / sc, pan.y + dy / sc)
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(applyPanToCenter)
    })
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => attempt(0))
  })
}

function setupPanzoom(): void {
  destroyPanzoom()
  const scene = sceneRef.value
  const viewport = viewportRef.value
  if (!scene || !viewport) return

  panzoomInstance = Panzoom(scene, {
    maxScale: 40,
    minScale: 0.03,
    canvas: true,
    cursor: 'grab',
  })

  wheelHandler = panzoomInstance.zoomWithWheel
  viewport.addEventListener('wheel', wheelHandler, { passive: false })

  frameRootNode()
}

function onZoomIn(): void {
  panzoomInstance?.zoomIn()
}

function onZoomOut(): void {
  panzoomInstance?.zoomOut()
}

function onResetRootView(): void {
  frameRootNode({ preserveZoom: true })
}

let renderSeq = 0

async function renderDiagram(): Promise<void> {
  await nextTick()
  renderError.value = null
  const cfg = getMapaConceptual(props.nivelId)
  const scene = sceneRef.value
  if (!cfg || !scene) return

  const seq = ++renderSeq
  destroyPanzoom()
  scene.innerHTML = ''

  try {
    await ensureMermaid()
    const id = `mermaid-map-${props.nivelId}-${seq}`
    const { svg } = await mermaid.render(id, cfg.mermaid.trim())
    if (seq !== renderSeq) return
    scene.innerHTML = svg
    const svgEl = scene.querySelector('svg')
    if (svgEl instanceof SVGSVGElement) {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            patchFlowchartEdgesExitBottomCenter(svgEl)
            resolve()
          })
        })
      })
    }
    await nextTick()
    if (seq !== renderSeq) return
    setupPanzoom()
  } catch (e) {
    if (seq !== renderSeq) return
    renderError.value = e instanceof Error ? e.message : String(e)
  }
}

onMounted(() => {
  void renderDiagram()
})

watch(
  () => props.nivelId,
  () => {
    void renderDiagram()
  },
)

onBeforeUnmount(() => {
  renderSeq++
  destroyPanzoom()
  sceneRef.value?.replaceChildren()
})
</script>

<template>
  <main class="mapa-page">
    <div v-if="!config" class="mapa-page__inner mapa-page__inner--narrow">
      <p class="mapa-page__muted">No hay un mapa con ese identificador.</p>
      <RouterLink class="mapa-page__link-home" :to="{ name: 'home' }">Volver al inicio</RouterLink>
    </div>

    <article v-else class="mapa-page__inner">
      <header class="mapa-page__header">
        <RouterLink class="mapa-page__back" :to="{ name: 'home', hash: '#mapa-conceptual' }">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          Volver al mapa
        </RouterLink>
        <h1 class="mapa-page__title">{{ config.titulo }}</h1>
      </header>

      <p v-if="renderError" class="mapa-page__diagram-error" role="alert">
        No se pudo renderizar el diagrama: {{ renderError }}
      </p>

      <div v-else class="mapa-diagram-stack">
        <div ref="viewportRef" class="mapa-panzoom-viewport" aria-label="Área del diagrama con zoom y desplazamiento">
          <div ref="sceneRef" class="mapa-panzoom-scene" />
        </div>

        <div class="mapa-panzoom-toolbar" role="toolbar" aria-label="Controles del diagrama">
          <span class="mapa-panzoom-hint">
            Arrastrá para mover · Rueda del mouse para zoom · Botones para acercar o volver al inicio
          </span>
          <div class="mapa-panzoom-actions">
            <button type="button" class="mapa-panzoom-btn" title="Alejar" aria-label="Alejar" @click="onZoomOut">
              <i class="fa-solid fa-minus" aria-hidden="true"></i>
            </button>
            <button type="button" class="mapa-panzoom-btn" title="Acercar" aria-label="Acercar" @click="onZoomIn">
              <i class="fa-solid fa-plus" aria-hidden="true"></i>
            </button>
            <button
              type="button"
              class="mapa-panzoom-btn mapa-panzoom-btn--primary"
              title="Centrar el nodo raíz sin cambiar el zoom"
              aria-label="Centrar el nodo raíz sin cambiar el zoom"
              @click="onResetRootView"
            >
              <i class="fa-solid fa-crosshairs" aria-hidden="true"></i>
              Raíz
            </button>
          </div>
        </div>
      </div>
    </article>
  </main>
</template>
