import { createCustomer } from '@/lib/stripe'
import { getActiveUserSubscription, getCurrentUser } from '@/lib/user'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await getCurrentUser()
  const subscription = await getActiveUserSubscription(user.id)
  await createCustomer(user)
  return NextResponse.json({
    stripeCustomerId: user.stripeCustomerId,
    currentPlanId: subscription?.planId ?? 'free',
    subscriptionId: subscription?.id ?? null,
    subscriptionEndDate: subscription?.endDate?.toISOString() ?? null,
    subscriptionInterval: subscription?.interval.toLowerCase(),
    monthlyRemainingCredits: user.monthlyRemainingCredits,
  })
}
