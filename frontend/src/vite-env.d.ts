/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Clave de Google Maps Embed API (opcional). Sin ella se usa iframe de consulta clásica. */
  readonly VITE_GOOGLE_MAPS_EMBED_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.md?raw' {
  const src: string
  export default src
}

declare module '*.mmd?raw' {
  const src: string
  export default src
}
