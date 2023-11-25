import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex-1 self-center justify-center items-center flex text-slate-400">
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Loading…
    </div>
  )
}
