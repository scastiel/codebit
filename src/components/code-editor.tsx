'use client'
import { GenerateButton } from '@/components/generate-button'
import { ImportFromUrl } from '@/components/import-from-url'
import { CodeVideoOptions } from '@/components/remotion/code-composition'
import { SnippetPlayer } from '@/components/snippet-player'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getPlanWarnings, parseSnippetMardown } from '@/lib/code-steps-utils'
import { githubDark, githubLight } from '@/lib/monaco-themes'
import { Plan } from '@/lib/plans'
import { Editor } from '@monaco-editor/react'
import useSize from '@react-hook/size'
import { ExternalLink, Save } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { WarningList } from './warning-list'

type Props = {
  snippetSlug: string
  initialContent: string
  saveSnippetAction?: (code: string) => Promise<void>
  lastRenderId?: string | null
  toolbarRef: MutableRefObject<HTMLDivElement | null>
  plan: Plan
}

export function CodeEditor({
  snippetSlug,
  initialContent,
  saveSnippetAction,
  lastRenderId,
  toolbarRef,
  plan,
}: Props) {
  const editorRef = useRef<any>(null)
  const [markdown, setMarkdown] = useState(initialContent)
  const editorWrapperRef = useRef(null)
  const [editorWidth, editorHeight] = useSize(editorWrapperRef)

  const preview = () => {
    const markdown = editorRef.current.getValue()
    setMarkdown(markdown)
  }

  const fontSize = Math.min(Math.max(8, Math.min(0.02 * editorWidth, 16)))

  const options: CodeVideoOptions = useMemo(
    () => ({
      markdown,
      fontSize,
      watermark: { type: 'url', slug: snippetSlug },
      maxDurationInSeconds: plan.maxVideoDurationInSeconds,
    }),
    [fontSize, markdown, plan.maxVideoDurationInSeconds, snippetSlug],
  )

  const { steps, metadata, warnings } = useMemo(
    () => parseSnippetMardown(markdown),
    [markdown],
  )

  const planWarnings = useMemo(() => getPlanWarnings(options), [options])

  useEffect(() => {
    editorRef.current?.layout({ width: 0, height: 0 })
    window.requestAnimationFrame(() => editorRef.current?.layout())
  }, [editorHeight])

  const { theme: appTheme } = useTheme()

  return (
    <div className="flex flex-col gap-4 p-4 lg:flex-row-reverse">
      <div
        ref={editorWrapperRef}
        className="w-full lg:w-1/3 flex flex-col gap-2"
      >
        <div className="rounded-[10px] p-[2px] bg-gradient-to-b from-slate-100 to-slate-800 self-start">
          <div className="overflow-hidden rounded-[8px]">
            {editorWidth > 0 && (
              <SnippetPlayer
                options={options}
                width={editorWidth - 4}
                height={Math.round((editorWidth * 9) / 16)}
              />
            )}
          </div>
        </div>
        <WarningList
          warnings={[...planWarnings, ...warnings]}
          goToLine={(line) => {
            const editor = editorRef.current
            if (!editor) return
            editor.focus()
            editor.setPosition({ column: 1, lineNumber: line })
            editor.revealLine(line)
          }}
        />
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {toolbarRef.current &&
          createPortal(
            <>
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
              {snippetSlug && (
                <>
                  <Button variant="secondary" asChild>
                    <Link
                      href={`/${snippetSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Share
                    </Link>
                  </Button>
                  <GenerateButton
                    initialRenderId={lastRenderId ?? null}
                    snippetSlug={snippetSlug}
                  />
                </>
              )}
            </>,
            toolbarRef.current,
          )}
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
            onChange={(code) => {
              // updateMarkdown(code ?? '')
            }}
            options={{ minimap: { enabled: false } }}
          />
        </Card>
        <div className="flex-shrink-0">
          <ImportFromUrl
            onCodeFetched={async (code) => {
              editorRef.current?.setValue(code)
              if (saveSnippetAction) await saveSnippetAction(code)
              preview()
            }}
          />
        </div>
      </div>
    </div>
  )
}
