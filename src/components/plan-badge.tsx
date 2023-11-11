'use client'
import { Badge } from '@/components/ui/badge'
import { useUserSubscriptionInfo } from '@/lib/hooks'
import { getPlan } from '@/lib/plans'

export function PlanBadge({ userId }: { userId: string }) {
  const { isLoading, error, data } = useUserSubscriptionInfo(userId)
  if (isLoading || error || !data) return null
  const plan = getPlan(data.currentPlanId)
  return <Badge>{plan.name}</Badge>
}
