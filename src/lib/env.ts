import z from 'zod'

const envSchema = z.object({
  VITE_BASE_URL: z.string().url().default('http://localhost:3000'),
  VITE_PLAUSIBLE_DOMAIN: z.string().optional(),
})

export const env = envSchema.parse(import.meta.env)
