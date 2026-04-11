import { TopBar } from '@/components/top-bar'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopBar />
      <main className="flex-1 flex [&>div]:w-full">{children}</main>
    </>
  )
}
