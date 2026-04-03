<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  Transition,
  watch,
  type ComponentPublicInstance,
  type Ref,
} from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import logoSrcUrl from '../assets/logo.png?url'
import { DESAFIOS, desafioEstadoClassSuffix, desafioEstadoLabel } from '../desafios/config'
import {
  memberPresentationVideoSources,
  teamMembers,
  type TeamMember,
} from '../teamMembers'

const LAQUEBRADA_MAPS_QUERY =
  'Leandro N. Alem Oeste 1625, Resistencia, Chaco, Argentina'

const laquebradaMapsEmbedSrc = computed((): string => {
  const key = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY?.trim()
  if (key) {
    const q = encodeURIComponent(LAQUEBRADA_MAPS_QUERY)
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${q}`
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(LAQUEBRADA_MAPS_QUERY)}&z=17&hl=es&output=embed&iwloc=near`
})

const laquebradaFacebookUrl = 'https://www.facebook.com/LaQuebradaFabricaDeSandwiches/'
const laquebradaInstagramUrl = 'https://www.instagram.com/laquebradasandwicheria/'

/** Import empaquetado por Vite: `publicDir` del proyecto es `../media`, no `frontend/public`. */
const LOGO_SRC = logoSrcUrl
const LOGO_W = 58
const LOGO_H = 55
const LOGO_PIXELS = LOGO_W * LOGO_H
/** Píxeles revelados por frame (~2 s total a 60 fps con batch 26). */
const LOGO_PIXELS_PER_FRAME = 26

const assetsReady = inject<Ref<boolean>>('assetsReady')!

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
  cancelAnimationFrame(heroLogoRaf)
  heroLogoRaf = 0

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

/** Tras volver de otra ruta (p. ej. RPA), el canvas ya existe y `assetsReady` no vuelve a cambiar: hay que re-ejecutar tras montaje y con el DOM ya pintado (Transition padre). */
function scheduleHeroLogoPixelReveal(): void {
  if (!assetsReady.value) return
  nextTick(() => {
    requestAnimationFrame(() => {
      runHeroLogoPixelReveal()
    })
  })
}

watch(
  assetsReady,
  (v) => {
    if (v) scheduleHeroLogoPixelReveal()
  },
  { flush: 'post' },
)

const route = useRoute()
const selectedMember = ref<TeamMember | null>(null)
const selectedFrameRef = ref<HTMLElement | null>(null)
const onePageShellRef = ref<HTMLElement | null>(null)
const gridFrameRefs = new Map<string, HTMLElement>()

/** `true` para volver a ver `[tpi-scroll]` en consola (solo útil en dev). */
const DEBUG_TPI_SCROLL = false

function debugLogTpiScroll(shell: HTMLElement, reason: string, extra?: Record<string, unknown>): void {
  if (!DEBUG_TPI_SCROLL) return
  const maxScroll = Math.max(0, shell.scrollHeight - shell.clientHeight)
  const shellRect = shell.getBoundingClientRect()
  const slackFromMax = maxScroll - shell.scrollTop
  const tpi = shell.querySelector('#tpi')
  const desafios = shell.querySelector('#desafios')
  const sections = shell.querySelectorAll<HTMLElement>(':scope > section.view')

  const sectionRows: { id: string; topRel: number; bottomRel: number; offsetTop: number; h: number }[] = []
  for (const el of sections) {
    const r = el.getBoundingClientRect()
    sectionRows.push({
      id: el.id || '(sin id)',
      topRel: Math.round((r.top - shellRect.top) * 100) / 100,
      bottomRel: Math.round((r.bottom - shellRect.top) * 100) / 100,
      offsetTop: el.offsetTop,
      h: el.offsetHeight,
    })
  }

  const payload: Record<string, unknown> = {
    reason,
    scrollTop: Math.round(shell.scrollTop * 100) / 100,
    clientHeight: shell.clientHeight,
    scrollHeight: shell.scrollHeight,
    maxScroll: Math.round(maxScroll * 100) / 100,
    slackFromMax: Math.round(slackFromMax * 100) / 100,
    sections: sectionRows,
    ...extra,
  }

  if (tpi instanceof HTMLElement) {
    const r = tpi.getBoundingClientRect()
    payload.tpiViewport = {
      topRelShell: Math.round((r.top - shellRect.top) * 100) / 100,
      bottomRelShell: Math.round((r.bottom - shellRect.top) * 100) / 100,
    }
  }
  if (desafios instanceof HTMLElement) {
    const r = desafios.getBoundingClientRect()
    const visiblePeekPx = Math.min(r.bottom, shellRect.bottom) - Math.max(r.top, shellRect.top)
    payload.desafiosVsShell = {
      topRelShell: Math.round((r.top - shellRect.top) * 100) / 100,
      bottomRelShell: Math.round((r.bottom - shellRect.top) * 100) / 100,
      overlapVisiblePx: Math.round(Math.max(0, visiblePeekPx) * 100) / 100,
    }
  }

  console.log('[tpi-scroll]', payload)
}

/** Tras scroll suave por hash, no micro-corregir (evita pelear con scrollTo). */
const SHELL_SNAP_SUPPRESS_MS = 1200
let shellSnapSuppressUntil = 0
let shellDebugLastBottomSkipLog = 0
let shellScrollSnapTimer: ReturnType<typeof setTimeout> | null = null
let shellScrollSnapOnScroll: (() => void) | null = null
let shellScrollSnapOnScrollEnd: (() => void) | null = null

/**
 * Chromium a veces deja 20–80px de desfase al aterrizar con scroll-snap (sobre todo al subir).
 * Centro: inicio/equipo/mapa. Borde superior: desafíos/tpi (scroll-snap-align: start).
 */
function microAlignShellAfterSnap(shell: HTMLElement): void {
  if (performance.now() < shellSnapSuppressUntil) return
  const maxScroll = Math.max(0, shell.scrollHeight - shell.clientHeight)
  const edgeSlack = 12
  /* Cerca del tope o del fondo no corregir: el algoritmo puede elegir otra sección y alejar del borde real. */
  if (shell.scrollTop <= edgeSlack) {
    debugLogTpiScroll(shell, 'microAlign:skip near TOP (scrollTop<=edgeSlack)')
    return
  }
  if (maxScroll - shell.scrollTop <= edgeSlack) {
    const tpiEl = shell.querySelector('#tpi')
    if (tpiEl instanceof HTMLElement) {
      const sr = shell.getBoundingClientRect()
      const delta = tpiEl.getBoundingClientRect().top - sr.top
      const ad = Math.abs(delta)
      if (ad >= 1.5 && ad <= 80) {
        const target = Math.round(shell.scrollTop + delta)
        const clamped = Math.min(maxScroll, Math.max(0, target))
        debugLogTpiScroll(shell, 'microAlign:bottom TPI-only', { delta, target, clamped })
        shell.scrollTo({ top: clamped, behavior: 'instant' })
        return
      }
    }
    if (DEBUG_TPI_SCROLL && performance.now() - shellDebugLastBottomSkipLog > 600) {
      shellDebugLastBottomSkipLog = performance.now()
      debugLogTpiScroll(
        shell,
        'microAlign:bottom sin corrección (delta TPI fuera de 1.5–80 o sin #tpi)',
      )
    }
    return
  }

  const shellRect = shell.getBoundingClientRect()
  const shellMidY = shellRect.top + shellRect.height / 2
  const sections = shell.querySelectorAll<HTMLElement>(':scope > section.view')
  if (sections.length === 0) return

  let dominant: HTMLElement | null = null
  let domOverlap = 0
  for (const section of sections) {
    const r = section.getBoundingClientRect()
    const overlap = Math.min(r.bottom, shellRect.bottom) - Math.max(r.top, shellRect.top)
    if (overlap > domOverlap) {
      domOverlap = overlap
      dominant = section
    }
  }
  if (!dominant || domOverlap < shellRect.height * 0.2) {
    debugLogTpiScroll(shell, 'microAlign:skip (low overlap)', { domOverlap })
    return
  }

  const r = dominant.getBoundingClientRect()
  const delta =
    dominant.id === 'desafios' || dominant.id === 'tpi'
      ? r.top - shellRect.top
      : r.top + r.height / 2 - shellMidY
  const bestAbs = Math.abs(delta)
  if (bestAbs < 1.5 || bestAbs > 80) {
    debugLogTpiScroll(shell, 'microAlign:skip (bestAbs out of range)', { bestAbs, bestDelta: delta, id: dominant.id })
    return
  }
  const target = Math.round(shell.scrollTop + delta)
  debugLogTpiScroll(shell, 'microAlign:APPLY', { bestAbs, bestDelta: delta, targetScrollTop: target, id: dominant.id })
  shell.scrollTo({ top: Math.min(maxScroll, Math.max(0, target)), behavior: 'instant' })
}

/**
 * El scroll vive en <main class="one-page">, no en el documento. scrollIntoView
 * puede mover también el viewport y desalinear el contenido respecto de la navbar.
 */
const scrollShellToSectionId = (id: string, behavior: ScrollBehavior = 'smooth'): void => {
  const section = document.getElementById(id)
  const shell = onePageShellRef.value
  if (!section || !shell) {
    section?.scrollIntoView({ behavior, block: 'center' })
    return
  }
  shellSnapSuppressUntil = performance.now() + SHELL_SNAP_SUPPRESS_MS
  const sr = shell.getBoundingClientRect()
  const r = section.getBoundingClientRect()
  const maxScroll = Math.max(0, shell.scrollHeight - shell.clientHeight)
  /* Desafíos/TPI usan snap start; el menú lleva al inicio visible de la sección. */
  const target =
    id === 'desafios' || id === 'tpi'
      ? shell.scrollTop + r.top - sr.top
      : shell.scrollTop + (r.top + r.height / 2) - (sr.top + sr.height / 2)
  shell.scrollTo({ top: Math.min(maxScroll, Math.max(0, target)), behavior })
}

onMounted(() => {
  scheduleHeroLogoPixelReveal()
  const shell = onePageShellRef.value
  if (!shell) return

  const scheduleMicro = (): void => {
    if (performance.now() < shellSnapSuppressUntil) return
    if (shellScrollSnapTimer) clearTimeout(shellScrollSnapTimer)
    shellScrollSnapTimer = setTimeout(() => {
      shellScrollSnapTimer = null
      microAlignShellAfterSnap(shell)
    }, 90)
  }

  const onScrollEnd = (): void => {
    if (shellScrollSnapTimer) {
      clearTimeout(shellScrollSnapTimer)
      shellScrollSnapTimer = null
    }
    const maxScroll = Math.max(0, shell.scrollHeight - shell.clientHeight)
    const slack = maxScroll - shell.scrollTop
    if (DEBUG_TPI_SCROLL && slack < shell.clientHeight * 0.35) {
      debugLogTpiScroll(shell, 'scrollend (zona final / TPI)')
    }
    microAlignShellAfterSnap(shell)
  }

  shellScrollSnapOnScroll = scheduleMicro
  shellScrollSnapOnScrollEnd = onScrollEnd
  shell.addEventListener('scroll', scheduleMicro, { passive: true })
  shell.addEventListener('scrollend', onScrollEnd)
})

onBeforeUnmount(() => {
  closePresentationVideo()
  cancelAnimationFrame(heroLogoRaf)
  const shell = onePageShellRef.value
  if (shell) {
    if (shellScrollSnapOnScroll) shell.removeEventListener('scroll', shellScrollSnapOnScroll)
    if (shellScrollSnapOnScrollEnd) shell.removeEventListener('scrollend', shellScrollSnapOnScrollEnd)
  }
  if (shellScrollSnapTimer) {
    clearTimeout(shellScrollSnapTimer)
    shellScrollSnapTimer = null
  }
  shellScrollSnapOnScroll = null
  shellScrollSnapOnScrollEnd = null
})

/**
 * Vuelta desde RPA/mapa con `/#equipo` o `/#mapa-conceptual`: el hash ya está en la ruta
 * al montar HomeView; hace falta `immediate` en el watch y reintentos hasta que exista
 * `one-page` (y a veces hasta terminar la transición de entrada).
 */
const scrollToHashFromRoute = (): void => {
  const raw = route.hash?.replace(/^#/, '') || ''
  if (!raw) return
  if (!assetsReady.value || route.path !== '/') return

  let attempts = 0
  const maxAttempts = 48

  const tryScroll = (): void => {
    attempts += 1
    const shell = onePageShellRef.value
    const section = document.getElementById(raw)

    if (shell && section) {
      scrollShellToSectionId(raw, 'smooth')
      return
    }

    if (attempts < maxAttempts) {
      nextTick(() => {
        requestAnimationFrame(tryScroll)
      })
    }
  }

  nextTick(() => {
    requestAnimationFrame(tryScroll)
  })
}

watch(
  () => [assetsReady.value, route.path, route.hash] as const,
  () => {
    if (!assetsReady.value || route.path !== '/') return
    scrollToHashFromRoute()
  },
  { flush: 'post', immediate: true },
)

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

const showPresentationVideo = ref(false)
/** Origen del “genie” (rect del botón Video) para abrir/cerrar hacia ese punto. */
const presentationOpenOrigin = ref<DOMRect | null>(null)
const presentationVideoRef = ref<HTMLVideoElement | null>(null)
const presentationVideoError = ref(false)
/** Audio OK pero códec de vídeo no decodificable en este navegador (típico .mov HEVC). */
const presentationVideoOnlyAudio = ref(false)
let presentationVideoEscHandler: ((e: KeyboardEvent) => void) | null = null
let presentationVideoOnlyAudioTimer: ReturnType<typeof setTimeout> | null = null

function clearPresentationVideoOnlyAudioCheck(): void {
  if (presentationVideoOnlyAudioTimer) {
    clearTimeout(presentationVideoOnlyAudioTimer)
    presentationVideoOnlyAudioTimer = null
  }
}

function schedulePresentationVideoDimensionCheck(video: HTMLVideoElement): void {
  clearPresentationVideoOnlyAudioCheck()
  presentationVideoOnlyAudioTimer = setTimeout(() => {
    presentationVideoOnlyAudioTimer = null
    if (!showPresentationVideo.value) return
    if (video.videoWidth >= 2 && video.videoHeight >= 2) {
      presentationVideoOnlyAudio.value = false
      return
    }
    if (!video.paused && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      presentationVideoOnlyAudio.value = true
    }
  }, 450)
}

function onPresentationVideoLoadedMetadata(ev: Event): void {
  const video = ev.target
  if (!(video instanceof HTMLVideoElement)) return
  if (video.videoWidth >= 2 && video.videoHeight >= 2) {
    presentationVideoOnlyAudio.value = false
    clearPresentationVideoOnlyAudioCheck()
  }
}

function onPresentationVideoPlaying(ev: Event): void {
  const video = ev.target
  if (!(video instanceof HTMLVideoElement)) return
  schedulePresentationVideoDimensionCheck(video)
}

function presentationVideoPrefersReducedMotion(): boolean {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function cleanupPresentationGenieInline(
  genie: HTMLElement,
  backdrop: HTMLElement | null,
  closeBtn: HTMLElement | null,
): void {
  for (const n of [genie, backdrop, closeBtn]) {
    if (!n) continue
    n.style.removeProperty('transition')
    n.style.removeProperty('transform')
    n.style.removeProperty('transform-origin')
    n.style.removeProperty('opacity')
    n.style.removeProperty('filter')
    n.style.removeProperty('will-change')
  }
}

function presentationVideoGenieEnter(el: Element, done: () => void): void {
  if (presentationVideoPrefersReducedMotion()) {
    done()
    return
  }
  let finished = false
  const safeDone = (): void => {
    if (finished) return
    finished = true
    done()
  }

  const root = el as HTMLElement
  const genie = root.querySelector('.presentation-video-genie') as HTMLElement | null
  const backdrop = root.querySelector('.presentation-video-backdrop') as HTMLElement | null
  const closeBtn = root.querySelector('.presentation-video-close') as HTMLElement | null
  const origin = presentationOpenOrigin.value

  if (closeBtn) closeBtn.style.opacity = '0'
  if (backdrop) backdrop.style.opacity = '0'

  if (!genie) {
    safeDone()
    return
  }

  const last = genie.getBoundingClientRect()
  /* Solo transform + opacity (GPU); sin blur ni rotateX — animan mucho más fluido. */
  if (origin && last.width > 0 && last.height > 0) {
    const ox = origin.left + origin.width / 2
    const oy = origin.top + origin.height / 2
    const s = Math.max(0.06, Math.min(origin.width / last.width, origin.height / last.height))
    genie.style.transformOrigin = `${ox - last.left}px ${oy - last.top}px`
    genie.style.willChange = 'transform, opacity'
    genie.style.transform = `scale(${s})`
    genie.style.opacity = '0.82'
  } else {
    genie.style.transformOrigin = '50% 58%'
    genie.style.willChange = 'transform, opacity'
    genie.style.transform = 'scale(0.08)'
    genie.style.opacity = '0.82'
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (backdrop) {
        backdrop.style.transition = 'opacity 0.26s ease-out'
        backdrop.style.opacity = '1'
      }
      if (closeBtn) {
        closeBtn.style.transition = 'opacity 0.24s ease-out 0.08s'
        closeBtn.style.opacity = '1'
      }
      genie.style.transition =
        'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease-out'
      genie.style.transform = 'scale(1)'
      genie.style.opacity = '1'

      const timeoutId = window.setTimeout(safeDone, 520)
      const onEnd = (e: TransitionEvent): void => {
        if (e.target !== genie || e.propertyName !== 'transform') return
        genie.removeEventListener('transitionend', onEnd)
        window.clearTimeout(timeoutId)
        cleanupPresentationGenieInline(genie, backdrop, closeBtn)
        safeDone()
      }
      genie.addEventListener('transitionend', onEnd)
    })
  })
}

