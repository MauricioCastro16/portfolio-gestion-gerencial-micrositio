<script setup lang="ts">
import Panzoom from '@panzoom/panzoom'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import MapaElkDiagram from '../components/MapaElkDiagram.vue'
import { getMapaConceptual } from '../mapaConceptual'
import type { MapaElkGraph } from '../mapaConceptual/elkTypes'

const props = defineProps<{
  nivelId: string
}>()

const config = computed(() => getMapaConceptual(props.nivelId))

const operativoUnidadesTabs = computed(() => config.value?.operativoUnidades)

/** Pestaña activa del mapa operativo (unidad 1 / 2 / 3). */
const selectedOperativoUnidadId = ref('unidad-1')

const currentGraph = computed((): MapaElkGraph | null => {
  const cfg = getMapaConceptual(props.nivelId)
  if (!cfg) return null
  const tabs = cfg.operativoUnidades
  if (tabs?.length && props.nivelId === 'nivel-operativo') {
    const hit = tabs.find((t) => t.id === selectedOperativoUnidadId.value)
    return (hit ?? tabs[0]).graph
  }
  return cfg.graph
})

const diagramKey = computed(
  () => `${props.nivelId}-${props.nivelId === 'nivel-operativo' ? selectedOperativoUnidadId.value : ''}`,
)

const viewportRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const renderError = ref<string | null>(null)

/** Panzoom sobre la escena del diagrama */
let panzoomInstance: ReturnType<typeof Panzoom> | null = null
let wheelHandler: ((e: WheelEvent) => void) | null = null

function destroyPanzoom(): void {
  if (wheelHandler && viewportRef.value) {
    viewportRef.value.removeEventListener('wheel', wheelHandler)
    wheelHandler = null
  }
  panzoomInstance?.destroy()
  panzoomInstance = null
}

function findRootNodeGroup(svg: SVGSVGElement): SVGGraphicsElement | null {
  const elkRoot = svg.querySelector('g.mapa-elk-node--root') as SVGGraphicsElement | null
  if (elkRoot) return elkRoot
  return svg.querySelector('g.mapa-elk-node') as SVGGraphicsElement | null
}

/**
 * Centra el nodo raíz en el viewport.
 * `preserveZoom`: si es true (botón Raíz), solo desplaza sin cambiar la escala.
 */
function frameRootNode(options: { preserveZoom: boolean } = { preserveZoom: false }): void {
  if (!panzoomInstance) return

  const { preserveZoom } = options

  const attempt = (tryIdx: number): void => {
    const pz = panzoomInstance
    const viewport = viewportRef.value
    const scene = sceneRef.value
    const svg = scene?.querySelector('svg')
    if (!pz || !viewport || !svg || !(svg instanceof SVGSVGElement)) return

    const root = findRootNodeGroup(svg)
    if (!root) return

    const vr = viewport.getBoundingClientRect()
    if (vr.width < 2 || vr.height < 2) {
      if (tryIdx < 8) setTimeout(() => attempt(tryIdx + 1), 75)
      return
    }

    if (!preserveZoom) {
      pz.reset({ animate: false })

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
      if (!panzoomInstance) return
      if (!Number.isFinite(s) || s <= 0) {
        panzoomInstance.zoom(0.45, { animate: false })
      } else {
        panzoomInstance.zoom(s, { animate: false })
      }
    } else if ((root.getBoundingClientRect().width < 1 || root.getBoundingClientRect().height < 1) && tryIdx < 12) {
      setTimeout(() => attempt(tryIdx + 1), 75)
      return
    }

    const applyPanToCenter = (): void => {
      const panzoom = panzoomInstance
      const vp = viewportRef.value
      const scn = sceneRef.value
      const svgEl = scn?.querySelector('svg')
      if (!panzoom || !vp || !svgEl || !(svgEl instanceof SVGSVGElement)) return
      const rootEl = findRootNodeGroup(svgEl)
      if (!rootEl) return
      const sc = panzoom.getScale()
      const rr2 = rootEl.getBoundingClientRect()
      const vr2 = vp.getBoundingClientRect()
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

function onElkReady(): void {
  renderError.value = null
  setupPanzoom()
}

function onLayoutError(message: string): void {
  renderError.value = message
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

watch(
  () => props.nivelId,
  (id, prev) => {
    if (id === 'nivel-operativo' && prev !== undefined && prev !== 'nivel-operativo') {
      selectedOperativoUnidadId.value = 'unidad-1'
    }
  },
)

onBeforeUnmount(() => {
  destroyPanzoom()
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
        <div
          v-if="operativoUnidadesTabs?.length"
          class="mapa-operativo-tabs"
          role="tablist"
          aria-label="Unidad del mapa conceptual"
        >
          <button
            v-for="tab in operativoUnidadesTabs"
            :key="tab.id"
            type="button"
            role="tab"
            class="mapa-operativo-tabs__btn"
            :class="{ 'mapa-operativo-tabs__btn--active': selectedOperativoUnidadId === tab.id }"
            :aria-selected="selectedOperativoUnidadId === tab.id"
            @click="selectedOperativoUnidadId = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
      </header>

      <p v-if="renderError" class="mapa-page__diagram-error" role="alert">
        No se pudo calcular el diagrama: {{ renderError }}
      </p>

      <div v-else class="mapa-diagram-stack">
        <div ref="viewportRef" class="mapa-panzoom-viewport" aria-label="Área del diagrama con zoom y desplazamiento">
          <div ref="sceneRef" class="mapa-panzoom-scene">
            <MapaElkDiagram
              v-if="currentGraph"
              :key="diagramKey"
              :graph="currentGraph"
              @ready="onElkReady"
              @layout-error="onLayoutError"
            />
          </div>
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
