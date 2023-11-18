import { env } from '@/lib/env'
import { getPlan } from '@/lib/plans'
import { getPrisma } from '@/lib/prisma'
import { getProductById, stripe } from '@/lib/stripe'
import { getUserByStripeCustomerId } from '@/lib/user'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''

  let event

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  if (event.type === 'customer.subscription.created') {
    const subscription = event.data.object as Stripe.Subscription
    const user = await getUserByStripeCustomerId(
      subscription.customer as string,
    )
    if (!user) {
      return NextResponse.json({
        warning: 'Invalid client reference ID. Ignoring',
      })
    }

    const price = subscription.items.data[0].price
    const product = await getProductById(price.product as string)
    const planId = product.metadata.plan_id
    if (!planId) {
      return NextResponse.json({
        warning: 'Invalid plan ID. Ignoring',
      })
    }
    const plan = getPlan(planId)

    const data = {
      planId,
      stripeSubscriptionId: subscription.id,
      startDate: new Date(subscription.start_date * 1000),
      endDate: null,
      userId: user.id,
      interval:
        price.recurring?.interval === 'month'
          ? ('MONTH' as const)
          : ('YEAR' as const),
    }
    const { userId } = await getPrisma().subscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      create: data,
      update: data,
    })
    await getPrisma().user.update({
      where: { id: userId },
      data: { monthlyRemainingCredits: { increment: plan.maxVideoRenders } },
    })
    revalidateTag(`plan-${userId}`)
  } else if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription
    const endAt = subscription.cancel_at ?? subscription.canceled_at

    const price = subscription.items.data[0].price
    const product = await getProductById(price.product as string)
    const planId = product.metadata.plan_id
    if (!planId) {
      return NextResponse.json({
        warning: 'Invalid plan ID. Ignoring',
      })
    }

    const { userId } = await getPrisma().subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        planId,
        endDate: endAt ? new Date(endAt * 1000) : null,
        interval:
          price.recurring?.interval === 'month'
            ? ('MONTH' as const)
            : ('YEAR' as const),
      },
    })
    revalidateTag(`plan-${userId}`)
  }

  return new NextResponse(null, { status: 200 })
}