function presentationVideoGenieLeave(el: Element, done: () => void): void {
  if (presentationVideoPrefersReducedMotion()) {
    presentationOpenOrigin.value = null
    done()
    return
  }
  let finished = false
  const safeDone = (): void => {
    if (finished) return
    finished = true
    presentationOpenOrigin.value = null
    done()
  }

  const root = el as HTMLElement
  const genie = root.querySelector('.presentation-video-genie') as HTMLElement | null
  const backdrop = root.querySelector('.presentation-video-backdrop') as HTMLElement | null
  const closeBtn = root.querySelector('.presentation-video-close') as HTMLElement | null
  const origin = presentationOpenOrigin.value

  if (!genie) {
    safeDone()
    return
  }

  const last = genie.getBoundingClientRect()
  if (origin && last.width > 0 && last.height > 0) {
    const ox = origin.left + origin.width / 2
    const oy = origin.top + origin.height / 2
    const s = Math.max(0.06, Math.min(origin.width / last.width, origin.height / last.height))
    genie.style.transformOrigin = `${ox - last.left}px ${oy - last.top}px`
    genie.style.willChange = 'transform, opacity'
    genie.style.transition =
      'transform 0.34s cubic-bezier(0.55, 0.06, 0.68, 0.19), opacity 0.28s ease-in'
    genie.style.transform = `scale(${s})`
    genie.style.opacity = '0'
  } else {
    genie.style.willChange = 'transform, opacity'
    genie.style.transition = 'transform 0.32s ease-in, opacity 0.26s ease-in'
    genie.style.transform = 'scale(0.06)'
    genie.style.opacity = '0'
  }
  if (backdrop) {
    backdrop.style.transition = 'opacity 0.3s ease-in'
    backdrop.style.opacity = '0'
  }
  if (closeBtn) {
    closeBtn.style.transition = 'opacity 0.16s ease-in'
    closeBtn.style.opacity = '0'
  }

  const timeoutId = window.setTimeout(safeDone, 480)
  const onEnd = (e: TransitionEvent): void => {
    if (e.target !== genie || e.propertyName !== 'transform') return
    genie.removeEventListener('transitionend', onEnd)
    window.clearTimeout(timeoutId)
    cleanupPresentationGenieInline(genie, backdrop, closeBtn)
    safeDone()
  }
  genie.addEventListener('transitionend', onEnd)
}

