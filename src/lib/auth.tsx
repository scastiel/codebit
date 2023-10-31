import { SigninEmailTemplate } from '@/components/signin-email-template'
import { env } from '@/lib/env'
import { getPrisma } from '@/lib/prisma'
import { getResend } from '@/lib/resend'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { AuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import GithubProvider from 'next-auth/providers/github'

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    EmailProvider({
      from: 'Sebastien Castiel <no-reply@scastiel.dev>',
      async sendVerificationRequest(params) {
        try {
          await getResend().emails.send({
            from: 'no-reply@scastiel.dev',
            to: params.identifier,
            subject: 'Sign in to learn.scastiel.dev',
            react: <SigninEmailTemplate url={params.url} />,
          })
        } catch (error) {
          console.log({ error })
        }
      },
    }),
  ],
  adapter: PrismaAdapter(getPrisma()),
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
}
