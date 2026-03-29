<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  type ComponentPublicInstance,
} from 'vue'
import logoSrcUrl from './assets/logo.png?url'

/** Import empaquetado por Vite: `publicDir` del proyecto es `../media`, no `frontend/public`. */
const LOGO_SRC = logoSrcUrl
const LOGO_W = 58
const LOGO_H = 55
const LOGO_PIXELS = LOGO_W * LOGO_H
/** Píxeles revelados por frame (~2 s total a 60 fps con batch 26). */
const LOGO_PIXELS_PER_FRAME = 26

type TeamMember = {
  id: string
  name: string
  profileSrc: string
  avatarSrc: string
  competencies: string[]
}

const teamMembers: TeamMember[] = [
  {
    id: 'castro',
    name: 'Mauricio Castro',
    profileSrc: '/perfil/castro.png',
    avatarSrc: '/avatares/castro.png',
    competencies: ['Liderazgo colaborativo', 'Planeamiento estrategico', 'Gestion de proyectos'],
  },
  {
    id: 'nadine',
    name: 'Nadine Peralta Ruiz',
    profileSrc: '/perfil/nadine.png',
    avatarSrc: '/avatares/nadine.png',
    competencies: ['Analisis de procesos', 'Comunicacion efectiva', 'Documentacion funcional'],
  },
  {
    id: 'beneyto',
    name: 'Mateo Beneyto',
    profileSrc: '/perfil/beneyto.png',
    avatarSrc: '/avatares/beneyto.png',
    competencies: ['Automatizacion digital', 'Resolucion de problemas', 'Trabajo en equipo'],
  },
  {
    id: 'cocito',
    name: 'Maximiliano Cocito',
    profileSrc: '/perfil/cocito.png',
    avatarSrc: '/avatares/cocito.png',
    competencies: ['Pensamiento analitico', 'Mejora continua', 'Enfoque en resultados'],
  },
]

function collectTeamImageUrls(members: TeamMember[]): string[] {
  const seen = new Set<string>([LOGO_SRC])
  for (const m of members) {
    seen.add(m.profileSrc)
    seen.add(m.avatarSrc)
  }
  return [...seen]
}

function shuffleIndices(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

const heroLogoCanvasRef = ref<HTMLCanvasElement | null>(null)
let heroLogoRaf = 0

function runHeroLogoPixelReveal(): void {
  const canvas = heroLogoCanvasRef.value
  if (!canvas) return

  canvas.width = LOGO_W
  canvas.height = LOGO_H

  const img = new Image()

  const startReveal = (): void => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const buf = document.createElement('canvas')
    buf.width = LOGO_W
    buf.height = LOGO_H
    const bctx = buf.getContext('2d')
    if (!bctx) return
    bctx.drawImage(img, 0, 0, LOGO_W, LOGO_H)
    const source = bctx.getImageData(0, 0, LOGO_W, LOGO_H)
    const out = ctx.createImageData(LOGO_W, LOGO_H)
    out.data.fill(0)
    ctx.putImageData(out, 0, 0)

    const order = shuffleIndices(LOGO_PIXELS)
    let ptr = 0

    const step = (): void => {
      const end = Math.min(ptr + LOGO_PIXELS_PER_FRAME, order.length)
      for (; ptr < end; ptr++) {
        const px = order[ptr]!
        const o = px * 4
        out.data[o] = source.data[o]!
        out.data[o + 1] = source.data[o + 1]!
        out.data[o + 2] = source.data[o + 2]!
        out.data[o + 3] = source.data[o + 3]!
      }
      ctx.putImageData(out, 0, 0)
      if (ptr < order.length) {
        heroLogoRaf = requestAnimationFrame(step)
      }
    }
    heroLogoRaf = requestAnimationFrame(step)
  }

  let revealStarted = false
  const runRevealOnce = (): void => {
    if (revealStarted) return
    revealStarted = true
    startReveal()
  }

  img.onload = (): void => {
    runRevealOnce()
  }
  img.onerror = (): void => {
    /* Logo ausente o URL inválida */
  }
  img.src = LOGO_SRC
  if (img.complete && img.naturalWidth > 0) {
    runRevealOnce()
  }
}

/** Precarga en caché del navegador; onerror no bloquea el sitio. */
function preloadImages(urls: string[], timeoutMs = 15000): Promise<void> {
  const timeout = new Promise<void>((resolve) => {
    setTimeout(resolve, timeoutMs)
  })
  const loads = Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve()
          img.src = src
        }),
    ),
  ).then(() => undefined)
  return Promise.race([loads, timeout])
}

const assetsReady = ref(false)

