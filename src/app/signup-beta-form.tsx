'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePlausible } from 'next-plausible'
import { useState } from 'react'

type Props = {
  signUpAction: (email: string) => Promise<void>
}

export function SignupBetaForm({ signUpAction }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<
    'initial' | 'pending' | 'error' | 'done'
  >('initial')
  const plausible = usePlausible()

  return (
    <form
      className="mt-12 flex flex-col items-center text-center gap-2"
      onSubmit={async (event) => {
        event.preventDefault()
        setStatus('pending')
        try {
          await signUpAction(email)
          setStatus('done')
          plausible('Beta: Sign up with email', { props: { email } })
        } catch (error) {
          console.error(error)
          setStatus('error')
        }
      }}
    >
      <p>
        We’ll still in private alpha.
        <br />
        Sign up to know when we’re ready!
      </p>
      <div className="flex gap-2">
        <label htmlFor="email" className="sr-only">
          Email:
        </label>
        <Input
          type="email"
          required
          placeholder="panic@thedis.co"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="text-[1rem]"
        />
        <Button disabled={status === 'pending'} type="submit">
          {status === 'pending' ? 'Submitting…' : 'Submit'}
        </Button>
      </div>
      {status === 'error' ? (
        <p className="text-sm">An error occurred 🙁.</p>
      ) : status === 'done' ? (
        <p className="text-sm">
          Noted! We’ll get back at you as soon as possible 😁.
        </p>
      ) : null}
    </form>
  )
}
