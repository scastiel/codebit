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
  REMOTION_AWS_REGION: z.string().min(1),
  REMOTION_AWS_ACCESS_KEY_ID: z.string().min(1),
  REMOTION_AWS_FUNCTION_NAME: z.string().min(1),
  REMOTION_SERVE_URL: z.string().min(1),
  REMOTION_AWS_SECRET_ACCESS_KEY: z.string().min(1),
  REMOTION_WEBHOOK_SECRET: z.string().min(1),
  RATE_LIMIT_MAX_ITEMS_IN_CACHE: z.coerce.number(),
  RATE_LIMIT_CACHE_ITEM_TTL_IN_MS: z.coerce.number(),
  RATE_LIMIT_RENDER_REQUEST_PER_MINUTE: z.coerce.number(),
})

export const env = envSchema.parse(process.env)
