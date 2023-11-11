import { authOptions } from '@/lib/auth'
import { getPrisma } from '@/lib/prisma'
import { Subscription, User } from '@prisma/client'
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

export async function getActiveUserSubscription(userId: User['id']): Promise<Subscription | null> {
  const now = new Date()
  return getPrisma().subscription.findFirst({
    where: {
      AND: [
        { userId, startDate: { lt: now } },
        { OR: [{ endDate: null }, { endDate: { gt: now } }] },
      ],
    },
    orderBy: { startDate: 'desc' },
  })
}

export async function getActiveUserPlanId(userId: User['id']): Promise<string> {
  const subscription = await getActiveUserSubscription(userId)
  return subscription?.planId ?? 'free'
}

export async function getUserByStripeCustomerId(stripeCustomerId: string) {
  return getPrisma().user.findFirst({ where: { stripeCustomerId } })
}

export function hasRemainingCredits(user: User) {
  return user.monthlyRemainingCredits > 0
}
