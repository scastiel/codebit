import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col max-w-screen-lg mx-4 lg:mx-auto py-8">
      {children}
    </div>
  )
}
