# Lineamientos para trabajo asistido por IA

Este documento resume convenciones y decisiones del **micrositio** para que cualquier IA (o persona) mantenga el proyecto **coherente** con lo ya implementado. Convive con `consigna.md` (requisitos académicos) y con `README.md` en la raíz (visión de producto e instalación); este archivo es **técnico y de mantenimiento**.

---

## Stack y arranque

- **Frontend**: Vue 3 (Composition API, `<script setup lang="ts">`), Vite 8, TypeScript, **Vue Router** (historial HTML5).
- **Entrada**: `frontend/src/main.ts` monta `App.vue`, registra el router e importa **`style.css` global** y estilos de **Font Awesome** (`@fortawesome/fontawesome-free`); no hay CSS modules por defecto.
- **Markdown en cliente**: **Marked** para páginas de desafío y RPA; **mapas conceptuales** con **elkjs** y grafos **JSON** en `mapaConceptual/`.
- **HTTP**: **axios** figura en `package.json`; en el código bajo `frontend/src` **no hay imports** hoy. No asumir llamadas a API hasta que existan.
- **Build**: `npm run build` en `frontend/` ejecuta `vue-tsc -b && vite build`; no dejar errores de tipo.

---

## Estáticos y carpeta `media/`

- En `frontend/vite.config.ts`, **`publicDir` apunta a `../media`**: lo que está en la carpeta **`media/`** del repositorio se sirve en la raíz del sitio (`/videos/...`, `/perfil/...`, `/isologo.png`, etc.). **No** depender de `frontend/public` salvo que se cambie esa configuración.
- **Videos de presentación** por integrante: rutas lógicas `/videos/{id}.mp4` y `/videos/{id}.mov`; en código se prioriza **MP4 H.264** y luego `.mov` (mucho HEVC solo reproduce audio en Chrome/Edge).
- Fotos de equipo: rutas como `/perfil/*.png` y `/avatares/*.png` deben existir bajo **`media/perfil`** y **`media/avatares`** cuando se versionen los assets.

---

## Enrutamiento y vistas

- **Shell**: `frontend/src/App.vue` — barra de navegación superior, **`RouterView`** con transición `page-view`, precarga global de imágenes del equipo + logo, overlay de carga (`assetsReady` vía `provide`/`inject`).
- **Rutas** (`frontend/src/router/index.ts`):
  - `/` → `HomeView` (micrositio principal con scroll por secciones).
  - `/rpa/:memberId` → `RpaMemberView` (Markdown RPA por integrante).
  - `/mapa/:nivelId` → `MapaConceptualView` (diagramas por nivel).
  - `/desafio/:desafioId` → `DesafioView` (Markdown del desafío 3–7).
- **Anclas desde el header**: `router.push({ path: '/', hash: '#...' })` hacia secciones en la home. **`scrollBehavior`**: con `hash` y ruta `home` devuelve `false` porque el scroll real vive en **`<main class="one-page">`** dentro de `HomeView`.
- **Contenido desafíos**: archivos `frontend/src/desafios/desafio-*.md` importados en `desafios/content.ts`; metadatos y estados en **`desafios/config.ts`** (`DESAFIOS`, tipos `DesafioId`, etc.).
- **RPA**: un `.md` por persona en `frontend/src/rpa/` registrado en **`rpa/index.ts`** (`rpaMarkdownByMemberId`).
- **Mapas conceptuales**: definiciones en `frontend/src/mapaConceptual/` (`*.graph.json` + `index.ts` / `types.ts` / `elkTypes.ts`). Regenerar desde `public/mapa/unidad1.xml` … `unidad3.xml` con `node scripts/generate-unidad1-graph-from-xml.mjs` (y análogos `unidad2`, `unidad3`).

---

## Estructura de carpetas relevante

| Área | Ubicación |
|------|-----------|
| Navegación global, precarga, `RouterView` | `frontend/src/App.vue` |
| Home, equipo, hero, desafíos, modal de video | `frontend/src/views/HomeView.vue` |
| Rutas | `frontend/src/router/index.ts` |
| Miembros, tipos, vídeos, `collectTeamImageUrls` | `frontend/src/teamMembers.ts` |
| Precarga de imágenes | `frontend/src/utils/preload.ts` |
| Estilos globales, modal de video, layout | `frontend/src/style.css` |
| Logo empaquetado por Vite | `frontend/src/assets/logo.png` |

---

## Idioma y textos de interfaz

- Contenido visible al usuario en **español**.
- En el código actual muchos textos siguen **ortografía sin tildes** en palabras como “Seccion”, “imagenes”, “Gestion”, “Planeamiento estrategico”, etc. **Mantener el mismo criterio** dentro del mismo bloque de UI; si se unifica todo a ortografía con tildes, hacerlo de forma **explícita y completa** en una sola pasada, no mezclar.

---

## Layout de la home y scroll

- El scroll vertical vive en **`.one-page`** dentro de **`HomeView`** (`overflow-y: auto`), no en `body` (`body` mantiene `overflow: hidden` donde así esté definido).
- **`scroll-snap-type: y mandatory`** en `.one-page` y **`scroll-snap-align: start`** en `.view`: cada bloque principal actúa como “pantalla”.
- **Regla crítica**: la sección **equipo** (`.team-view`) está **fijada a una altura de viewport** (`100svh` / `100dvh` con fallback `100vh`) y `overflow: hidden`, para que el área de snap **no supere la vista**. Si se agrega contenido vertical ahí, hay que **redistribuir dentro** (flex, tamaños) o se altera el snap.
- **IDs de sección** en la home: `inicio`, `equipo`, `mapa-conceptual`, `desafios`; tarjetas de desafío usan `desafio-{id}`.

