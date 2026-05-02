<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { marked } from 'marked'
import DesafioPuntoEquilibrioContent from '../components/desafio4/DesafioPuntoEquilibrioContent.vue'
import { getDesafioMarkdown } from '../desafios/content'
import { getDesafioMeta, isDesafioId } from '../desafios/config'

const props = defineProps<{
  desafioId: string
}>()

const meta = computed(() => (isDesafioId(props.desafioId) ? getDesafioMeta(props.desafioId) : undefined))

const isPuntoEquilibrioPage = computed(() => props.desafioId === '4')

const desafioHtml = computed(() => {
  if (!isDesafioId(props.desafioId)) return ''
  if (props.desafioId === '4') return ''
  const md = getDesafioMarkdown(props.desafioId)
  if (!md.trim()) return ''
  return marked.parse(md) as string
})
</script>

<template>
  <main class="desafio-page">
    <div v-if="!meta" class="desafio-page__inner desafio-page__inner--narrow">
      <p class="desafio-page__muted">No hay un desafío con ese número.</p>
      <RouterLink class="desafio-page__link-home" :to="{ name: 'home', hash: '#desafios' }">
        Volver a Desafíos
      </RouterLink>
    </div>

    <article
      v-else
      class="desafio-page__inner"
      :class="{ 'desafio-page__inner--wide': isPuntoEquilibrioPage }"
    >
      <header class="desafio-page__header">
        <RouterLink class="desafio-page__back" :to="{ name: 'home', hash: '#desafios' }">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          Volver a Desafíos
        </RouterLink>
      </header>

      <DesafioPuntoEquilibrioContent v-if="isPuntoEquilibrioPage" />
      <div v-else class="desafio-page__md rpa-prose" v-html="desafioHtml" />
    </article>
  </main>
</template>
