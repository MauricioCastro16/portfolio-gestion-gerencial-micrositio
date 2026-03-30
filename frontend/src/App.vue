<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import logoSrcUrl from './assets/logo.png?url'
import { teamMembers, collectTeamImageUrls } from './teamMembers'
import { preloadImages } from './utils/preload'

const assetsReady = ref(false)
provide('assetsReady', assetsReady)

onMounted(async () => {
  await preloadImages(collectTeamImageUrls(teamMembers, [logoSrcUrl]))
  assetsReady.value = true
})

const router = useRouter()
const route = useRoute()
const goToSection = (id: string): void => {
  router.push({ path: '/', hash: '#' + id })
}
</script>

<template>
  <header class="site-nav">
    <a href="#inicio" class="site-nav-brand" @click.prevent="goToSection('inicio')">
      <span class="site-nav-isologo-wrap" aria-hidden="true">
        <img src="/isologo.png" alt="" class="site-nav-isologo-img" width="40" height="40" />
      </span>
      <span class="site-nav-brand-text">Gaoniters</span>
    </a>
    <nav class="site-nav-links" aria-label="Secciones del sitio">
      <button
        type="button"
        class="site-nav-link"
        aria-label="Inicio"
        @click="goToSection('inicio')"
      >
        <i class="fa-solid fa-house site-nav-link__icon" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="site-nav-link"
        aria-label="Equipo"
        @click="goToSection('equipo')"
      >
        <i class="fa-solid fa-users site-nav-link__icon" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="site-nav-link"
        aria-label="Mapa conceptual"
        @click="goToSection('mapa-conceptual')"
      >
        <i class="fa-solid fa-sitemap site-nav-link__icon" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="site-nav-link"
        aria-label="Desafíos"
        @click="goToSection('desafios')"
      >
        <i class="fa-solid fa-trophy site-nav-link__icon" aria-hidden="true"></i>
      </button>
    </nav>
  </header>

  <RouterView v-slot="{ Component }">
    <Transition name="page-view" mode="out-in" appear>
      <component :is="Component" v-if="Component" :key="route.path" />
    </Transition>
  </RouterView>

  <Teleport to="body">
    <Transition name="asset-loader-fade">
      <div
        v-if="!assetsReady"
        class="asset-loading-root"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div class="asset-loading-inner">
          <span class="asset-loading-spinner" aria-hidden="true" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
