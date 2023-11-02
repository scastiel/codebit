import { LandingPlayer } from '@/app/landing-player'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserMenu } from '@/components/user-menu'

export default async function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <header>
        <UserMenu user={null} />
      </header>
      <main className="flex-1 flex flex-col items-center py-8 px-2 sm:px-4">
        <LandingPlayer />
        <form className="mt-12 flex flex-col items-center text-center gap-2">
          <p>
            We’ll still in private alpha.
            <br />
            Sign up to know when we’re ready!
          </p>
          <div className="flex gap-2">
            <label htmlFor="email" className="sr-only">
              Email:
            </label>
            <Input type="email" required placeholder="panic@thedis.co" />
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </main>
      <footer className="text-slate-400 [&_a]:text-white text-center p-2 text-sm">
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
