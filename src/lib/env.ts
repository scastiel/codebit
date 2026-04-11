import z from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
})

export const env = envSchema.parse(process.env)
