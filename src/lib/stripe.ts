import { env } from '@/lib/env'
import { Plan, getPlan } from '@/lib/plans'
import { getPrisma } from '@/lib/prisma'
import { getActiveUserSubscription, getCurrentUser } from '@/lib/user'
import Stripe from 'stripe'

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export async function createCustomer(userId: string) {
  const prisma = getPrisma()
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('Invalid user ID')
  if (user.stripeCustomerId) return user.stripeCustomerId
  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    name: user.name ?? undefined,
    metadata: { userId: user.id },
  })
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  })
  return customer.id
}

const productsAndPrices: Record<
  string,
  { productId: string; monthlyPriceId: string; yearlyPriceId: string }
> = {}

export async function getProductForPlan(plan: Plan): Promise<{
  productId: string
  monthlyPriceId: string
  yearlyPriceId: string
}> {
  if (!(plan.id in productsAndPrices)) {
    const product = (await getProduct(plan)) ?? (await createProduct(plan))

    const monthlyPrice =
      (await getPrice(`${plan.id}-monthly`)) ??
      (await createPrice({
        productId: product.id,
        unitAmount: plan.monthlyPriceCents,
        name: plan.name,
        lookupKey: `${plan.id}-monthly`,
        interval: 'month',
      }))

    const yearlyPrice =
      (await getPrice(`${plan.id}-yearly`)) ??
      (await createPrice({
        productId: product.id,
        unitAmount: plan.yearlyPriceCents,
        name: plan.name,
        lookupKey: `${plan.id}-yearly`,
        interval: 'year',
      }))

    productsAndPrices[plan.id] = {
      productId: product.id,
      monthlyPriceId: monthlyPrice.id,
      yearlyPriceId: yearlyPrice.id,
    }
  }
  return productsAndPrices[plan.id]
}

async function getPrice(lookupKey: string) {
  const query = `lookup_key:"${lookupKey}" AND active:"true"`
  const result = await stripe.prices.search({ query })
  return result.data[0]
}

async function createPrice({
  productId,
  unitAmount,
  name,
  lookupKey,
  interval,
}: {
  productId: string
  unitAmount: number
  name: string
  lookupKey: string
  interval: Stripe.PriceCreateParams.Recurring.Interval
}) {
  const price = await stripe.prices.create({
    product: productId,
    unit_amount: unitAmount,
    currency: 'USD',
    nickname: name,
    lookup_key: lookupKey,
    recurring: { interval, interval_count: 1 },
  })
  console.log(
    `Created price for product ${productId}, interval '${interval}': ${price.id}`,
  )
  return price
}

async function createProduct(plan: Plan) {
  const product = await stripe.products.create({
    name: plan.name,
    tax_code: 'txcd_10103000',
    statement_descriptor: `CODEBIT ${plan.name}`,
    metadata: { plan_id: plan.id },
  })
  console.log(`Created product for plan ${plan.id}: ${product.id}`)
  return product
}

async function getProduct(plan: Plan) {
  const query = `metadata["plan_id"]:"${plan.id}" AND active:"true"`
  const result = await stripe.products.search({ query: query })
  return result.data[0]
}

export async function createCheckoutSession(
  planId: string,
  interval: 'month' | 'year',
) {
  const user = await getCurrentUser()
  if (!user.stripeCustomerId) throw new Error('Missing Stripe customer ID')

  const plan = getPlan(planId)
  const { monthlyPriceId, yearlyPriceId } = await getProductForPlan(plan)
  const priceId = interval === 'month' ? monthlyPriceId : yearlyPriceId
  const { url } = await stripe.checkout.sessions.create({
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/my/plan?success`,
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/my/plan?cancelled`,
    mode: 'subscription',
    client_reference_id: user.id,
    customer: user.stripeCustomerId,
    customer_update: { address: 'auto' },
    automatic_tax: { enabled: true },
    allow_promotion_codes: true,
    line_items: [{ price: priceId, quantity: 1 }],
  })
  if (!url) throw new Error('No returned checkout session URL')
  return url
}

export async function getProductById(productId: string) {
  return stripe.products.retrieve(productId)
}

export async function createPortalSession() {
  const user = await getCurrentUser()
  if (!user.stripeCustomerId) throw new Error('Missing Stripe customer ID')

  const { url } = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${env.NEXT_PUBLIC_BASE_URL}/my/plan`,
  })
  return url
}

export async function changeSubscription(
  planId: string,
  interval: 'month' | 'year',
) {
  const user = await getCurrentUser()
  if (!user.stripeCustomerId) throw new Error('Missing Stripe customer ID')

  const subscription = await getActiveUserSubscription(user.id)
  if (!subscription) throw new Error('Missing subscription')

  const plan = getPlan(planId)
  const { monthlyPriceId, yearlyPriceId } = await getProductForPlan(plan)
  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.stripeSubscriptionId,
  )
  const lineItem = stripeSubscription.items.data[0]
  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: false,
    items: [
      {
        id: lineItem.id,
        price: interval === 'month' ? monthlyPriceId : yearlyPriceId,
      },
    ],
  })
}

export async function cancelSubscription() {
  const user = await getCurrentUser()
  if (!user.stripeCustomerId) throw new Error('Missing Stripe customer ID')

  const subscription = await getActiveUserSubscription(user.id)
  if (!subscription) throw new Error('Missing subscription')

  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  })
}

export async function reactivateSubscription() {
  const user = await getCurrentUser()
  if (!user.stripeCustomerId) throw new Error('Missing Stripe customer ID')

  const subscription = await getActiveUserSubscription(user.id)
  if (!subscription) throw new Error('Missing subscription')

  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: false,
  })
}