---

## Sección equipo (grid + detalle + video)

- Datos en **`teamMembers`** (`frontend/src/teamMembers.ts`): `id`, `name`, `givenName`, `familyName`, `profileSrc`, `avatarSrc`, `competencies[]`.
- **Desktop (≥681px)** con **container queries**: grid 2×2 con columnas/filas **`auto`** y ancho de tarjeta derivado de **`min(cqh, cqw)`** para centrar el bloque.
- **≤680px**: layout distinto del panel de detalle; revisar overrides en `@media (max-width: 680px)` (incluye **z-index** de avatar vs tarjeta donde aplique).
- Al seleccionar un integrante, las demás tarjetas usan **`.slide-out-right`**: solo **desvanecido en el lugar** (`opacity: 0`, sin `translateX`).
- El **morph** de la foto usa **`Teleport` a `body`** y posición `fixed`; no moverlo a un contenedor con `overflow: hidden` sin revisar el recorte.
- **Modal de video**: animación pensada para **compositor barato** (principalmente `transform` + `opacity`, sin blur ni `rotateX` en la transición principal; backdrop con blur moderado). Evitar reintroducir filtros costosos en la animación sin medir rendimiento.

---

## Estilos (CSS)

- **Variables globales** en `:root` (`--bg`, `--text`, `--primary`, `--section-pad-y`, safe areas, etc.): reutilizarlas antes de inventar colores nuevos.
- **Breakpoints** habituales: **680px** (móvil equipo / detalle), **960px** (tablet / panel).
- **Container queries** (`@supports (container-type: size)`): `.team-experience` es el contenedor; cambios en tarjetas deben considerar **cqh/cqw** y `--team-grid-gap`.
- Coherencia visual: dark theme, bordes suaves, botones pill (`.btn`, `.btn-primary`, `.btn-secondary`).

---

## Imágenes y precarga

- Al **añadir** integrantes o rutas de imagen: actualizar **`teamMembers`** y **`collectTeamImageUrls`** (en `teamMembers.ts`); **`App.vue`** ya concatena esas URLs con el logo importado para **`preloadImages`**.
- El overlay de carga espera esa precarga (con **timeout** de seguridad en `preload.ts`). Si se añaden assets críticos fuera de `teamMembers`, **extender** la lista de URLs precargadas.
- Fallo de carga de una imagen **no debe bloquear** el sitio (patrón con `onerror` → continuar).

---

## TypeScript y Vue

- Tipar datos (`TeamMember`, tipos de desafío/mapa) y funciones públicas con tipos explícitos donde ya se hace.
- **Refs a DOM**: comprobar `instanceof HTMLElement` al asignar desde callbacks de template ref.
- Cuidado con **`Promise.race` / `Promise.all`**: el tipo de retorno debe alinearse con la firma declarada (evitar `void | void[]` sin normalizar).
- **`v-html`**: solo con Markdown ya generado por **Marked** en flujos controlados (desafío/RPA); no inyectar HTML arbitrario de fuentes no confiables.

---

## Accesibilidad y semántica

- Secciones con **`id`** para anclas en la home (ver lista arriba).
- Botones **`<button type="button">`** para acciones que no envían formulario; enlaces internos con **`RouterLink`** donde corresponda.
- Estados de carga: **`role="status"`**, **`aria-live`**, **`aria-busy`** en el loader donde aplique.
- Imágenes con **`alt`** significativo; elementos decorativos pueden usar `alt=""`.
- Navegación e iconos: atributos **`title`** / **`aria-label`** donde ya se usan en la barra superior.

---

## Alcance de cambios (criterio general)

- Preferir **cambios mínimos** alineados al pedido; no refactorizar de paso salvo que sea necesario.
- **Documentación**: `README.md` (raíz) y este archivo son referencias explícitas; no añadir otros `.md` de documentación salvo petición.
- Tras cambios sustanciales en UI o tipos, correr **`npm run build`** en `frontend/`.

---

## Referencia rápida de archivos

| Qué tocar | Dónde |
|-----------|--------|
| Rutas y scroll global al cambiar de página | `frontend/src/router/index.ts` |
| Nav superior, precarga, contenedor de vistas | `frontend/src/App.vue` |
| Home, equipo, desafíos, hero, video | `frontend/src/views/HomeView.vue` |
| Desafío individual (Markdown) | `frontend/src/views/DesafioView.vue`, `frontend/src/desafios/*` |
| RPA por integrante | `frontend/src/views/RpaMemberView.vue`, `frontend/src/rpa/*` |
| Mapa conceptual | `frontend/src/views/MapaConceptualView.vue`, `frontend/src/mapaConceptual/*` |
| Datos del equipo y vídeos | `frontend/src/teamMembers.ts` |
| Layout global, equipo, modal de video, páginas secundarias | `frontend/src/style.css` |
| Origen de estáticos (`/videos`, `/perfil`, …) | `media/` + `frontend/vite.config.ts` (`publicDir`) |
| HTML shell, meta, título | `frontend/index.html` |
| Requisitos académicos | `consigna.md` |

Si una modificación entra en conflicto con **scroll-snap** o con la **altura fija de `.team-view`**, documentar en el commit el motivo o ajustar el layout para conservar el comportamiento acordado.
