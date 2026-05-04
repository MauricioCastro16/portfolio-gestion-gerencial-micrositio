import graphGerencial from './nivel-gerencial.graph.json'
import graphOperativoU1 from './nivel-operativo-unidad-1.graph.json'
import graphOperativoU2 from './nivel-operativo-unidad-2.graph.json'
import graphOperativoU3 from './nivel-operativo-unidad-3.graph.json'
import graphTactico from './nivel-tactico.graph.json'
import type { MapaElkGraph } from './elkTypes'
import type { MapaConceptualConfig, MapaNivelId } from './types'

export type { MapaConceptualConfig, MapaNivelId, MapaOperativoUnidadTab } from './types'
export type { MapaElkEdge, MapaElkGraph, MapaElkNode, MapaElkTheme } from './elkTypes'

export const mapasConceptuales: Record<MapaNivelId, MapaConceptualConfig> = {
  'nivel-operativo': {
    id: 'nivel-operativo',
    titulo: 'Nivel operativo',
    graph: graphOperativoU1 as MapaElkGraph,
    operativoUnidades: [
      { id: 'unidad-1', label: 'Unidad 1', graph: graphOperativoU1 as MapaElkGraph },
      { id: 'unidad-2', label: 'Unidad 2', graph: graphOperativoU2 as MapaElkGraph },
      { id: 'unidad-3', label: 'Unidad 3', graph: graphOperativoU3 as MapaElkGraph },
    ],
  },
  'nivel-tactico': {
    id: 'nivel-tactico',
    titulo: 'Nivel táctico',
    graph: graphTactico as MapaElkGraph,
  },
  'nivel-gerencial': {
    id: 'nivel-gerencial',
    titulo: 'Nivel gerencial',
    graph: graphGerencial as MapaElkGraph,
  },
}

export function getMapaConceptual(nivelId: string): MapaConceptualConfig | undefined {
  return mapasConceptuales[nivelId as MapaNivelId]
}

/** Archivos fuente en `src/mapaConceptual/` */
export const mapaArchivoFuente: Record<MapaNivelId, string> = {
  'nivel-operativo': 'nivel-operativo-unidad-{1,2,3}.graph.json',
  'nivel-tactico': 'nivel-tactico.graph.json',
  'nivel-gerencial': 'nivel-gerencial.graph.json',
}
