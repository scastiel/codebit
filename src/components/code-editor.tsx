'use client'
import { GenerateButton } from '@/components/generate-button'
import { CodeVideoOptions } from '@/components/remotion/code-composition'
import { SnippetPlayer } from '@/components/snippet-player'
import { SnippetSettingsEditor } from '@/components/snippet-settings-editor'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getPlanWarnings, parseSnippetMardown } from '@/lib/code-steps-utils'
import { githubDark, githubLight } from '@/lib/monaco-themes'
import { Plan } from '@/lib/plans'
import { Editor } from '@monaco-editor/react'
import useSize from '@react-hook/size'
import debouncePromise from 'debounce-promise'
import fm from 'front-matter'
import { Dot, ExternalLink, HelpCircle } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import yaml from 'yaml'
import { MarkdownEditor } from './markdown-editor'
import { WarningList } from './warning-list'

type Props = {
  snippetSlug: string
  initialContent: string
  saveSnippetAction?: (code: string) => Promise<void>
  lastRenderId?: string | null
  plan: Plan
  userId: string
}

export function CodeEditor({
  snippetSlug,
  initialContent,
  saveSnippetAction,
  lastRenderId,
  plan,
  userId,
}: Props) {
  const editorRef = useRef<any>(null)
  const [markdown, setMarkdown] = useState(initialContent)
  const editorWrapperRef = useRef(null)
  const [editorWidth, editorHeight] = useSize(editorWrapperRef)
  const toolbarRef = useRef<HTMLDivElement | null>(null)

  const preview = () => {
    const markdown = editorRef.current.getValue()
    if (markdown) setMarkdown(markdown)
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

  const save = debouncePromise(async (code: string) => {
    setSaved(true)
    setSaving(true)
    try {
      await saveSnippetAction?.(code)
      setSaving(false)
    } catch (err) {
      console.error(err)
      setSaving(false)
      setSaved(false)
    }
  }, 1000)

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
        <MarkdownEditor
          editorContent={
            <Card className="h-full w-full overflow-hidden">
              <Editor
                defaultLanguage="markdown"
                defaultValue={initialContent ?? ''}
                onMount={(editor, monaco) => {
                  editor.getModel()?.updateOptions({ indentSize: 2 })
                  monaco.editor.defineTheme('github', githubLight as any)
                  monaco.editor.defineTheme('github-dark', githubDark as any)
                  monaco.editor.setTheme(
                    appTheme === 'dark' ? 'github-dark' : 'github',
                  )
                  editorRef.current = editor
                  preview()
                }}
                onChange={async () => {
                  setSaved(false)
                  await save(editorRef.current?.getValue() || markdown)
                  preview()
                }}
                options={{ minimap: { enabled: false } }}
              />
            </Card>
          }
          settingsContent={
            <Card className="h-full w-full overflow-hidden p-4">
              <SnippetSettingsEditor
                metadata={metadata}
                setMetadata={(metadata) => {
                  const { body } = fm(markdown)
                  const { speed, ...metadataWithoutSpeed } = metadata
                  const frontmatter = yaml.stringify(metadataWithoutSpeed)
                  const code = `---\n${frontmatter}---\n\n${body}`
                  setSaved(false)
                  save(code)
                  setMarkdown(code)
                }}
              />
            </Card>
          }
          toolbarContent={
            <>
              <span className="text-sm flex items-center mr-2">
                {saving ? (
                  <>
                    <Dot color="green" className="w-8 h-8" />
                    Saving…
                  </>
                ) : saved ? (
                  <>
                    <Dot color="green" className="w-8 h-8" />
                    Saved
                  </>
                ) : (
                  <>
                    <Dot color="orange" className="w-8 h-8" />
                    Unsaved
                  </>
                )}
              </span>
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
                      await save(editorRef.current.getValue() || markdown)
                      preview()
                    }}
                  />
                </>
              )}
            </>
          }
        />
      </div>
    </div>
  )
}
