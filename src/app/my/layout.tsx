import { UserMenu } from '@/components/user-menu'
import { env } from '@/lib/env'
import { getCurrentUserOrRedirect } from '@/lib/user'
import { ReactNode } from 'react'

export default async function Layout({ children }: { children: ReactNode }) {
  await getCurrentUserOrRedirect(`${env.NEXT_PUBLIC_BASE_URL}`)

  return (
    <>
      <header>
        <UserMenu />
      </header>
      <main className="flex-1 flex [&>div]:w-full">{children}</main>
    </>
  )
}
