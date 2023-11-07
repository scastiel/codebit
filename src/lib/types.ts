import { z } from 'zod'

export type Steps = { lang: string; code: string }[]

export const metadataSchema = z.object({
  theme: z.enum(['dark', 'light']).optional().default('dark'),
  background: z.number().min(0).optional().default(36263),
  speed: z.number().min(0.2).max(5).optional().default(1),
})

export type Metadata = z.infer<typeof metadataSchema>

export type Warning =
  | { line: number; type: 'step-already-has-code'; stepIndex: number }
  | { line: number; type: 'step-has-no-code'; afterStepIndex: number }
  | {
      line: number
      type: 'unsupported-content'
      contentType: string
      stepIndex: number
    }
  | { line: 1; type: 'invalid-metadata'; message: string; property: string }
  | { line: 1; type: 'frontmatter-error' }

export type SnippetParsingResult = {
  steps: Steps
  metadata: Metadata
  warnings: Warning[]
}
