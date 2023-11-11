import { PlanBadge } from '@/components/plan-badge'
import { SigninButton } from '@/components/signin-button'
import { SignoutButton } from '@/components/signout-button'
import { getPlan } from '@/lib/plans'
import { User } from '@prisma/client'
import { Code2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  user: User | null
  planId: string | null
}

export async function UserMenu({ user, planId }: Props) {
  const plan = planId ? getPlan(planId) : null
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
          {plan && (
            <Link href="/my/plan">
              <PlanBadge userId={user.id} />
            </Link>
          )}
          <Link href="/my/snippets">My snippets</Link>
          <Link href="/my/renders">My renders</Link>
          <SignoutButton />
        </div>
      ) : (
        <SigninButton />
      )}
    </div>
  )
}
