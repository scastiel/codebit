import { LandingPlayer } from '@/app/landing-player'
import { SignupBetaForm } from '@/app/signup-beta-form'
import { UserMenu } from '@/components/user-menu'
import { getPrisma } from '@/lib/prisma'
import { z } from 'zod'

export default async function Home() {
  async function signUpAction(email: string) {
    'use server'
    email = z.string().email().parse(email).toLowerCase()
    await getPrisma().betaSignups.upsert({
      where: { email },
      update: {},
      create: { email },
    })
  }

  return (
    <div className="flex-1 flex flex-col">
      <header>
        <UserMenu user={null} />
      </header>
      <main className="flex-1 flex flex-col items-center py-8 px-2 sm:px-4">
        <LandingPlayer />
        <SignupBetaForm signUpAction={signUpAction} />
      </main>
      <footer className="text-slate-400 [&_a]:text-white text-center p-2 text-xs sm:text-sm mt-16">
        Made with ♥ in Montreal by{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://scastiel.dev"
        >
          @scastiel
        </a>{' '}
        and{' '}
        <a target="_blank" rel="noopener noreferrer" href="https://maxday.dev">
          @maxday
        </a>
        .
      </footer>
    </div>
  )
}
