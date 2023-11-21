'use client'
import { githubDark, githubLight } from '@/lib/monaco-themes'
import { Editor } from '@monaco-editor/react'
import { Dispatch, MutableRefObject, SetStateAction } from 'react'

type Props = {
  initialContent: string
  appTheme: string | undefined
  editorRef: MutableRefObject<any>
  preview: () => void
  setSaved: Dispatch<SetStateAction<boolean>>
}

export function MarkdownEditor({
  initialContent,
  appTheme,
  editorRef,
  preview,
  setSaved,
}: Props) {
  return (
    <Editor
      defaultLanguage="markdown"
      defaultValue={initialContent ?? ''}
      onMount={(editor, monaco) => {
        editor.getModel()?.updateOptions({ indentSize: 2 })
        monaco.editor.defineTheme('github', githubLight as any)
        monaco.editor.defineTheme('github-dark', githubDark as any)
        monaco.editor.setTheme(appTheme === 'dark' ? 'github-dark' : 'github')
        editorRef.current = editor
        preview()
      }}
      onChange={() => setSaved(false)}
      options={{ minimap: { enabled: false } }}
    />
  )
}
