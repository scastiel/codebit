import { SignoutButton } from '@/components/signout-button'
import { Button } from '@/components/ui/button'
import { getCurrentUserSafe } from '@/lib/user'
import { Code2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export async function UserMenu() {
  const user = await getCurrentUserSafe()

  return (
    <div className="flex items-center p-4 h-14 gap-2">
      <h1 className="drop-shadow-md font-semibold">
        <Link href="/" className="flex gap-2">
          <Code2 />
          <span>Share Code</span>
        </Link>
      </h1>
      <div className="flex-1"></div>
      {user ? (
        <>
          {user?.image && (
            <Image
              className="rounded-full"
              src={user.image}
              alt=""
              width={24}
              height={24}
            />
          )}
          <span className="text-sm">{user.name ?? user.email}</span>
          <Button variant="ghost">
            <Link href="/my/snippets">My snippets</Link>
          </Button>
          <Button variant="ghost">
            <Link href="/my/renders">My renders</Link>
          </Button>
          <SignoutButton />
        </>
      ) : (
        <Button variant="ghost">
          <Link href="/my">Sign in</Link>
        </Button>
      )}
    </div>
  )
}
