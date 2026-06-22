<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { marked } from 'marked'
import { teamMembers } from '../teamMembers'
import { getRpaMarkdown } from '../rpa'

const props = defineProps<{
  memberId: string
}>()

const member = computed(() => teamMembers.find((m) => m.id === props.memberId))
const rpaPageRef = ref<HTMLElement | null>(null)

const rpaSource = computed(() => (member.value ? getRpaMarkdown(props.memberId) : undefined))

const hasRpaMarkdown = computed(() => Boolean(rpaSource.value?.trim()))

const hasInfographic = computed(() => /aria-label=["']Infografía["']|rpa-infographic|<h2[^>]*>\s*Infografía\s*<\/h2>/i.test(rpaSource.value ?? ''))

const navItems = computed(() => [
  ...Array.from({ length: 7 }, (_, idx) => ({
    id: `rpa-section-u${idx + 1}`,
    label: `U${idx + 1}`,
    title: `Unidad ${idx + 1}`,
    enabled: true,
  })),
  {
    id: 'rpa-section-sintesis',
    label: 'S',
    title: 'Síntesis reflexiva',
    enabled: true,
  },
  {
    id: 'rpa-section-infografia',
    label: 'I',
    title: 'Infografía final',
    enabled: hasInfographic.value,
  },
])

function addRpaSectionIds(html: string): string {
  let unit = 0
  let synthesisSeen = false

  return html.replace(/<section\b([^>]*)>/gi, (match, attrs: string) => {
    if (/\sid\s*=/.test(attrs)) return match

    const isInfographic = /aria-label=["']Infografía["']/i.test(attrs)
    if (isInfographic) return `<section id="rpa-section-infografia"${attrs}>`

    const isSynthesis = /aria-label=["']Síntesis reflexiva["']/i.test(attrs)
    if (isSynthesis && !synthesisSeen) {
      synthesisSeen = true
      return `<section id="rpa-section-sintesis"${attrs}>`
    }

    unit += 1
    if (unit <= 7) return `<section id="rpa-section-u${unit}"${attrs}>`

    return match
  })
}

const rpaHtml = computed(() => {
  const md = rpaSource.value
  if (!md?.trim()) return ''
  return addRpaSectionIds(marked.parse(md) as string)
})

function scrollToRpaSection(id: string): void {
  const scroller = rpaPageRef.value
  const target = document.getElementById(id)
  if (!scroller || !target) return

  const scrollerRect = scroller.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  const stickyHeader = scroller.querySelector('.rpa-page__header')
  const stickyHeaderHeight = stickyHeader instanceof HTMLElement ? stickyHeader.offsetHeight : 0
  const top = scroller.scrollTop + targetRect.top - scrollerRect.top - stickyHeaderHeight - 18
  scroller.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
}
</script>

<template>
  <main ref="rpaPageRef" class="rpa-page">
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

    <article v-else class="rpa-page__inner rpa-page__inner--with-nav">
      <header class="rpa-page__header">
        <RouterLink class="rpa-page__back" :to="{ name: 'home', hash: '#equipo' }">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          Volver al equipo
        </RouterLink>
      </header>

      <div class="rpa-page__content">
        <div class="rpa-page__md rpa-prose" v-html="rpaHtml" />
      </div>

      <nav class="rpa-section-nav" aria-label="Navegación interna del RPA">
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          class="rpa-section-nav__dot"
          :class="{ 'rpa-section-nav__dot--disabled': !item.enabled }"
          :title="item.title"
          :aria-label="item.title"
          :disabled="!item.enabled"
          @click="scrollToRpaSection(item.id)"
        >
          {{ item.label }}
        </button>
      </nav>
    </article>
  </main>
</template>
