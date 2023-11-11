import { SigninEmailTemplate } from '@/components/signin-email-template'
import { invitedUsers } from '@/invited-users'
import { getPrisma } from '@/lib/prisma'
import { getResend } from '@/lib/resend'
import { createCustomer } from '@/lib/stripe'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { AuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'

export const authOptions: AuthOptions = {
  providers: [
    // GithubProvider({
    //   clientId: env.GITHUB_CLIENT_ID,
    //   clientSecret: env.GITHUB_SECRET,
    // }),
    EmailProvider({
      from: 'Sebastien Castiel <no-reply@scastiel.dev>',
      async sendVerificationRequest(params) {
        try {
          await getResend().emails.send({
            from: 'no-reply@scastiel.dev',
            to: params.identifier,
            subject: 'Sign in to CodeBit',
            react: <SigninEmailTemplate url={params.url} />,
          })
        } catch (error) {
          console.log({ error })
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email || !invitedUsers.includes(user.email)) {
        return `${process.env.NEXTAUTH_URL}/?not-invited`
      }
      await createCustomer(user.id)
      return true
    },
  },
  adapter: PrismaAdapter(getPrisma()),
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
}