function closePresentationVideo(): void {
  clearPresentationVideoOnlyAudioCheck()
  showPresentationVideo.value = false
  presentationVideoError.value = false
  presentationVideoOnlyAudio.value = false
  presentationVideoRef.value?.pause()
  if (presentationVideoEscHandler) {
    document.removeEventListener('keydown', presentationVideoEscHandler)
    presentationVideoEscHandler = null
  }
}

function openPresentationVideo(ev?: MouseEvent): void {
  const t = ev?.currentTarget
  presentationOpenOrigin.value =
    t instanceof HTMLElement ? t.getBoundingClientRect() : null
  presentationVideoError.value = false
  presentationVideoOnlyAudio.value = false
  clearPresentationVideoOnlyAudioCheck()
  showPresentationVideo.value = true
  nextTick(() => {
    presentationVideoEscHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePresentationVideo()
    }
    document.addEventListener('keydown', presentationVideoEscHandler)
    void presentationVideoRef.value?.play().catch(() => {
      /* autoplay bloqueado hasta interacción; controls siguen disponibles */
    })
  })
}

const clearSelection = (): void => {
  closePresentationVideo()
  morphSourceRect.value = null
  morphFlyVisible.value = false
  morphFlySrc.value = ''
  selectedMember.value = null
}
</script>

