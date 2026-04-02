export type DesafioId = '3' | '4' | '5' | '6' | '7'

export type DesafioEstado = 'pendiente' | 'en proceso' | 'terminado'

export type DesafioMeta = {
  id: DesafioId
  tabLabel: string
  tituloPagina: string
  tituloTarjeta: string
  estado: DesafioEstado
}

export const DESAFIOS: readonly DesafioMeta[] = [
  {
    id: '3',
    tabLabel: 'Desafío 3',
    tituloPagina: 'Desafío 3 — Portfolio (micrositio)',
    tituloTarjeta: 'Desafío 3',
    estado: 'terminado',
  },
  {
    id: '4',
    tabLabel: 'Desafío 4',
    tituloPagina: 'Desafío 4',
    tituloTarjeta: 'Desafío 4',
    estado: 'pendiente',
  },
  {
    id: '5',
    tabLabel: 'Desafío 5',
    tituloPagina: 'Desafío 5',
    tituloTarjeta: 'Desafío 5',
    estado: 'pendiente',
  },
  {
    id: '6',
    tabLabel: 'Desafío 6',
    tituloPagina: 'Desafío 6',
    tituloTarjeta: 'Desafío 6',
    estado: 'pendiente',
  },
  {
    id: '7',
    tabLabel: 'Desafío 7',
    tituloPagina: 'Desafío 7',
    tituloTarjeta: 'Desafío 7',
    estado: 'pendiente',
  },
] as const

const ESTADO_LABEL: Record<DesafioEstado, string> = {
  pendiente: 'Pendiente',
  'en proceso': 'En proceso',
  terminado: 'Terminado',
}

export function desafioEstadoLabel(estado: DesafioEstado): string {
  return ESTADO_LABEL[estado]
}

/** Sufijo de clase BEM: `desafio-anchor-card--${suffix}` */
export function desafioEstadoClassSuffix(estado: DesafioEstado): string {
  return estado === 'en proceso' ? 'en-proceso' : estado
}

export function getDesafioMeta(id: string): DesafioMeta | undefined {
  return DESAFIOS.find((d) => d.id === id)
}

export function isDesafioId(id: string): id is DesafioId {
  return (DESAFIOS as readonly DesafioMeta[]).some((d) => d.id === id)
}
