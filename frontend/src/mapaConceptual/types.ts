import type { MapaElkGraph } from './elkTypes'

export type MapaNivelId = 'nivel-operativo' | 'nivel-tactico' | 'nivel-gerencial'

/** Pestañas del mapa operativo (unidad 1 / 2 / 3). */
export type MapaOperativoUnidadTab = {
  id: string
  label: string
  graph: MapaElkGraph
}

export type MapaConceptualConfig = {
  /** Identificador de ruta (`/mapa/:nivelId`) */
  id: MapaNivelId
  titulo: string
  /** Grafo ELK (solo lectura), ver `*.graph.json` */
  graph: MapaElkGraph
  /**
   * Nivel operativo: un grafo por unidad.
   * Si está definido, la vista muestra pestañas y usa estas fuentes en lugar de `graph` base.
   */
  operativoUnidades?: MapaOperativoUnidadTab[]
}
