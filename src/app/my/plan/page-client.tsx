'use client'
import { goToPortal } from '@/app/my/plan/actions'
import { ImprovedButton } from '@/app/my/plan/improved-button'
import PlansTable from '@/app/my/plan/plans-table'
import { useUserSubscriptionInfo } from '@/lib/hooks'
import { getPlan } from '@/lib/plans'
import { delay } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  userId: string
}

export function MyPlanPageClient({ userId }: Props) {
  const router = useRouter()
  const [refresh, setRefresh] = useState(0)

  const { data, isLoading, error } = useUserSubscriptionInfo(userId, refresh)

  if (isLoading) return <p>Loading your plan information…</p>

  if (error || !data)
    return <p>An error occurred while getting your plan information.</p>

  const {
    stripeCustomerId,
    currentPlanId,
    subscriptionId,
    subscriptionEndDate,
    subscriptionInterval,
  } = data

  const currentPlan = getPlan(currentPlanId)

  return (
    <div className="flex flex-col gap-8">
      <PlansTable
        currentPlan={currentPlan}
        subscriptionId={subscriptionId}
        subscriptionEndDate={subscriptionEndDate}
        refresh={() => setRefresh((r) => r + 1)}
        initialInterval={subscriptionInterval}
      />

      {stripeCustomerId && (
        <div
          className="max-w-screen-sm flex flex-col items-center text-center mx-auto gap-4"
          style={{ textWrap: 'balance' } as any}
        >
          <p>Prices in US Dollars.</p>
          <p>
            We partner with <strong>Stripe</strong> for billing. To access your
            billing history or change your method of payment, use the billing
            portal:
          </p>
          <ImprovedButton
            action={async () => {
              const url = await goToPortal()
              router.push(url)
              await delay(2000)
            }}
            variant="secondary"
          >
            Go to billing portal
          </ImprovedButton>
        </div>
      )}
    </div>
  )
}
