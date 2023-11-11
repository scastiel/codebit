export type Plan = {
  id: string
  name: string
  maxVideoDurationInSeconds: number
  maxVideoRenders: number
  watermark: boolean
  monthlyPriceCents: number
  yearlyPriceCents: number
  prioritySupport: boolean
}

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    maxVideoDurationInSeconds: 10,
    maxVideoRenders: 5,
    watermark: true,
    prioritySupport: false,
    monthlyPriceCents: 0,
    yearlyPriceCents: 0,
  },
  {
    id: 'premium',
    name: 'Premium',
    maxVideoDurationInSeconds: 60,
    maxVideoRenders: 20,
    watermark: false,
    prioritySupport: true,
    monthlyPriceCents: 999,
    yearlyPriceCents: 9999,
  },
  {
    id: 'pro',
    name: 'Professional',
    maxVideoDurationInSeconds: 600,
    maxVideoRenders: 40,
    watermark: false,
    prioritySupport: true,
    monthlyPriceCents: 1999,
    yearlyPriceCents: 19999,
  },
]

export function getPlan(planId: string) {
  const plan = plans.find((plan) => plan.id === planId)
  if (!plan) throw new Error(`Invalid plan ID: ${planId}`)
  return plan
}
