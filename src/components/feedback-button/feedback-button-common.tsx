import { z } from 'zod'

export const formSchema = z.object({
  message: z.string().min(10, 'Please enter at least 10 characters.').max(5000),
})