<template>
  <div class="home-view-root">
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
          <div class="hero-title-isologo">
            <h1 class="team-name">Gaoniters</h1>
            <div class="hero-isologo-wrap" aria-hidden="true">
              <img src="/isologo.png" alt="" class="hero-isologo-img" width="96" height="96" />
            </div>
          </div>
          <p class="hero-subtitle">
            Portfolio digital<br />
            Quedate atento, seguimos sumando desafíos
          </p>
        </div>
      </div>
      <div class="scroll-tip" aria-hidden="true">Desliza para continuar</div>
    </section>

    <section id="equipo" class="view team-view">
      <div class="section-header">
        <p class="kicker">Gaoniters</p>
        <h2>Presentación del equipo</h2>
        <p class="section-subtitle">
          Te invitamos a conocernos...
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
            <span class="member-name">
              <span class="member-name__first">{{ member.givenName }}</span>
              <span class="member-name__last">{{ member.familyName }}</span>
            </span>
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
                    <div class="detail-heading-actions__buttons">
                      <RouterLink
                        :to="{ name: 'rpa-member', params: { memberId: selectedMember.id } }"
                        class="btn-rpa"
                        title="Abrir la ruta personal de aprendizaje (RPA) de esta persona"
                        aria-label="Abrir la ruta personal de aprendizaje (RPA) de esta persona"
                        @click.stop
                      >
                        <i class="fa-solid fa-route btn-rpa__icon" aria-hidden="true"></i>
                      </RouterLink>
                      <button
                        type="button"
                        class="btn-member-video"
                        title="Ver el video de presentación de esta persona"
                        aria-label="Ver el video de presentación de esta persona"
                        @click.stop="openPresentationVideo($event)"
                      >
                        <i class="fa-solid fa-video btn-member-video__icon" aria-hidden="true"></i>
                      </button>
                      <button
                        type="button"
                        class="btn-detail-back"
                        title="Volver al listado del equipo"
                        aria-label="Volver al listado del equipo"
                        @click.stop="clearSelection"
                      >
                        <i class="fa-solid fa-arrow-left btn-detail-back__icon" aria-hidden="true"></i>
                      </button>
                    </div>
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

    <section id="mapa-conceptual" class="view mapa-conceptual-view">
      <div class="section-header">
        <p class="kicker">Gaoniters</p>
        <h2>Mapa conceptual</h2>
        <p class="section-subtitle">
          ¡Vamos a subir juntos las escaleras de la gestión gerencial!
        </p>
      </div>

      <div class="mapa-stairs" aria-label="Escalera de niveles operativo, táctico y gerencial">
        <RouterLink
          class="mapa-step mapa-step--operativo"
          :to="{ name: 'mapa-nivel', params: { nivelId: 'nivel-operativo' } }"
          aria-label="Nivel operativo, peldaño 1, abrir diagrama"
        >
          <div class="mapa-step__inner">
            <span class="mapa-step__badge" aria-hidden="true">1</span>
            <div class="mapa-step__titles">
              <span class="mapa-step__line">Nivel</span>
              <span class="mapa-step__line mapa-step__line--name">Operativo</span>
            </div>
            <div class="mapa-step__cta">
              <span class="mapa-step__cta-line">Abrir el</span>
              <span class="mapa-step__cta-line">diagrama</span>
            </div>
          </div>
        </RouterLink>
        <RouterLink
          class="mapa-step mapa-step--tactico"
          :to="{ name: 'mapa-nivel', params: { nivelId: 'nivel-tactico' } }"
          aria-label="Nivel táctico, peldaño 2, abrir diagrama"
        >
          <div class="mapa-step__inner">
            <span class="mapa-step__badge" aria-hidden="true">2</span>
            <div class="mapa-step__titles">
              <span class="mapa-step__line">Nivel</span>
              <span class="mapa-step__line mapa-step__line--name">Táctico</span>
            </div>
            <div class="mapa-step__cta">
              <span class="mapa-step__cta-line">Abrir el</span>
              <span class="mapa-step__cta-line">diagrama</span>
            </div>
          </div>
        </RouterLink>
        <RouterLink
          class="mapa-step mapa-step--gerencial"
          :to="{ name: 'mapa-nivel', params: { nivelId: 'nivel-gerencial' } }"
          aria-label="Nivel gerencial, peldaño 3, abrir diagrama"
        >
          <div class="mapa-step__inner">
            <span class="mapa-step__badge" aria-hidden="true">3</span>
            <div class="mapa-step__titles">
              <span class="mapa-step__line">Nivel</span>
              <span class="mapa-step__line mapa-step__line--name">Gerencial</span>
            </div>
            <div class="mapa-step__cta">
              <span class="mapa-step__cta-line">Abrir el</span>
              <span class="mapa-step__cta-line">diagrama</span>
            </div>
          </div>
        </RouterLink>
      </div>
    </section>

    <section id="desafios" class="view desafios-view">
      <div class="section-header">
        <p class="kicker">Gaoniters</p>
        <h2>Desafíos</h2>
        <p class="section-subtitle">
          Te invitamos a revisar cada desafío que ya enfrentamos...
        </p>
      </div>

      <div class="desafios-scroll-stack" aria-label="Desafíos D3 a D7">
        <RouterLink
          v-for="d in DESAFIOS"
          :id="'desafio-' + d.id"
          :key="d.id"
          :to="{ name: 'desafio', params: { desafioId: d.id } }"
          class="desafio-anchor-card"
          :class="'desafio-anchor-card--' + desafioEstadoClassSuffix(d.estado)"
          :aria-label="`${d.tituloTarjeta}, ${desafioEstadoLabel(d.estado)}. Abrir página.`"
        >
          <h3 class="desafio-anchor-card__title">{{ d.tituloTarjeta }}</h3>
          <span
            class="desafio-anchor-card__badge"
            :class="'desafio-anchor-card__badge--' + desafioEstadoClassSuffix(d.estado)"
          >
            {{ desafioEstadoLabel(d.estado) }}
          </span>
        </RouterLink>
      </div>
    </section>

    <section id="tpi" class="view tpi-view">
      <div class="section-header">
        <p class="kicker">Trabajo práctico integrador - Gaoniters</p>
        <img
          src="/laquebrada/laquebradalogo.png"
          alt="Logo de La Quebrada Sandwichería"
          class="tpi-view__logo"
          width="96"
          height="96"
          loading="lazy"
          decoding="async"
        />
        <div class="tpi-view__title-row">
          <h2>La Quebrada Sandwichería</h2>
          <div class="tpi-view__social-icons" aria-label="Redes sociales de La Quebrada">
            <a
              class="tpi-view__icon-btn"
              :href="laquebradaFacebookUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="La Quebrada en Facebook (se abre en una pestaña nueva)"
            >
              <i class="fa-brands fa-facebook" aria-hidden="true"></i>
            </a>
            <a
              class="tpi-view__icon-btn"
              :href="laquebradaInstagramUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="La Quebrada en Instagram (se abre en una pestaña nueva)"
            >
              <i class="fa-brands fa-instagram" aria-hidden="true"></i>
            </a>
          </div>
        </div>
        <p class="section-subtitle">
          Comercialización de alimentos, especializada en fiambres, lácteos, quesos y panificados con
          opciones mayoristas y minoristas.
        </p>
      </div>

      <div class="tpi-view__grid">
        <div class="tpi-view__col tpi-view__col--about">
          <h3 class="tpi-view__h3">Descripción general</h3>
          <div class="tpi-view__about-fill">
            <div class="tpi-view__about-frame">
              <p class="tpi-view__prose">
                Establecimiento gastronómico dedicado a la elaboración y venta de sándwiches y comidas
                rápidas. Orientada al consumidor local que busca opciones prácticas y al paso, la empresa
                ofrece atención tanto en turnos de mediodía (9:45 a 13:30) como por la tarde/noche (17:30
                a 22:00) de lunes a sábados. Su posición en el mercado es la de un negocio de barrio o pyme
                local bien valorado por sus clientes (cuenta con una excelente calificación de 4.5
                estrellas en Google Maps), compitiendo en el segmento de comidas preparadas para llevar o
                consumir rápidamente.
              </p>
            </div>
          </div>
        </div>
        <div class="tpi-view__col tpi-view__col--map">
          <div class="tpi-view__map-block">
            <h3 class="tpi-view__h3">Ubicación</h3>
            <address class="tpi-view__address">
              Leandro N. Alem Oeste 1625<br />
              Resistencia, Chaco
            </address>
            <div class="tpi-view__map-wrap">
              <iframe
                class="tpi-view__map"
                title="Mapa: La Quebrada Sandwichería, Leandro N. Alem Oeste 1625, Resistencia"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                allowfullscreen
                :src="laquebradaMapsEmbedSrc"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- mandatory snap dejaba ~12px entre el “snap” de TPI y el maxScroll real; esto permite cerrar el peek de Desafíos -->
    <div class="one-page__snap-pad" aria-hidden="true" />
    </main>

    <Teleport to="body">
      <div v-if="morphFlyVisible" class="morph-fly-root" aria-hidden="true">
        <div ref="morphFlyRef" class="morph-fly-frame">
          <img :src="morphFlySrc" alt="" class="morph-fly-img" />
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <Transition
        name="presentation-video-genie"
        :css="false"
        @enter="presentationVideoGenieEnter"
        @leave="presentationVideoGenieLeave"
      >
        <div
          v-if="showPresentationVideo && selectedMember"
          class="presentation-video-root"
          role="dialog"
          aria-modal="true"
          aria-label="Video de presentación"
        >
          <div
            class="presentation-video-backdrop"
            aria-hidden="true"
            @click="closePresentationVideo"
          />
          <button
            type="button"
            class="presentation-video-close"
            title="Cerrar el reproductor de video"
            aria-label="Cerrar el reproductor de video"
            @click="closePresentationVideo"
          >
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
          <div class="presentation-video-genie" @click.stop>
            <div class="presentation-video-inner">
          <div
            v-if="presentationVideoOnlyAudio && !presentationVideoError"
            class="presentation-video-codec-hint"
            role="status"
          >
            <p class="presentation-video-codec-hint__title">Solo se oye el audio</p>
            <p class="presentation-video-codec-hint__text">
              Este navegador no muestra el vídeo de muchos archivos
              <code class="presentation-video-fallback__code">.mov</code>
              (p. ej. HEVC de iPhone o Mac). Exportá una copia en
              <strong>MP4 con códec H.264</strong> y guardala como
              <code class="presentation-video-fallback__code"
                >media/videos/{{ selectedMember.id }}.mp4</code
              >
              (en la web:
              <code class="presentation-video-fallback__code"
                >/videos/{{ selectedMember.id }}.mp4</code
              >). Se intenta primero el MP4 y después el MOV.
            </p>
          </div>
          <video
            v-if="!presentationVideoError"
            :key="selectedMember.id"
            ref="presentationVideoRef"
            class="presentation-video"
            controls
            playsinline
            preload="metadata"
            @error="presentationVideoError = true"
            @loadedmetadata="onPresentationVideoLoadedMetadata"
            @playing="onPresentationVideoPlaying"
          >
            <source
              v-for="s in memberPresentationVideoSources(selectedMember)"
              :key="s.type"
              :src="s.src"
              :type="s.type"
            />
            Tu navegador no reproduce este video embebido.
          </video>
          <div v-else class="presentation-video-fallback">
            <p class="presentation-video-fallback__title">No se pudo cargar el video</p>
            <p class="presentation-video-fallback__hint">
              Colocá al menos uno de estos archivos en
              <code class="presentation-video-fallback__code">media/videos/</code>
              (se sirven como
              <code class="presentation-video-fallback__code">/videos/…</code>):
              <code class="presentation-video-fallback__code">{{ selectedMember.id }}.mp4</code>
              (recomendado, H.264) o
              <code class="presentation-video-fallback__code">{{ selectedMember.id }}.mov</code>.
            </p>
            <button type="button" class="btn-rpa" @click="closePresentationVideo">Cerrar</button>
          </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
