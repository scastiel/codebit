import { SignoutButton } from '@/components/signout-button'
import { getCurrentUser } from '@/lib/user'
import Image from 'next/image'

export async function UserMenu() {
  const user = await getCurrentUser()

  return (
    <div className="flex items-center p-4 h-14 gap-2 justify-end">
      {user?.image && (
        <Image
          className="rounded-full"
          src={user.image}
          alt=""
          width={24}
          height={24}
        />
      )}
      <span className="">{user.name ?? user.email}</span>
      <SignoutButton />
    </div>
  )
}
