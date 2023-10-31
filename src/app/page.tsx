import { CodeEditor } from '@/components/code-editor'
import { UserMenu } from '@/components/user-menu'
import { env } from '@/lib/env'
import { getCurrentUserOrRedirect } from '@/lib/user'

export default async function Home() {
  await getCurrentUserOrRedirect(`${env.NEXT_PUBLIC_BASE_URL}`)

  return (
    <>
      <header>
        <UserMenu />
      </header>
      <main className="flex-1 flex [&>div]:w-full">
        <CodeEditor />
      </main>
    </>
  )
}
