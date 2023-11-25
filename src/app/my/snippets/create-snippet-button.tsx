'use client'
import { createSnippetAction } from '@/app/my/snippets/actions'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'

export function CreateSnippetButton() {
  const [pending, setPending] = useState(false)

  return (
    <form
      action={createSnippetAction}
      onSubmit={async (event) => {
        event.preventDefault()
        if (pending) return
        try {
          setPending(true)
          await createSnippetAction()
        } catch (err) {
          console.error(err)
        } finally {
          setPending(false)
        }
      }}
    >
      <Button
        variant="outline"
        className="w-full h-full flex sm:flex-col items-center justify-center gap-2 sm:gap-1 text-slate-500"
        type="submit"
        disabled={pending}
      >
        {pending ? (
          <Loader2 className="w-4 h-4 sm:w-14 sm:h-14 animate-spin" />
        ) : (
          <Plus className="w-4 h-4 sm:w-14 sm:h-14" />
        )}
        <span className="sm:text-xl">Create snippet</span>
      </Button>
    </form>
  )
}
