export type Plan = {
  id: string
  name: string
  maxVideoDurationInSeconds: number
}

export const plans: Plan[] = [
  { id: 'free', name: 'Free', maxVideoDurationInSeconds: 10 },
  { id: 'premium', name: 'Premium', maxVideoDurationInSeconds: 60 },
]

export function getPlan(planId: string) {
  const plan = plans.find(plan => plan.id === planId)
  if (!plan) throw new Error(`Invalid plan ID: ${planId}`)
  return plan
}
