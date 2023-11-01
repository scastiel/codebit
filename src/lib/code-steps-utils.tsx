import fm from 'front-matter'
import { Metadata, Steps, metadataSchema } from '../lib/types'

export function getCodeFragments(markdown: string): {
  steps: Steps
  metadata: Metadata
} {
  const { attributes, body } = fm(markdown)
  const metadataParseResult = metadataSchema.safeParse(attributes)
  const metadata: Metadata = metadataParseResult.success
    ? metadataParseResult.data
    : metadataSchema.parse({})
  const steps = body.split(/\n+---\n+/).map((page) => {
    const [, lang, code] = page.match(/```([^\n]*)\n(.*)```/s) ?? []
    return { lang, code }
  })
  return { steps, metadata }
}
