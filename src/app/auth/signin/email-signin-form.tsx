'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Mail } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { FormEvent, useState } from 'react'

export function EmailSigninForm({ callbackUrl }: { callbackUrl: string }) {
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const email = formData.get('email')
    setSent(false)
    setPending(true)
    try {
      await signIn('email', { email, callbackUrl, redirect: false })
      setSent(true)
    } catch (err) {
      console.error(err)
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Input
          type="email"
          name="email"
          placeholder="your@email.com"
          required
          disabled={pending}
        />
        <Button type="submit" disabled={pending}>
          {pending ? (
            <Loader2 className="mr-2 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 w-4" />
          )}
          Sign in with email
        </Button>
        {sent && (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            We just sent you an email with a sign in link!
          </div>
        )}
      </div>
    </form>
  )
}
