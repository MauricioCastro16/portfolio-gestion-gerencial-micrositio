# Lineamientos para trabajo asistido por IA

Este documento resume convenciones y decisiones del **micrositio** para que cualquier IA (o persona) mantenga el proyecto **coherente** con lo ya implementado. Convive con `consigna.md` (requisitos académicos); este archivo es **técnico y de producto**.

---

## Stack y arranque

- **Frontend**: Vue 3 (Composition API, `<script setup lang="ts">`), Vite 8, TypeScript.
- **Entrada**: `frontend/src/main.ts` monta `App.vue` e importa **`style.css` global** (no hay CSS modules por defecto).
- **Build**: `npm run build` en `frontend/` ejecuta `vue-tsc -b && vite build`; no dejar errores de tipo.
- Hay dependencias de **vue-router** y **axios** en `package.json`; la app actual es **one-page** en `App.vue`. No asumir rutas ni API salvo que el código las use.

---

## Estructura de carpetas relevante

- `frontend/src/App.vue`: casi toda la UI, datos del equipo, morph, precarga de imágenes.
- `frontend/src/style.css`: estilos globales, variables `:root`, layout de secciones, equipo, loader.
- `frontend/public/`: estáticos servidos en la raíz (`/favicon.svg`, etc.). **Fotos de equipo**: rutas usadas en código como `/perfil/*.png` y `/avatares/*.png` (deben existir bajo `public/perfil` y `public/avatares` cuando se commiteen los assets).

---

## Idioma y textos de interfaz

- Contenido visible al usuario en **español**.
- En el código actual muchos textos siguen **ortografía sin tildes** en palabras como “Seccion”, “imagenes”, “Gestion”, “Planeamiento estrategico”, etc. **Mantener el mismo criterio** dentro del mismo bloque de UI; si se unifica todo a ortografía con tildes, hacerlo de forma **explícita y completa** en una sola pasada, no mezclar.

---

## Layout de página única y scroll

- El scroll vive en **`.one-page`** (`overflow-y: auto`), no en `body` (`body` tiene `overflow: hidden`).
- **`scroll-snap-type: y mandatory`** en `.one-page` y **`scroll-snap-align: start`** en `.view`: cada bloque es una “pantalla”.
- **Regla crítica**: la sección **equipo** (`.team-view`) está **fijada a exactamente una altura de viewport** (`100svh` / `100dvh` con fallback `100vh`) y `overflow: hidden`, para que el área de snap **no sea más alta que la vista**. Si se agrega contenido vertical ahí, hay que **redistribuir dentro** (flex, tamaños) o se rompe el comportamiento simétrico del snap.
- Navegación entre secciones: `scrollIntoView` suave desde botones (`goToSection`).

---

## Sección equipo (grid + detalle)

- Datos en el array **`teamMembers`**: `id`, `name`, `profileSrc`, `avatarSrc`, `competencies[]`.
- **Desktop (≥681px)** con soporte de **container queries**: grid 2×2 con columnas/filas **`auto`** y ancho de tarjeta derivado de **`min(cqh, cqw)`** para centrar el bloque y evitar tarjetas “dispersas”.
- **≤680px**: layout distinto del panel de detalle (flex column, tarjeta apilada); respetar los overrides en `@media (max-width: 680px)`.
- Al seleccionar un integrante, las demás tarjetas usan **`.slide-out-right`**: solo **desvanecido en el lugar** (`opacity: 0`, sin `translateX`). La animación de **vuelta** al listado se apoya en las mismas transiciones de opacidad.
- El **morph** de la foto usa **`Teleport` a `body`** y posición `fixed` para no recortar por `overflow` de contenedores; no mover eso a un contenedor con `overflow: hidden` sin revisar el flujo.

---

## Estilos (CSS)

- **Variables globales** en `:root` (`--bg`, `--text`, `--primary`, `--section-pad-y`, safe areas, etc.): reutilizarlas antes de inventar colores nuevos.
- **Breakpoints** habituales en el proyecto: **680px** (móvil equipo / detalle), **960px** (tablet / ajustes de panel).
- **Container queries** (`@supports (container-type: size)`): `.team-experience` es el contenedor; cambios en tamaño de tarjetas deben seguir pensando en **cqh/cqw** y `--team-grid-gap`.
- Coherencia visual: dark theme, bordes suaves, botones pill ya definidos (`.btn`, `.btn-primary`, `.btn-secondary`).

---

## Imágenes y precarga

- Al **añadir** integrantes o nuevas rutas de imagen: actualizar **`teamMembers`** y asegurarse de que **`collectTeamImageUrls`** las incluya (hoy recorre `profileSrc` y `avatarSrc` de cada miembro).
- El overlay **“Cargando imagenes del equipo…”** espera esa precarga (con **timeout** de seguridad). Si se añaden assets críticos fuera de `teamMembers`, habría que **extender** la lista de URLs precargadas.
- Fallo de carga de una imagen **no debe bloquear** el sitio (patrón actual: `onerror` → continuar).

---

## TypeScript y Vue

- Tipar datos (p. ej. `TeamMember`) y funciones públicas con tipos explícitos donde ya se hace (`: void`, refs tipados).
- **Refs a DOM**: comprobar `instanceof HTMLElement` al asignar desde callbacks de template ref.
- Cuidado con **`Promise.race` / `Promise.all`**: el tipo de retorno debe ser **`Promise<void>`** si la función lo declara así (evitar `void | void[]` sin normalizar).

---

## Accesibilidad y semántica

- Secciones con **`id`** para anclas (`inicio`, `equipo`, `proximas-secciones`).
- Botones reales **`<button type="button">`** para acciones que no envían formulario.
- Estados de carga: **`role="status"`**, **`aria-live="polite"`**, **`aria-busy`** en el loader donde aplique.
- Imágenes con **`alt`** significativo; morph/vuelo puede usar `alt=""` si es puramente decorativo.

---

## Alcance de cambios (criterio general)

- Preferir **cambios mínimos** alineados al pedido; no refactorizar de paso salvo que sea necesario.
- No añadir **documentación extra** (README, md) salvo que el usuario la pida; este archivo es la excepción acordada.
- Tras cambios sustanciales en UI o tipos, correr **`npm run build`** en `frontend/`.

---

## Referencia rápida de archivos

| Qué tocar | Dónde |
|-----------|--------|
| Textos, equipo, morph, precarga | `frontend/src/App.vue` |
| Layout global, secciones, equipo, loader | `frontend/src/style.css` |
| HTML shell, meta, título | `frontend/index.html` |
| Requisitos del trabajo práctico | `consigna.md` |

Si una modificación entra en conflicto con **scroll-snap** o con la **altura fija de `.team-view`**, documentar en el PR/commit el motivo o ajustar el layout para conservar el comportamiento acordado.
