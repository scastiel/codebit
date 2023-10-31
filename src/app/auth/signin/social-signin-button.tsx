'use client'

import { Button } from '@/components/ui/button'
import { Loader, Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { ReactNode, useState } from 'react'

export function SocialSigninButton({
  provider,
  icon,
  label,
  callbackUrl,
}: {
  provider: string
  icon: ReactNode
  label: ReactNode
  callbackUrl: string
}) {
  const [pending, setPending] = useState(false)

  return (
    <Button
      onClick={() => {
        setPending(true)
        signIn(provider, { callbackUrl })
      }}
      disabled={pending}
      variant="outline"
    >
      {pending ? <Loader2 className="mr-2 w-4 animate-spin" /> : icon}
      <span>{label}</span>
    </Button>
  )
}
