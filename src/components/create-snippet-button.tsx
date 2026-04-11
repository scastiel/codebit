import { Button } from '@/components/ui/button'
import { createSnippet } from '@/lib/snippet-storage'
import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export function CreateSnippetButton() {
  const navigate = useNavigate()

  return (
    <Button
      variant="outline"
      className="w-full h-full flex sm:flex-col items-center justify-center gap-2 sm:gap-1 text-slate-500"
      onClick={() => {
        const snippet = createSnippet()
        navigate({
          to: '/my/snippets/$snippetSlug',
          params: { snippetSlug: snippet.slug },
        })
      }}
    >
      <Plus className="w-4 h-4 sm:w-14 sm:h-14" />
      <span className="sm:text-xl">Create snippet</span>
    </Button>
  )
}
