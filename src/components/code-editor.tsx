'use client'
import { CodeSteps } from '@/components/code-steps'
import { ImportFromUrl } from '@/components/import-from-url'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StepsProvider, useSteps } from '@/contexts/steps-context'
import { githubLight } from '@/lib/monaco-themes'
import { Editor } from '@monaco-editor/react'
import useSize from '@react-hook/size'
import { useEffect, useRef } from 'react'

type Props = {
  initialContent?: string
  saveSnippetAction?: (code: string) => Promise<void>
}

export function CodeEditor(props: Props) {
  return (
    <StepsProvider>
      <CodeEditorWithContext {...props} />
    </StepsProvider>
  )
}

function CodeEditorWithContext({ initialContent, saveSnippetAction }: Props) {
  const editorRef = useRef<any>(null)
  const { id, steps, updateSteps } = useSteps()
  const editorWrapperRef = useRef(null)
  const [editorWidth, editorHeight] = useSize(editorWrapperRef)

  const preview = () => {
    updateSteps(getCodeFragments(editorRef.current.getValue()))
  }

  useEffect(() => {
    editorRef.current?.layout({ width: 0, height: 0 })
    window.requestAnimationFrame(() => editorRef.current?.layout())
  }, [editorHeight])

  return (
    <div className="flex flex-col gap-4 p-4">
      <div ref={editorWrapperRef}>
        {steps.length > 0 && <CodeSteps key={id} />}
      </div>
      <div className="flex-shrink-0 gap-2 flex">
        <Button onClick={preview} variant="secondary">
          Preview
        </Button>
        {saveSnippetAction && (
          <Button
            onClick={() => saveSnippetAction(editorRef.current.getValue())}
            variant="secondary"
          >
            Save
          </Button>
        )}
      </div>
      <Card className="flex-1 overflow-hidden">
        <Editor
          defaultLanguage="markdown"
          defaultValue={
            initialContent ??
            `
\`\`\`ts
console.log('Hello World!')
\`\`\`
`.trim()
          }
          onMount={(editor, monaco) => {
            monaco.editor.defineTheme('github', githubLight as any)
            monaco.editor.setTheme('github')
            editorRef.current = editor
            preview()
          }}
          options={{ lineNumbers: 'off', minimap: { enabled: false } }}
        />
      </Card>
      <div className="flex-shrink-0">
        <ImportFromUrl
          onCodeFetched={(code) => {
            editorRef.current?.setValue(code)
            preview()
          }}
        />
      </div>
    </div>
  )
}

function getCodeFragments(input: string) {
  return input.split(/\n+---\n+/).map((page) => {
    const [, lang, code] = page.match(/```([^\n]*)\n(.*)```/s) ?? []
    return { lang, code }
  })
}
