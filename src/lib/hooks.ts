import { useEffect, useState } from 'react'
import useSwr from 'swr'

export function useIsBrowser() {
  const [browser, setBrowser] = useState(false)
  useEffect(() => {
    if (!browser) setBrowser(true)
  }, [browser])

  return browser
}

export function useUserSubscriptionInfo(userId: string, refreshToken: any = 0) {
  const { data, isLoading, error } = useSwr(
    [`plan-${userId}`, refreshToken],
    subscriptionFetcher,
  )

  return {
    data: data as
      | {
          stripeCustomerId: string
          currentPlanId: string
          subscriptionId: string | null
          subscriptionEndDate: Date | null
          subscriptionInterval: 'month' | 'year'
          monthlyRemainingCredits: number
        }
      | undefined,
    isLoading,
    error,
  }
}

const subscriptionFetcher = ([tag, _]: [string, number]) =>
  fetch('/my/plan/info', { next: { tags: [tag] } }).then((res) => res.json())
