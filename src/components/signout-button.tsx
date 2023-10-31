'use client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

export function SignoutButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASE_URL })}
    >
      <LogOut className="h-4 w-4" />
    </Button>
  )
}
