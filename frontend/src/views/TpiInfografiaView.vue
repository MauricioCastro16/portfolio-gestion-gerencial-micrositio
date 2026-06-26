<script setup lang="ts">
import Panzoom from '@panzoom/panzoom'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const INFOGRAFIA_SRC = '/tpi/infografia-tpi.png'

const viewportRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)

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

  const image = imageRef.value
  const viewport = viewportRef.value
  if (!image || !viewport) return

  panzoomInstance = Panzoom(image, {
    maxScale: 8,
    minScale: 1,
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

onBeforeUnmount(() => {
  destroyPanzoom()
})
</script>

<template>
  <main class="desafio-page tpi-infografia-page">
    <article class="desafio-page__inner tpi-infografia-page__inner">
      <header class="desafio-page__header tpi-infografia-page__header">
        <RouterLink class="desafio-page__back" :to="{ name: 'home', hash: '#tpi' }">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          Volver al TPI
        </RouterLink>
        <h1 class="tpi-infografia-page__title">Infografía TPI - Factory Gym</h1>
      </header>

      <div
        ref="viewportRef"
        class="tpi-infografia-page__viewport"
        aria-label="Área de la infografía con zoom y desplazamiento"
      >
        <img
          ref="imageRef"
          class="tpi-infografia-page__image"
          :src="INFOGRAFIA_SRC"
          alt="Infografía del TPI sobre la transformación digital de Factory Gym"
          decoding="async"
          @load="setupPanzoom"
        />
      </div>

      <div
        class="mapa-panzoom-toolbar tpi-infografia-page__toolbar"
        role="toolbar"
        aria-label="Controles de la infografía"
      >
        <span class="mapa-panzoom-hint">
          Arrastrá para mover · Rueda del mouse o pellizco para zoom · Reset para volver al inicio
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
