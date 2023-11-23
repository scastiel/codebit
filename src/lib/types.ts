import { z } from 'zod'

export type Steps = { lang: string; code: string; filename?: string }[]

export const metadataSchema = z.object({
  background: z.number().min(0).optional().default(36263),
  animatedBackground: z.boolean().optional().default(true),
  speed: z.number().min(0.2).max(5).optional().default(1),
  watermark: z.boolean().optional().default(true),
  zooming: z.boolean().optional().default(true),
  highlightTheme: z.string().optional().default('github-dark'),
  font: z.string().optional().default('GeistMono'),
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
  | {
      type: 'too-long-video'
      durationInSeconds: number
      maxDurationInSeconds: number
    }
  | { type: 'required-watermark' }
  | { type: 'forbidden-multifile'; filenames: string[] }
  | { type: 'invalid-theme'; theme: string }
  | { type: 'invalid-font'; font: string }

export type SnippetParsingResult = {
  steps: Steps
  metadata: Metadata
  warnings: Warning[]
}
