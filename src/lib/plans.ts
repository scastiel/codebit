export type Plan = {
  id: string
  name: string
  maxVideoDurationInSeconds: number
  watermark: boolean
}

export const plans: Plan[] = [
  { id: 'free', name: 'Free', maxVideoDurationInSeconds: 10, watermark: true },
  {
    id: 'premium',
    name: 'Premium',
    maxVideoDurationInSeconds: 60,
    watermark: false,
  },
]

export function getPlan(planId: string) {
  const plan = plans.find((plan) => plan.id === planId)
  if (!plan) throw new Error(`Invalid plan ID: ${planId}`)
  return plan
}
