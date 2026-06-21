<script setup lang="ts">
import Panzoom from '@panzoom/panzoom'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { getMapaConceptual } from '../mapaConceptual'

const props = defineProps<{
  nivelId: string
}>()

const mapaDrawioSrcByNivel: Record<string, string> = {
  'nivel-operativo': '/mapa/operativo.html',
  'nivel-tactico': '/mapa/tactico.html',
  'nivel-gerencial': '/mapa/estrategico.html',
}

const config = computed(() => getMapaConceptual(props.nivelId))
const mapaDrawioSrc = computed(() => mapaDrawioSrcByNivel[props.nivelId])

const viewportRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)

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

async function setupPanzoom(): Promise<void> {
  destroyPanzoom()
  await nextTick()

  const scene = sceneRef.value
  const viewport = viewportRef.value
  if (!scene || !viewport) return

  panzoomInstance = Panzoom(scene, {
    maxScale: 8,
    minScale: 0.5,
    canvas: true,
    cursor: 'grab',
  })

  wheelHandler = panzoomInstance.zoomWithWheel
  viewport.addEventListener('wheel', wheelHandler, { passive: false })
}

function onZoomIn(): void {
  panzoomInstance?.zoomIn()
}

function onZoomOut(): void {
  panzoomInstance?.zoomOut()
}

function onResetView(): void {
  panzoomInstance?.reset({ animate: true })
}

onMounted(() => {
  void setupPanzoom()
})

watch(mapaDrawioSrc, () => {
  void setupPanzoom()
})

onBeforeUnmount(() => {
  destroyPanzoom()
})
</script>

<template>
  <main class="mapa-page mapa-page--drawio">
    <div v-if="!config || !mapaDrawioSrc" class="mapa-page__inner mapa-page__inner--narrow">
      <p class="mapa-page__muted">No hay un mapa con ese identificador.</p>
      <RouterLink class="mapa-page__link-home" :to="{ name: 'home' }">Volver al inicio</RouterLink>
    </div>

    <article v-else class="mapa-page__inner mapa-page__inner--wide">
      <header class="mapa-page__header">
        <RouterLink class="mapa-page__back" :to="{ name: 'home', hash: '#mapa-conceptual' }">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          Volver al mapa
        </RouterLink>
        <h1 class="mapa-page__title">{{ config.titulo }}</h1>
      </header>

      <div
        ref="viewportRef"
        class="mapa-drawio-page"
        aria-label="Área del mapa conceptual con zoom y desplazamiento"
      >
        <div ref="sceneRef" class="mapa-drawio-page__scene">
          <iframe
            class="mapa-drawio-page__iframe"
            :title="`Mapa conceptual navegable: ${config.titulo}`"
            :src="mapaDrawioSrc"
            scrolling="no"
          />
        </div>
      </div>

      <div class="mapa-panzoom-toolbar" role="toolbar" aria-label="Controles del mapa conceptual">
        <span class="mapa-panzoom-hint">
          Arrastrá para mover · Rueda del mouse para zoom · Reset para volver al inicio
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
            title="Restablecer vista"
            aria-label="Restablecer vista"
            @click="onResetView"
          >
            <i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i>
            Reset
          </button>
        </div>
      </div>
    </article>
  </main>
</template>
