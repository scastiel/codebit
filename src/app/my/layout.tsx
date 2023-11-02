import { UserMenu } from '@/components/user-menu'
import { getCurrentUserSafe } from '@/lib/user'
import { ReactNode } from 'react'

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await getCurrentUserSafe()
  return (
    <>
      <header>
        <UserMenu user={user} />
      </header>
      <main className="flex-1 flex [&>div]:w-full">{children}</main>
    </>
  )
}
