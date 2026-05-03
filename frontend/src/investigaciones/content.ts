import unidad1 from './unidad-1.md?raw'

const markdownById: Record<string, string> = {
  'unidad-1': unidad1,
}

export type InvestigacionId = keyof typeof markdownById

export function getInvestigacionMarkdown(id: string): string | undefined {
  return markdownById[id]
}

export function isInvestigacionId(id: string): id is InvestigacionId {
  return id in markdownById
}
