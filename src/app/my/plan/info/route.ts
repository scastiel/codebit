import { getActiveUserSubscription, getCurrentUser } from '@/lib/user'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await getCurrentUser()
  const subscription = await getActiveUserSubscription(user.id)
  if (!user.stripeCustomerId) throw new Error('No Stripe customer ID')
  return NextResponse.json({
    stripeCustomerId: user.stripeCustomerId,
    currentPlanId: subscription?.planId ?? 'free',
    subscriptionId: subscription?.id ?? null,
    subscriptionEndDate: subscription?.endDate?.toISOString() ?? null,
    subscriptionInterval: subscription?.interval.toLowerCase(),
  })
}
