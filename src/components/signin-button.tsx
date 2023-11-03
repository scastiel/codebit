'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function SigninButton() {
  return (
    <Button variant="ghost" asChild>
      <Link href="/my">Sign in</Link>
    </Button>
  )
}
