import { GenerateButton } from '@/components/generate-button'
import { CodeVideoOptions } from '@/components/remotion/code-composition'
import { SnippetPlayer } from '@/components/snippet-player'
import { SnippetSettingsEditor } from '@/components/snippet-settings-editor'
import { SnippetSettingsToolbar } from '@/components/snippet-settings-toolbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { parseSnippetMardown } from '@/lib/code-steps-utils'
import { githubDark } from '@/lib/monaco-themes'
import { Editor } from '@monaco-editor/react'
import useSize from '@react-hook/size'
import { Link } from '@tanstack/react-router'
import debouncePromise from 'debounce-promise'
import fm from 'front-matter'
import { Dot, HelpCircle } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import yaml from 'yaml'
import { MarkdownEditor } from './markdown-editor'
import { WarningList } from './warning-list'

type Props = {
  snippetSlug: string
  initialContent: string
  saveSnippetAction?: (code: string) => Promise<void>
}

export function CodeEditor({
  snippetSlug,
  initialContent,
  saveSnippetAction,
}: Props) {
  const editorRef = useRef<any>(null)
  const [markdown, setMarkdown] = useState(initialContent)
  const editorWrapperRef = useRef(null)
  const [editorWidth, editorHeight] = useSize(editorWrapperRef)

  const preview = () => {
    const markdown = editorRef.current.getValue()
    if (markdown) setMarkdown(markdown)
  }

  const fontSize = Math.min(Math.max(8, Math.min(0.02 * editorWidth, 16)))

  const { metadata, warnings } = useMemo(
    () => parseSnippetMardown(markdown),
    [markdown],
  )

  const options = useMemo<CodeVideoOptions>(
    () => ({
      seed: snippetSlug,
      markdown,
      fontSize,
      watermark: metadata.watermark
        ? { type: 'url', slug: snippetSlug }
        : { type: 'none' },
    }),
    [fontSize, markdown, metadata.watermark, snippetSlug],
  )

  useEffect(() => {
    editorRef.current?.layout({ width: 0, height: 0 })
    window.requestAnimationFrame(() => editorRef.current?.layout())
  }, [editorHeight])

  const [saved, setSaved] = useState(true)
  const [saving, setSaving] = useState(false)

  const save = async (code: string) => {
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
  }

  const debouncedSave = debouncePromise(save, 1000)

  return (
    <div className="flex flex-col gap-4 p-4 lg:flex-row-reverse">
      <div
        ref={editorWrapperRef}
        className="w-full lg:w-[600px] lg:max-w-[60%] flex flex-col gap-2"
      >
        <SnippetSettingsToolbar
          metadata={metadata}
          setMetadata={async (metadata) => {
            const { body } = fm(markdown)
            const { speed, ...metadataWithoutSpeed } = metadata
            const frontmatter = yaml.stringify(metadataWithoutSpeed)
            const code = `---\n${frontmatter}---\n\n${body}`
            setMarkdown(code)
            editorRef.current?.setValue(code)
          }}
          exportButton={
            <GenerateButton
              options={options}
              snippetSlug={snippetSlug}
              save={async () => {
                await debouncedSave(editorRef.current.getValue() || markdown)
                preview()
              }}
            />
          }
        />
        {editorWidth > 0 && (
          <div className="rounded-[10px] p-[2px] bg-gradient-to-b from-slate-100 to-slate-800 self-start mx-[2px]">
            <div className="overflow-hidden rounded-[8px]">
              <SnippetPlayer
                options={options}
                width={editorWidth - 4}
                height={Math.round((editorWidth * 9) / 16)}
              />
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <Button asChild variant="ghost">
            <Link to="/help" target="_blank" rel="noopener noreferrer">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Link>
          </Button>
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
        <MarkdownEditor
          editorContent={
            <Card className="h-full w-full overflow-hidden">
              <Editor
                defaultLanguage="markdown"
                defaultValue={markdown ?? ''}
                onMount={(editor, monaco) => {
                  editor.getModel()?.updateOptions({ indentSize: 2 })
                  monaco.editor.defineTheme('github-dark', githubDark as any)
                  monaco.editor.setTheme('github-dark')
                  editorRef.current = editor
                  preview()
                }}
                onChange={async () => {
                  setSaved(false)
                  await debouncedSave(editorRef.current?.getValue() || markdown)
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
                setMetadata={async (metadata) => {
                  const { body } = fm(markdown)
                  const { speed, ...metadataWithoutSpeed } = metadata
                  const frontmatter = yaml.stringify(metadataWithoutSpeed)
                  const code = `---\n${frontmatter}---\n\n${body}`
                  setMarkdown(code)
                  editorRef.current?.setValue(code)
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
                <GenerateButton
                  options={options}
                  snippetSlug={snippetSlug}
                  save={async () => {
                    await debouncedSave(
                      editorRef.current.getValue() || markdown,
                    )
                    preview()
                  }}
                />
              )}
            </>
          }
        />
      </div>
    </div>
  )
}
