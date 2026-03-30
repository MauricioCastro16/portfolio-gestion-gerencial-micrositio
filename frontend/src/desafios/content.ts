import type { DesafioId } from './config'
import desafio3 from './desafio-3.md?raw'
import desafio4 from './desafio-4.md?raw'
import desafio5 from './desafio-5.md?raw'
import desafio6 from './desafio-6.md?raw'
import desafio7 from './desafio-7.md?raw'

const byId: Record<DesafioId, string> = {
  '3': desafio3,
  '4': desafio4,
  '5': desafio5,
  '6': desafio6,
  '7': desafio7,
}

export function getDesafioMarkdown(id: DesafioId): string {
  return byId[id] ?? ''
}
