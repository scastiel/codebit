import { TopBar } from '@/components/top-bar'
import { ReactNode } from 'react'

export function MyShell({ children }: { children: ReactNode }) {
  return (
    <>
      <TopBar />
      <main className="flex-1 flex [&>div]:w-full">{children}</main>
    </>
  )
}
