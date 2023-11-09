import { authOptions } from '@/lib/auth'
import { User } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export async function getCurrentUserSafe(): Promise<User | null> {
  return (await getServerSession({
    ...authOptions,
    callbacks: {
      session: (session) => session.user,
    },
  })) as User | null
}

export async function getCurrentUser(): Promise<User> {
  const user = await getCurrentUserSafe()
  if (!user) throw new Error('Not authenticated')
  return user
}

export async function isLoggedIn(): Promise<boolean> {
  const user = await getCurrentUserSafe()
  return user !== null
}

export async function getCurrentUserOrRedirect(url: string) {
  const user = await getCurrentUserSafe()
  if (!user) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(url)}`)
  }
  return user
}

export async function getUserPlanId(userId: User['id']): Promise<string> {
  // TODO
  return 'premium'
}
