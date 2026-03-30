<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { marked } from 'marked'
import { teamMembers } from '../teamMembers'
import { getRpaMarkdown } from '../rpa'

const props = defineProps<{
  memberId: string
}>()

const member = computed(() => teamMembers.find((m) => m.id === props.memberId))

const rpaSource = computed(() => (member.value ? getRpaMarkdown(props.memberId) : undefined))

const hasRpaMarkdown = computed(() => Boolean(rpaSource.value?.trim()))

const rpaHtml = computed(() => {
  const md = rpaSource.value
  if (!md?.trim()) return ''
  return marked.parse(md) as string
})
</script>

<template>
  <main class="rpa-page">
    <div v-if="!member" class="rpa-page__inner rpa-page__inner--narrow">
      <p class="rpa-page__muted">No hay una ficha de equipo con ese identificador.</p>
      <RouterLink class="rpa-page__link-home" :to="{ name: 'home' }">Volver al inicio</RouterLink>
    </div>

    <div v-else-if="!hasRpaMarkdown" class="rpa-page__inner rpa-page__inner--narrow">
      <p class="rpa-page__muted">
        Todavía no hay texto RPA para este integrante. Creá
        <code class="rpa-page__code">frontend/src/rpa/{{ memberId }}.md</code>
        y sumalo en
        <code class="rpa-page__code">frontend/src/rpa/index.ts</code>.
      </p>
      <RouterLink class="rpa-page__link-home" :to="{ name: 'home', hash: '#equipo' }">
        Volver al equipo
      </RouterLink>
    </div>

    <article v-else class="rpa-page__inner">
      <header class="rpa-page__header">
        <RouterLink class="rpa-page__back" :to="{ name: 'home', hash: '#equipo' }">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          Volver al equipo
        </RouterLink>
      </header>

      <div class="rpa-page__md rpa-prose" v-html="rpaHtml" />
    </article>
  </main>
</template>
