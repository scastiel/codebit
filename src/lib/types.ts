import { z } from 'zod'

export type Steps = { lang: string; code: string }[]

export const metadataSchema = z.object({
  theme: z.enum(['dark', 'light']).optional().default('dark'),
})

export type Metadata = z.infer<typeof metadataSchema>
