export type MapaNivelId = 'nivel-operativo' | 'nivel-tactico' | 'nivel-gerencial'

export type MapaConceptualConfig = {
  /** Identificador de ruta (`/mapa/:nivelId`) */
  id: MapaNivelId
  titulo: string
  /** Definición Mermaid (archivo `.mmd` importado con `?raw`) */
  mermaid: string
}
