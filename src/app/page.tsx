import { CodeEditor } from '@/components/code-editor'

export default async function Home() {
  return (
    <main className="flex-1 flex [&>div]:w-full">
      <CodeEditor />
    </main>
  )
}
