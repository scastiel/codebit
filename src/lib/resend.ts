import { env } from '@/lib/env'
import { Resend } from 'resend'

export const getResend = () => new Resend(env.RESEND_API_KEY)
