import { plans } from '@/lib/plans'
import { getProductForPlan } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  const result: Record<
    string,
    Awaited<ReturnType<typeof getProductForPlan>>
  > = {}
  for (const plan of plans) {
    if (plan.monthlyPriceCents === 0) continue
    result[plan.id] = await getProductForPlan(plan)
  }
  return NextResponse.json(result)
}
