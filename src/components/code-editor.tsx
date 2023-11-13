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
import { ExternalLink, HelpCircle, Loader2, Save } from 'lucide-react'
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
  userId: string
}

export function CodeEditor({
  snippetSlug,
  initialContent,
  saveSnippetAction,
  lastRenderId,
  toolbarRef,
  plan,
  userId,
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

  const { steps, metadata, warnings } = useMemo(
    () => parseSnippetMardown(markdown),
    [markdown],
  )

  const options = useMemo<CodeVideoOptions>(
    () => ({
      markdown,
      fontSize,
      watermark: metadata.watermark
        ? { type: 'url', slug: snippetSlug }
        : { type: 'none' },
      maxDurationInSeconds: plan.maxVideoDurationInSeconds,
      multiFile: plan.multiFile,
    }),
    [
      fontSize,
      markdown,
      metadata.watermark,
      plan.maxVideoDurationInSeconds,
      plan.multiFile,
      snippetSlug,
    ],
  )

  const planWarnings = useMemo(
    () => getPlanWarnings(options, plan),
    [options, plan],
  )

  useEffect(() => {
    editorRef.current?.layout({ width: 0, height: 0 })
    window.requestAnimationFrame(() => editorRef.current?.layout())
  }, [editorHeight])

  const { theme: appTheme } = useTheme()

  const [saved, setSaved] = useState(true)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaved(true)
    setSaving(true)
    try {
      await saveSnippetAction?.(editorRef.current.getValue())
    } catch (err) {
      console.error(err)
      setSaved(false)
    } finally {
      setSaving(false)
    }
  }

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
                  ...options,
                  watermark: plan.watermark
                    ? { type: 'url', slug: snippetSlug }
                    : options.watermark,
                }}
                width={editorWidth - 4}
                height={Math.round((editorWidth * 9) / 16)}
              />
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <Button asChild variant="ghost">
            <Link href="/help" target="_blank" rel="noopener noreferrer">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Link>
          </Button>
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
                    await save()
                    preview()
                  }}
                  variant="secondary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {saved ? 'Saved' : 'Save'}
                    </>
                  )}
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
                    userId={userId}
                    initialRenderId={lastRenderId ?? null}
                    snippetSlug={snippetSlug}
                    save={async () => {
                      await save()
                      preview()
                    }}
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
            onChange={() => {
              setSaved(false)
            }}
            options={{ minimap: { enabled: false } }}
          />
        </Card>
        <div className="flex-shrink-0">
          <ImportFromUrl
            onCodeFetched={async (code) => {
              editorRef.current?.setValue(code)
              save()
              preview()
            }}
          />
        </div>
      </div>
    </div>
  )
}
