import beneyto from './beneyto.md?raw'
import castro from './castro.md?raw'
import cocito from './cocito.md?raw'
import nadine from './nadine.md?raw'

/** Markdown por integrante; cada persona edita su propio `.md` en esta carpeta. */
export const rpaMarkdownByMemberId: Record<string, string> = {
  castro,
  nadine,
  beneyto,
  cocito,
}

export function getRpaMarkdown(memberId: string): string | undefined {
  return rpaMarkdownByMemberId[memberId]
}
