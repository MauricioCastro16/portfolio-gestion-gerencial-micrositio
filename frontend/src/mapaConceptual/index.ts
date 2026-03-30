import mermaidGerencial from './nivel-gerencial.mmd?raw'
import mermaidOperativo from './nivel-operativo.mmd?raw'
import mermaidTactico from './nivel-tactico.mmd?raw'
import type { MapaConceptualConfig, MapaNivelId } from './types'

export type { MapaConceptualConfig, MapaNivelId } from './types'

export const mapasConceptuales: Record<MapaNivelId, MapaConceptualConfig> = {
  'nivel-operativo': {
    id: 'nivel-operativo',
    titulo: 'Nivel operativo',
    mermaid: mermaidOperativo,
  },
  'nivel-tactico': {
    id: 'nivel-tactico',
    titulo: 'Nivel táctico',
    mermaid: mermaidTactico,
  },
  'nivel-gerencial': {
    id: 'nivel-gerencial',
    titulo: 'Nivel gerencial',
    mermaid: mermaidGerencial,
  },
}

export function getMapaConceptual(nivelId: string): MapaConceptualConfig | undefined {
  return mapasConceptuales[nivelId as MapaNivelId]
}

/** Nombre del archivo en `src/mapaConceptual/` para mostrar en la UI. */
export const mapaArchivoFuente: Record<MapaNivelId, string> = {
  'nivel-operativo': 'nivel-operativo.mmd',
  'nivel-tactico': 'nivel-tactico.mmd',
  'nivel-gerencial': 'nivel-gerencial.mmd',
}
