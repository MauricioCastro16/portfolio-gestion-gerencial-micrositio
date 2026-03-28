<script setup lang="ts">
import { nextTick, onMounted, ref, type ComponentPublicInstance } from 'vue'

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
  const seen = new Set<string>()
  for (const m of members) {
    seen.add(m.profileSrc)
    seen.add(m.avatarSrc)
  }
  return [...seen]
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
})

const selectedMember = ref<TeamMember | null>(null)
const selectedFrameRef = ref<HTMLElement | null>(null)
const gridFrameRefs = new Map<string, HTMLElement>()

const goToSection = (id: string): void => {
  const section = document.getElementById(id)
  section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })

  const fly = morphFlyRef.value
  if (!fly) {
    frameEl.style.opacity = ''
    morphFlyVisible.value = false
    return
  }

  fly.style.cssText = [
    'position:fixed',
    `left:${sourceRect.left}px`,
    `top:${sourceRect.top}px`,
    `width:${sourceRect.width}px`,
    `height:${sourceRect.height}px`,
    'z-index:10000',
    'pointer-events:none',
    'border-radius:14px',
    'overflow:hidden',
    'box-sizing:border-box',
    'margin:0',
    'border:1px solid rgba(255,255,255,0.16)',
    'background:rgba(8,16,29,0.95)',
  ].join(';')

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
  <main class="one-page">
    <section id="inicio" class="view hero-view">
      <div class="hero-content">
        <p class="kicker">Portfolio del equipo</p>
        <h1 class="team-name">Gestion Gerencial</h1>
        <p class="hero-subtitle">Micrositio base listo para completar por secciones.</p>
        <div class="hero-actions">
          <button type="button" class="btn btn-primary" @click="goToSection('equipo')">
            Ver integrantes
          </button>
          <button type="button" class="btn btn-secondary" @click="goToSection('proximas-secciones')">
            Bajar a secciones
          </button>
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
            <div class="floating-avatar-layer">
              <img
                :src="selectedMember.avatarSrc"
                :alt="`Avatar de ${selectedMember.name}`"
                class="detail-avatar"
              />
            </div>

            <div class="member-detail-layout">
              <div class="selected-card-window">
                <div ref="selectedFrameRef" class="member-photo-frame selected-frame">
                  <img :src="selectedMember.profileSrc" :alt="selectedMember.name" class="member-photo" />
                </div>
              </div>

              <div class="detail-right">
                <div class="detail-header">
                  <h3>{{ selectedMember.name }}</h3>
                  <button type="button" class="btn btn-secondary btn-close" @click="clearSelection">
                    Volver al equipo
                  </button>
                </div>

                <div class="detail-card">
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
