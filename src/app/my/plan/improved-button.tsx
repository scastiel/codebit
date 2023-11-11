import { Button, ButtonProps } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

export function ImprovedButton({
  action,
  ...props
}: { action: () => Promise<any> } & ButtonProps) {
  const [pending, setPending] = useState(false)
  const { children, ...otherProps } = props
  return (
    <Button
      disabled={props.disabled || pending}
      onClick={() => {
        setPending(true)
        action().finally(() => setPending(false))
      }}
      {...otherProps}
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}
