'use client'
import { EmailSigninForm } from '@/app/auth/signin/email-signin-form'
import { SocialSigninButton } from '@/app/auth/signin/social-signin-button'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Github } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function SigninPage() {
  const searchParams = useSearchParams()
  const callbackUrl =
    searchParams.get('callbackUrl') ?? `${process.env.NEXT_PUBLIC_BASE_URL}/my`

  return (
    <div className="flex flex-col-reverse lg:grid lg:min-h-[100dvh] lg:grid-cols-2">
      <div className="flex flex-col justify-between bg-slate-50 p-8 dark:bg-slate-800">
        {/* Placeholder */}
      </div>
      <div className="relative flex items-center justify-center py-48">
        <div className="absolute left-4 top-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ChevronLeft className="mr-1.5 w-4" />
              Back
            </Link>
          </Button>
        </div>
        <div className="flex max-w-sm flex-col gap-4 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Sign in or create an account
          </h2>

          <p
            className="text-sm text-slate-500 dark:text-slate-400"
            style={{ textWrap: 'balance' } as any}
          >
            Enter your email to sign in or create an account.
          </p>

          <EmailSigninForm callbackUrl={callbackUrl} />

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t dark:border-slate-500"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                Or continue with
              </span>
            </div>
          </div>

          <SocialSigninButton
            provider="github"
            label="GitHub"
            icon={<Github className="mr-2 h-4 w-4" />}
            callbackUrl={callbackUrl}
          />
        </div>
      </div>
    </div>
  )
}
