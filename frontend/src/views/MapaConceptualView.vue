<script setup lang="ts">
import mermaid from 'mermaid'
/* Carga estática del diagrama flowchart: evita fallos de import() dinámico (chunks huérfanos tras redeploy / caché). */
import 'mermaid/dist/chunks/mermaid.core/flowDiagram-PKNHOUZH.mjs'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { getMapaConceptual } from '../mapaConceptual'

const props = defineProps<{
  nivelId: string
}>()

const config = computed(() => getMapaConceptual(props.nivelId))

const hostRef = ref<HTMLElement | null>(null)
const renderError = ref<string | null>(null)

let mermaidReady = false

async function ensureMermaid(): Promise<void> {
  if (mermaidReady) return
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'neutral',
    flowchart: { htmlLabels: true, curve: 'basis' },
  })
  mermaidReady = true
}

let renderSeq = 0

async function renderDiagram(): Promise<void> {
  await nextTick()
  renderError.value = null
  const cfg = getMapaConceptual(props.nivelId)
  const el = hostRef.value
  if (!cfg || !el) return

  const seq = ++renderSeq
  el.innerHTML = ''

  try {
    await ensureMermaid()
    const id = `mermaid-map-${props.nivelId}-${seq}`
    const { svg } = await mermaid.render(id, cfg.mermaid.trim())
    if (seq !== renderSeq) return
    el.innerHTML = svg
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
  hostRef.value?.replaceChildren()
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

      <div
        ref="hostRef"
        class="mapa-diagram-host mapa-diagram-host--mermaid"
        aria-label="Diagrama conceptual Mermaid"
      />
    </article>
  </main>
</template>
