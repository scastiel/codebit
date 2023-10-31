import { UserMenu } from '@/components/user-menu'
import { ReactNode } from 'react'

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <header>
        <UserMenu />
      </header>
      <main className="flex-1 flex [&>div]:w-full">{children}</main>
    </>
  )
}
