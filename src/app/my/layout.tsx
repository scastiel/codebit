import { FeedbackButton } from '@/components/feedback-button/feedback-button'
import { UserMenu } from '@/components/user-menu'
import { getActiveUserPlanId, getCurrentUserSafe } from '@/lib/user'
import { ReactNode } from 'react'

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await getCurrentUserSafe()
  const userPlanId = user && (await getActiveUserPlanId(user.id))
  return (
    <>
      <header>
        <UserMenu user={user} planId={userPlanId} />
      </header>
      <main className="flex-1 flex [&>div]:w-full">{children}</main>
      <FeedbackButton />
    </>
  )
}
