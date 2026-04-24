import { leadershipIaPrompts } from './leadershipIaPrompts'

export type TeamMember = {
  id: string
  name: string
  givenName: string
  familyName: string
  profileSrc: string
  avatarSrc: string
  competencies: string[]
  /** Inicio de la intervención de esta persona en el video grupal (`/videos/Gaoniters.mp4`). */
  presentationOffsetSec: number
  /** Ilustración de liderazgo generada con IA (`publicDir` → `/ia/`). */
  leadershipIaSrc: string
  leadershipIaPrompt: string
}

export const teamMembers: TeamMember[] = [
  {
    id: 'castro',
    name: 'Mauricio Castro',
    givenName: 'Mauricio',
    familyName: 'Castro',
    presentationOffsetSec: 71,
    profileSrc: '/perfil/castro.png',
    avatarSrc: '/avatares/castro.png',
    leadershipIaSrc: '/ia/castro.png',
    leadershipIaPrompt: leadershipIaPrompts.castro,
    competencies: [
      'Arquitectura de Software y Desarrollo Multiplataforma',
      'Visión Artificial e Innovación Tecnológica',
      'Análisis Estratégico Empresarial y Gestión Gerencial',
      'Pensamiento Analítico y Resolución de Problemas Complejos',
      'Trabajo Colaborativo en Equipo',
      'Aprendizaje Autodidacta y Adaptabilidad',
      'Liderazgo de Proyectos Científico-Tecnológicos'
    ]
  },
  {
    id: 'nadine',
    name: 'Nadine Peralta Ruiz',
    givenName: 'Nadine',
    familyName: 'Peralta Ruiz',
    presentationOffsetSec: 224,
    profileSrc: '/perfil/nadine.png',
    avatarSrc: '/avatares/nadine.png',
    leadershipIaSrc: '/ia/nadine.png',
    leadershipIaPrompt: leadershipIaPrompts.nadine,
    competencies: [
      'Organización y planificación de tareas en proyectos',
      'Diseño y modelado de sistemas',
      'Resolución de problemas y toma de decisiones',
      'Manejo de bases de datos',
      'Trabajo en equipo en entornos tecnológicos',
      'Responsabilidad, organización y positivismo',
    ],
  },
  {
    id: 'beneyto',
    name: 'Mateo Beneyto',
    givenName: 'Mateo',
    familyName: 'Beneyto',
    presentationOffsetSec: 5,
    profileSrc: '/perfil/beneyto.png',
    avatarSrc: '/avatares/beneyto.png',
    leadershipIaSrc: '/ia/beneyto.png',
    leadershipIaPrompt: leadershipIaPrompts.beneyto,
    competencies: [
      'Resolución de Problemas Analíticos',
      'Trabajo en Equipo Colaborativo',
      'Gestión y Ejecución de Proyectos',
      'Pensamiento Lógico y Computacional',
      'Adaptabilidad Tecnológica',
      'Aprendizaje Continuo y Autogestión',
      'Comunicación Efectiva',
      'Organización y Gestión del Tiempo',
    ],
  },
  {
    id: 'cocito',
    name: 'Maximiliano Cocito',
    givenName: 'Maximiliano',
    familyName: 'Cocito',
    presentationOffsetSec: 127,
    profileSrc: '/perfil/cocito.png',
    avatarSrc: '/avatares/cocito.png',
    leadershipIaSrc: '/ia/cocito.png',
    leadershipIaPrompt: leadershipIaPrompts.cocito,
    competencies: ['Desarrollo de software', 'Análisis y modelado de sistemas', 'Resolución de problemas', 'Liderazgo y trabajo en equipo', 'Toma de decisiones', 'Pensamiento estratégico', 'Proactividad', 'Mejora continua', 'Innovación'
],
  },
]

export function collectTeamImageUrls(members: TeamMember[], extra: string[] = []): string[] {
  const seen = new Set<string>(extra)
  for (const m of members) {
    seen.add(m.profileSrc)
    seen.add(m.avatarSrc)
    seen.add(m.leadershipIaSrc)
  }
  return [...seen]
}
