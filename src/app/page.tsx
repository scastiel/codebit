import { CodeEditor } from '@/components/code-editor'
import { UserMenu } from '@/components/user-menu'

export default async function Home() {
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
