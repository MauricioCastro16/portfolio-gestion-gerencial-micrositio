export type TeamMember = {
  id: string
  name: string
  givenName: string
  familyName: string
  profileSrc: string
  avatarSrc: string
  competencies: string[]
}

export const teamMembers: TeamMember[] = [
  {
    id: 'castro',
    name: 'Mauricio Castro',
    givenName: 'Mauricio',
    familyName: 'Castro',
    profileSrc: '/perfil/castro.png',
    avatarSrc: '/avatares/castro.png',
    competencies: ['Liderazgo colaborativo', 'Planeamiento estrategico', 'Gestion de proyectos'],
  },
  {
    id: 'nadine',
    name: 'Nadine Peralta Ruiz',
    givenName: 'Nadine',
    familyName: 'Peralta Ruiz',
    profileSrc: '/perfil/nadine.png',
    avatarSrc: '/avatares/nadine.png',
    competencies: ['Analisis de procesos', 'Comunicacion efectiva', 'Documentacion funcional'],
  },
  {
    id: 'beneyto',
    name: 'Mateo Beneyto',
    givenName: 'Mateo',
    familyName: 'Beneyto',
    profileSrc: '/perfil/beneyto.png',
    avatarSrc: '/avatares/beneyto.png',
    competencies: ['Automatizacion digital', 'Resolucion de problemas', 'Trabajo en equipo'],
  },
  {
    id: 'cocito',
    name: 'Maximiliano Cocito',
    givenName: 'Maximiliano',
    familyName: 'Cocito',
    profileSrc: '/perfil/cocito.png',
    avatarSrc: '/avatares/cocito.png',
    competencies: ['Pensamiento analitico', 'Mejora continua', 'Enfoque en resultados'],
  },
]

export type PresentationVideoSource = { src: string; type: string }

/**
 * Fuentes en orden: primero MP4 H.264 (compatible en la web), luego .mov.
 * Muchos .mov (p. ej. HEVC de iPhone/Mac) reproducen solo el audio en Chrome/Edge.
 */
export function memberPresentationVideoSources(member: TeamMember): PresentationVideoSource[] {
  const id = member.id
  return [
    { src: `/videos/${id}.mp4`, type: 'video/mp4' },
    { src: `/videos/${id}.mov`, type: 'video/quicktime' },
  ]
}

export function collectTeamImageUrls(members: TeamMember[], extra: string[] = []): string[] {
  const seen = new Set<string>(extra)
  for (const m of members) {
    seen.add(m.profileSrc)
    seen.add(m.avatarSrc)
  }
  return [...seen]
}
