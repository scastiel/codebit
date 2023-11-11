import { MyPlanPageClient } from '@/app/my/plan/page-client'
import { env } from '@/lib/env'
import { getCurrentUserOrRedirect } from '@/lib/user'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My plan',
}

export default async function MyPlanPage() {
  const user = await getCurrentUserOrRedirect(
    `${env.NEXT_PUBLIC_BASE_URL}/my/plan`,
  )
  return <MyPlanPageClient userId={user.id} />
}
