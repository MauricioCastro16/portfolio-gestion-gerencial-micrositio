/** Grafo solo lectura para ELK + SVG (`*.graph.json`). */
export type MapaElkNode = {
  id: string
  label: string
  /** 0–7: paleta por distancia al nodo raíz */
  depth: number
}

export type MapaElkEdge = {
  id: string
  source: string
  target: string
}

export type MapaElkTheme = 'operativo' | 'tactico' | 'gerencial'

export type MapaElkGraph = {
  version: 1
  /** Nodo usado por “Raíz” / encuadre inicial */
  rootId: string
  nodes: MapaElkNode[]
  edges: MapaElkEdge[]
  /** Paleta del nodo raíz (depth 0); por defecto operativo */
  theme?: MapaElkTheme
}
