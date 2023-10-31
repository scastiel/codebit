import { CodeSteps } from '@/components/code-steps'
import { Create } from '@/components/create'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useStep } from '@/contexts/steps-context'
import { githubLight } from '@/lib/monaco-themes'
import { Editor } from '@monaco-editor/react'
import useSize from '@react-hook/size'
import { useEffect, useRef } from 'react'

export function CodeEditor() {
  const editorRef = useRef<any>(null)
  const { id, steps, updateSteps } = useStep()
  const editorWrapperRef = useRef(null)
  const [editorWidth, editorHeight] = useSize(editorWrapperRef)

  const update = () => {
    updateSteps(getCodeFragments(editorRef.current.getValue()))
  }

  useEffect(() => {
    editorRef.current?.layout({ width: 0, height: 0 })
    window.requestAnimationFrame(() => editorRef.current?.layout())
  }, [editorHeight])

  return (
    <main className="flex flex-col gap-4 p-4 h-screen">
      <div ref={editorWrapperRef}>
        {steps.length > 0 && <CodeSteps key={id} />}
      </div>
      <div className="flex-shrink-0">
        <Button onClick={update}>Update</Button>
      </div>
      <Card className="flex-1 overflow-hidden">
        <Editor
          defaultLanguage="markdown"
          defaultValue={`
\`\`\`ts
console.log('Hello World!')
\`\`\`
`.trim()}
          onMount={(editor, monaco) => {
            monaco.editor.defineTheme('github', githubLight as any)
            monaco.editor.setTheme('github')
            editorRef.current = editor
            update()
          }}
          options={{ lineNumbers: 'off', minimap: { enabled: false } }}
        />
      </Card>
      <div className="flex-shrink-0">
        <Create
          onCodeFetched={(code) => {
            editorRef.current?.setValue(code)
            update()
          }}
        />
      </div>
    </main>
  )
}

function getCodeFragments(input: string) {
  return input.split(/\n+---\n+/).map((page) => {
    const [, lang, code] = page.match(/```([^\n]*)\n(.*)```/s) ?? []
    return { lang, code }
  })
}
