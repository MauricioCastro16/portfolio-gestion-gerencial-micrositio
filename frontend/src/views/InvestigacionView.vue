<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { marked } from 'marked'
import { getInvestigacionMarkdown, isInvestigacionId } from '../investigaciones/content'

const props = defineProps<{
  investigacionId: string
}>()

const valid = computed(() => isInvestigacionId(props.investigacionId))

const isUnidad1Layout = computed(() => props.investigacionId === 'unidad-1')

const investigacionHtml = computed(() => {
  if (!valid.value) return ''
  const raw = getInvestigacionMarkdown(props.investigacionId)
  if (!raw?.trim()) return ''
  /* Unidad 1 es HTML con indentación; marked interpretaría bloques como <pre><code>. */
  if (props.investigacionId === 'unidad-1') {
    return raw.trim()
  }
  return marked.parse(raw) as string
})
</script>

<template>
  <main class="desafio-page">
    <div v-if="!valid" class="desafio-page__inner desafio-page__inner--narrow">
      <p class="desafio-page__muted">No hay material para esta investigación.</p>
      <RouterLink class="desafio-page__link-home" :to="{ name: 'home', hash: '#investigaciones' }">
        Volver a Investigaciones
      </RouterLink>
    </div>

    <article
      v-else
      class="desafio-page__inner"
      :class="{ 'desafio-page__inner--wide': isUnidad1Layout }"
    >
      <header class="desafio-page__header">
        <RouterLink class="desafio-page__back" :to="{ name: 'home', hash: '#investigaciones' }">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          Volver a Investigaciones
        </RouterLink>
      </header>

      <div
        class="desafio-page__md"
        :class="{ 'rpa-prose': !isUnidad1Layout }"
        v-html="investigacionHtml"
      />
    </article>
  </main>
</template>