onMounted(async () => {
  await preloadImages(collectTeamImageUrls(teamMembers))
  assetsReady.value = true
  await nextTick()
  runHeroLogoPixelReveal()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(heroLogoRaf)
})

const selectedMember = ref<TeamMember | null>(null)
const selectedFrameRef = ref<HTMLElement | null>(null)
const onePageShellRef = ref<HTMLElement | null>(null)
const gridFrameRefs = new Map<string, HTMLElement>()

/**
 * El scroll vive en <main class="one-page">, no en el documento. scrollIntoView
 * puede mover también el viewport y desalinear el contenido respecto de la navbar.
 */
const goToSection = (id: string): void => {
  const section = document.getElementById(id)
  const shell = onePageShellRef.value
  if (!section || !shell) {
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  const top =
    shell.scrollTop + section.getBoundingClientRect().top - shell.getBoundingClientRect().top
  const maxScroll = Math.max(0, shell.scrollHeight - shell.clientHeight)
  shell.scrollTo({ top: Math.min(maxScroll, Math.max(0, top)), behavior: 'smooth' })
}

const setGridFrameRef =
  (memberId: string) => (el: Element | ComponentPublicInstance | null): void => {
  if (el instanceof HTMLElement) {
    gridFrameRefs.set(memberId, el)
    return
  }

  gridFrameRefs.delete(memberId)
}

type MorphRect = { left: number; top: number; width: number; height: number }

const morphSourceRect = ref<MorphRect | null>(null)

const morphFlyVisible = ref(false)
const morphFlySrc = ref('')
const morphFlyRef = ref<HTMLElement | null>(null)

const MORPH_MS = 560
const MORPH_EASING = 'cubic-bezier(0.2, 0.75, 0.16, 1)'

/** Vuela la foto en coordenadas de viewport (fixed) para no recortarla por overflow del panel. */
const startViewportMorph = async (sourceRect: MorphRect): Promise<void> => {
  if (!selectedFrameRef.value || !selectedMember.value) return

  const frameEl = selectedFrameRef.value
  const targetRect = frameEl.getBoundingClientRect()
  if (targetRect.width < 1 || targetRect.height < 1) return

  frameEl.style.opacity = '0'

  morphFlySrc.value = selectedMember.value.profileSrc
  morphFlyVisible.value = true

  await nextTick()

  const fly = morphFlyRef.value
  if (!fly) {
    frameEl.style.opacity = ''
    morphFlyVisible.value = false
    return
  }

  /* Sin tamaño en el primer frame, la <img> usa su resolución nativa y tapa la pantalla */
  fly.style.cssText = [
    'position:fixed',
    `left:${sourceRect.left}px`,
    `top:${sourceRect.top}px`,
    `width:${sourceRect.width}px`,
    `height:${sourceRect.height}px`,
    /* Por encima de .site-nav (15000); por debajo del loader de precarga (20000) */
    'z-index:19500',
    'pointer-events:none',
    'border-radius:14px',
    'overflow:hidden',
    'box-sizing:border-box',
    'margin:0',
    'border:1px solid rgba(67,46,140,0.22)',
    'background:var(--bg)',
  ].join(';')

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })

  const anim = fly.animate(
    [
      {
        left: `${sourceRect.left}px`,
        top: `${sourceRect.top}px`,
        width: `${sourceRect.width}px`,
        height: `${sourceRect.height}px`,
      },
      {
        left: `${targetRect.left}px`,
        top: `${targetRect.top}px`,
        width: `${targetRect.width}px`,
        height: `${targetRect.height}px`,
      },
    ],
    { duration: MORPH_MS, easing: MORPH_EASING, fill: 'forwards' },
  )

  try {
    await anim.finished
  } finally {
    morphFlyVisible.value = false
    fly.style.cssText = ''
    frameEl.style.opacity = ''
  }
}

const runMorphAfterLayout = (): void => {
  const source = morphSourceRect.value
  morphSourceRect.value = null
  if (!source) return

  let attempts = 0
  const tryAnimate = (): void => {
    attempts += 1
    if (attempts > 15 || !selectedFrameRef.value) return
    const r = selectedFrameRef.value.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) {
      requestAnimationFrame(tryAnimate)
      return
    }
    void startViewportMorph(source)
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(tryAnimate)
  })
}

const selectMember = async (member: TeamMember): Promise<void> => {
  const sourceFrame = gridFrameRefs.get(member.id)
  const rect = sourceFrame?.getBoundingClientRect()
  morphSourceRect.value = rect
    ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
    : null
  selectedMember.value = member
  await nextTick()
  runMorphAfterLayout()
}

