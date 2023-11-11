'use server'
import {
  cancelSubscription,
  changeSubscription,
  createCheckoutSession,
  createPortalSession,
  reactivateSubscription,
} from '@/lib/stripe'

export async function goToPortal() {
  'use server'
  return createPortalSession()
}

export async function uncancel() {
  'use server'
  return reactivateSubscription()
}

export async function cancel() {
  'use server'
  return cancelSubscription()
}

export async function changePlan(planId: string, interval: 'month' | 'year') {
  'use server'
  return changeSubscription(planId, interval)
}

export async function subscribe(planId: string, interval: 'month' | 'year') {
  'use server'
  return createCheckoutSession(planId, interval)
}
