import { TopBar } from '@/components/top-bar'
import { ReactNode } from 'react'

export default function HelpLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      <TopBar />
      <main className="w-full my-10 px-4 max-w-screen-lg mx-auto prose dark:prose-invert lg:prose-xl">
        {children}
      </main>
    </div>
  )
}
