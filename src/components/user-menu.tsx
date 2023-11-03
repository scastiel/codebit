import { SignoutButton } from '@/components/signout-button'
import { Button } from '@/components/ui/button'
import { User } from '@prisma/client'
import { Code2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  user: User | null
}

export async function UserMenu({ user }: Props) {
  return (
    <div className="flex items-center p-4 h-14 gap-2">
      <h1 className="drop-shadow-md font-semibold">
        <Link href="/" className="flex gap-2">
          <Code2 />
          <span>CodeBit</span>
        </Link>
      </h1>
      <div className="flex-1"></div>
      {user ? (
        <div className="text-sm flex gap-3 items-center">
          {user?.image && (
            <Image
              className="rounded-full"
              src={user.image}
              alt=""
              width={24}
              height={24}
            />
          )}
          <span>{user.name ?? user.email}</span>
          <Link href="/my/snippets">My snippets</Link>
          <Link href="/my/renders">My renders</Link>
          <SignoutButton />
        </div>
      ) : (
        <Button variant="ghost" asChild>
          <Link href="/my">Sign in</Link>
        </Button>
      )}
    </div>
  )
}
