'use client'
import { GenerateButton } from '@/components/generate-button'
import { ImportFromUrl } from '@/components/import-from-url'
import { SnippetPlayer } from '@/components/snippet-player'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { parseSnippetMardown } from '@/lib/code-steps-utils'
import { githubDark, githubLight } from '@/lib/monaco-themes'
import { SnippetParsingResult } from '@/lib/types'
import { Editor } from '@monaco-editor/react'
import useSize from '@react-hook/size'
import { ExternalLink, Save } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { WarningList } from './warning-list'

type Props = {
  snippetSlug: string
  initialContent: string
  saveSnippetAction?: (code: string) => Promise<void>
  lastRenderId?: string | null
  toolbarRef: MutableRefObject<HTMLDivElement | null>
}

export function CodeEditor({
  snippetSlug,
  initialContent,
  saveSnippetAction,
  lastRenderId,
  toolbarRef,
}: Props) {
  const editorRef = useRef<any>(null)
  const [markdown, setMarkdown] = useState(initialContent)
  const editorWrapperRef = useRef(null)
  const [editorWidth, editorHeight] = useSize(editorWrapperRef)
  const [{ steps, metadata, warnings }, setParsingResult] =
    useState<SnippetParsingResult>(parseSnippetMardown(markdown))

  const preview = () => {
    const markdown = editorRef.current.getValue()
    setMarkdown(markdown)
    setParsingResult(parseSnippetMardown(markdown))
  }

  useEffect(() => {
    editorRef.current?.layout({ width: 0, height: 0 })
    window.requestAnimationFrame(() => editorRef.current?.layout())
  }, [editorHeight])

  const { theme: appTheme } = useTheme()
  const fontSize = Math.min(Math.max(8, Math.min(0.02 * editorWidth, 16)))

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
                options={{
                  markdown,
                  fontSize,
                  watermark: { type: 'url', slug: snippetSlug },
                }}
                width={editorWidth - 4}
                height={Math.round((editorWidth * 9) / 16)}
              />
            )}
          </div>
        </div>
        <WarningList
          warnings={warnings}
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
