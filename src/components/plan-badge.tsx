'use client'
import { useUserSubscriptionInfo } from '@/lib/hooks'
import { getPlan } from '@/lib/plans'

export function PlanBadge({ userId }: { userId: string }) {
  const { isLoading, error, data } = useUserSubscriptionInfo(userId)
  if (isLoading || error || !data) return null
  const plan = getPlan(data.currentPlanId)
  return (
    <div className="h-5 flex rounded-full overflow-hidden text-xs">
      <div className="pl-2.5 pr-1.5 bg-slate-600 flex items-center">
        {plan.name}
      </div>
      {data && (
        <div className="pr-2.5 pl-1.5 bg-slate-500 flex items-center">
          {data.monthlyRemainingCredits} credits
        </div>
      )}
    </div>
  )
}
