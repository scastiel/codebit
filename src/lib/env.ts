import z from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_SECRET: z.string().min(1),
  ADMIN_AUTH_IDS: z
    .string()
    .optional()
    .transform((s) => s?.split(',') ?? []),
  RESEND_API_KEY: z.string().min(1),
})

export const env = envSchema.parse(process.env)
