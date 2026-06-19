<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

defineProps<{
  src: string
  title: string
}>()

const iframeRef = ref<HTMLIFrameElement | null>(null)
let moveTimer: ReturnType<typeof window.setInterval> | null = null

type MoveVector = {
  x: number
  y: number
}

function iframeDocument(): Document | null {
  try {
    return iframeRef.value?.contentDocument ?? iframeRef.value?.contentWindow?.document ?? null
  } catch {
    return null
  }
}

function injectScrollbarHider(): void {
  const doc = iframeDocument()
  if (!doc?.head || doc.getElementById('gaoniters-drawio-scrollbar-hider')) return

  const style = doc.createElement('style')
  style.id = 'gaoniters-drawio-scrollbar-hider'
  style.textContent = `
    html, body, .geDiagramContainer {
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
    * {
      scrollbar-width: none !important;
    }
    *::-webkit-scrollbar {
      width: 0 !important;
      height: 0 !important;
      display: none !important;
    }
  `
  doc.head.appendChild(style)
}

function scrollableScore(el: Element): number {
  const h = Math.max(0, el.scrollWidth - el.clientWidth)
  const v = Math.max(0, el.scrollHeight - el.clientHeight)
  return h + v
}

function canMove(el: Element, vector: MoveVector): boolean {
  const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth)
  const maxTop = Math.max(0, el.scrollHeight - el.clientHeight)
  const canX = vector.x < 0 ? el.scrollLeft > 0 : vector.x > 0 ? el.scrollLeft < maxLeft : false
  const canY = vector.y < 0 ? el.scrollTop > 0 : vector.y > 0 ? el.scrollTop < maxTop : false
  return canX || canY
}

function findScrollTarget(doc: Document, vector: MoveVector): Element | null {
  const priority = [
    doc.querySelector('.geDiagramContainer'),
    doc.querySelector('.mxgraph'),
    doc.scrollingElement,
    doc.documentElement,
    doc.body,
  ].filter((el): el is Element => !!el)

  const priorityHit = priority.find((el) => scrollableScore(el) > 0 && canMove(el, vector))
  if (priorityHit) return priorityHit

  const scrollable = Array.from(doc.querySelectorAll('body, div, main, section'))
    .filter((el) => scrollableScore(el) > 0)
    .sort((a, b) => scrollableScore(b) - scrollableScore(a))

  return scrollable.find((el) => canMove(el, vector)) ?? scrollable[0] ?? null
}

function moveMap(vector: MoveVector): void {
  const doc = iframeDocument()
  const win = iframeRef.value?.contentWindow
  if (!doc || !win) return

  injectScrollbarHider()

  const target = findScrollTarget(doc, vector)
  if (target) {
    target.scrollBy({ left: vector.x, top: vector.y, behavior: 'smooth' })
    return
  }

  win.scrollBy({ left: vector.x, top: vector.y, behavior: 'smooth' })
}

function stopMove(): void {
  if (!moveTimer) return
  window.clearInterval(moveTimer)
  moveTimer = null
}

function startMove(vector: MoveVector): void {
  stopMove()
  moveMap(vector)
  moveTimer = window.setInterval(() => moveMap(vector), 90)
}

function onMovePointerDown(event: PointerEvent, vector: MoveVector): void {
  event.preventDefault()
  ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
  startMove(vector)
}

onBeforeUnmount(() => {
  stopMove()
})
</script>

<template>
  <div class="mapa-drawio-viewer">
    <iframe
      ref="iframeRef"
      class="mapa-drawio-viewer__iframe"
      :title="title"
      :src="src"
      loading="lazy"
      scrolling="no"
      @load="injectScrollbarHider"
    />

    <div class="mapa-drawio-joystick" role="group" aria-label="Mover el mapa ampliado">
      <button
        type="button"
        class="mapa-drawio-joystick__btn mapa-drawio-joystick__btn--up"
        title="Mover arriba"
        aria-label="Mover arriba"
        @click="moveMap({ x: 0, y: -180 })"
        @pointerdown="onMovePointerDown($event, { x: 0, y: -72 })"
        @pointerup="stopMove"
        @pointercancel="stopMove"
        @pointerleave="stopMove"
      >
        <i class="fa-solid fa-chevron-up" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="mapa-drawio-joystick__btn mapa-drawio-joystick__btn--left"
        title="Mover izquierda"
        aria-label="Mover izquierda"
        @click="moveMap({ x: -180, y: 0 })"
        @pointerdown="onMovePointerDown($event, { x: -72, y: 0 })"
        @pointerup="stopMove"
        @pointercancel="stopMove"
        @pointerleave="stopMove"
      >
        <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
      </button>
      <div class="mapa-drawio-joystick__center" aria-hidden="true"></div>
      <button
        type="button"
        class="mapa-drawio-joystick__btn mapa-drawio-joystick__btn--right"
        title="Mover derecha"
        aria-label="Mover derecha"
        @click="moveMap({ x: 180, y: 0 })"
        @pointerdown="onMovePointerDown($event, { x: 72, y: 0 })"
        @pointerup="stopMove"
        @pointercancel="stopMove"
        @pointerleave="stopMove"
      >
        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="mapa-drawio-joystick__btn mapa-drawio-joystick__btn--down"
        title="Mover abajo"
        aria-label="Mover abajo"
        @click="moveMap({ x: 0, y: 180 })"
        @pointerdown="onMovePointerDown($event, { x: 0, y: 72 })"
        @pointerup="stopMove"
        @pointercancel="stopMove"
        @pointerleave="stopMove"
      >
        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</template>
