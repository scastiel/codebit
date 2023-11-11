import { UserMenu } from '@/components/user-menu'
import { ReactNode } from 'react'
import './prism-theme.css'

export default function HelpLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      <header>
        <UserMenu user={null} planId={null} />
      </header>
      <main className="w-full my-10 px-4 max-w-screen-lg mx-auto prose dark:prose-invert lg:prose-xl">
        {children}
      </main>
    </div>
  )
}
