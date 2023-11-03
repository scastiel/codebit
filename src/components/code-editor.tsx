'use client'
import { GenerateButton } from '@/components/generate-button'
import { ImportFromUrl } from '@/components/import-from-url'
import { SnippetPlayer } from '@/components/snippet-player'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StepsProvider, useSteps } from '@/contexts/steps-context'
import { githubDark, githubLight } from '@/lib/monaco-themes'
import { Editor } from '@monaco-editor/react'
import useSize from '@react-hook/size'
import { ExternalLink, Save } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { getCodeFragments } from '../lib/code-steps-utils'

type Props = {
  snippetId?: string
  initialContent?: string
  saveSnippetAction?: (code: string) => Promise<void>
  lastRenderId?: string | null
}

export function CodeEditor(props: Props) {
  return (
    <StepsProvider>
      <CodeEditorWithContext {...props} />
    </StepsProvider>
  )
}

function CodeEditorWithContext({
  snippetId,
  initialContent,
  saveSnippetAction,
  lastRenderId,
}: Props) {
  const editorRef = useRef<any>(null)
  const { id, steps, theme, updateSteps, updateTheme } = useSteps()
  const editorWrapperRef = useRef(null)
  const [editorWidth, editorHeight] = useSize(editorWrapperRef)

  const preview = () => {
    const { steps, metadata } = getCodeFragments(editorRef.current.getValue())
    updateSteps(steps)
    updateTheme(metadata.theme)
  }

  useEffect(() => {
    editorRef.current?.layout({ width: 0, height: 0 })
    window.requestAnimationFrame(() => editorRef.current?.layout())
  }, [editorHeight])

  const { theme: appTheme } = useTheme()

  return (
    <div className="flex flex-col gap-4 p-4">
      <div ref={editorWrapperRef}>
        {/* {steps.length > 0 && <CodeSteps key={id} />} */}
        {editorWidth > 0 && (
          <SnippetPlayer
            snippet={{
              content:
                `---\ntheme: ${theme}\n---\n\n` +
                steps
                  .map(
                    (step) => `\`\`\`${step.lang}\n${step.code.trim()}\n\`\`\``,
                  )
                  .join('\n\n---\n\n'),
            }}
            width={editorWidth}
            height={500}
          />
        )}
      </div>
      <div className="flex-shrink-0 gap-2 flex">
        {saveSnippetAction && (
          <Button
            onClick={async () => {
              await saveSnippetAction(editorRef.current.getValue())
              preview()
            }}
            variant="secondary"
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        )}
        {snippetId && (
          <>
            <Button variant="secondary" asChild>
              <Link
                href={`/${snippetId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Share
              </Link>
            </Button>
            <GenerateButton
              initialRenderId={lastRenderId ?? null}
              snippetId={snippetId}
            />
          </>
        )}
      </div>
      <Card className="flex-1 overflow-hidden">
        <Editor
          defaultLanguage="markdown"
          defaultValue={initialContent ?? ''}
          onMount={(editor, monaco) => {
            monaco.editor.defineTheme('github', githubLight as any)
            monaco.editor.defineTheme('github-dark', githubDark as any)
            monaco.editor.setTheme(
              appTheme === 'dark' ? 'github-dark' : 'github',
            )
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