const clearSelection = (): void => {
  morphSourceRect.value = null
  morphFlyVisible.value = false
  morphFlySrc.value = ''
  selectedMember.value = null
}
</script>

<template>
  <header class="site-nav">
    <a href="#inicio" class="site-nav-brand" @click.prevent="goToSection('inicio')">Gaoniters</a>
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
        aria-label="Mas secciones"
        @click="goToSection('proximas-secciones')"
      >
        <i class="fa-solid fa-layer-group site-nav-link__icon" aria-hidden="true"></i>
      </button>
    </nav>
  </header>

  <main ref="onePageShellRef" class="one-page">
    <section id="inicio" class="view hero-view">
      <div class="hero-layout">
        <div class="hero-logo-wrap" role="img" aria-label="Logo ilustrado del equipo Gaoniters">
          <canvas
            ref="heroLogoCanvasRef"
            class="hero-logo-canvas"
            width="58"
            height="55"
            aria-hidden="true"
          />
        </div>
        <div class="hero-content hero-content--split">
          <p class="kicker">Gestión Gerencial</p>
          <h1 class="team-name">Gaoniters</h1>
          <p class="hero-subtitle">
            Portfolio digital del equipo en el marco de la materia. Seguimos sumando secciones al micrositio.
          </p>
          <div class="hero-actions">
            <button type="button" class="btn btn-primary" @click="goToSection('equipo')">
              Ver integrantes
            </button>
            <button type="button" class="btn btn-secondary" @click="goToSection('proximas-secciones')">
              Bajar a secciones
            </button>
          </div>
        </div>
      </div>
      <div class="scroll-tip" aria-hidden="true">Desliza para continuar</div>
    </section>

    <section id="equipo" class="view team-view">
      <div class="section-header">
        <p class="kicker">Seccion 2</p>
        <h2>Presentacion del equipo</h2>
        <p class="section-subtitle">
          Esta seccion queda temporalmente como introduccion del equipo para seguir construyendo
          el contenido paso a paso.
        </p>
      </div>

      <div class="team-experience" :class="{ selected: selectedMember }">
        <div class="team-grid" :class="{ 'has-selection': selectedMember }">
          <button
            v-for="member in teamMembers"
            :key="member.id"
            type="button"
            class="member-card"
            :class="{
              active: selectedMember?.id === member.id,
              'slide-out-right': selectedMember && selectedMember.id !== member.id,
            }"
            @click="selectMember(member)"
          >
            <div class="member-photo-frame" :ref="setGridFrameRef(member.id)">
              <img :src="member.profileSrc" :alt="member.name" class="member-photo" />
            </div>
            <span class="member-name">{{ member.name }}</span>
          </button>
        </div>

        <Transition name="detail-fade">
          <div v-if="selectedMember" class="detail-stage">
            <div class="floating-avatar-layer" @click.stop>
              <img
                :src="selectedMember.avatarSrc"
                :alt="`Avatar de ${selectedMember.name}`"
                class="detail-avatar"
              />
            </div>

            <div class="member-detail-layout" @click.stop>
              <div class="detail-right">
                <div class="detail-profile-row">
                  <div class="selected-card-window" @click.stop>
                    <div ref="selectedFrameRef" class="member-photo-frame selected-frame">
                      <img :src="selectedMember.profileSrc" :alt="selectedMember.name" class="member-photo" />
                    </div>
                  </div>
                  <div class="detail-heading-actions">
                    <div class="detail-header">
                      <h3>{{ selectedMember.name }}</h3>
                    </div>
                    <button
                      type="button"
                      class="btn-detail-back"
                      aria-label="Volver al equipo"
                      @click.stop="clearSelection"
                    >
                      <i class="fa-solid fa-arrow-left btn-detail-back__icon" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>

                <div class="detail-card" @click.stop>
                  <p class="detail-card-title">Competencias</p>
                  <ul class="competencies-list">
                    <li v-for="competency in selectedMember.competencies" :key="competency">
                      {{ competency }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </section>

    <section id="proximas-secciones" class="view next-view">
      <div class="section-header">
        <p class="kicker">Siguiente paso</p>
        <h2>Espacio para futuras secciones</h2>
        <p class="section-subtitle">
          Dejamos esta vista vacia para continuar con Desafios, RPA, TPI y reflexiones.
        </p>
      </div>
    </section>
  </main>

  <Teleport to="body">
    <div v-if="morphFlyVisible" class="morph-fly-root" aria-hidden="true">
      <div ref="morphFlyRef" class="morph-fly-frame">
        <img :src="morphFlySrc" alt="" class="morph-fly-img" />
      </div>
    </div>
  </Teleport>

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
