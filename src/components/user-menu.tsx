'use client'
import { PlanBadge } from '@/components/plan-badge'
import { SigninButton } from '@/components/signin-button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { getPlan } from '@/lib/plans'
import { cn } from '@/lib/utils'
import { User } from '@prisma/client'
import { Code2, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
  user: User | null
  planId: string | null
}

export function UserMenu({ user, planId }: Props) {
  return (
    <div className="flex items-center p-4 h-14 gap-2">
      <h1 className="drop-shadow-md font-semibold">
        <Link href="/" className="flex gap-2">
          <Code2 />
          <span className="hidden sm:block">CodeBit</span>
        </Link>
      </h1>
      <div className="flex-1"></div>
      {user ? (
        <SignedInUserMenu user={user} planId={planId} />
      ) : (
        // <div className="text-sm flex gap-1 items-center">
        //   {plan && (
        //     <Button asChild variant="ghost">
        //       <Link href="/my/plan" className="flex gap-2">
        //         {user?.image && (
        //           <Image
        //             className="rounded-full"
        //             src={user.image}
        //             alt=""
        //             width={24}
        //             height={24}
        //           />
        //         )}
        //         <span className="hidden sm:block">
        //           {user.name ?? user.email}
        //         </span>{' '}
        //         <PlanBadge userId={user.id} />
        //       </Link>
        //     </Button>
        //   )}
        //   <Button asChild variant="ghost">
        //     <Link href="/my/snippets">My snippets</Link>
        //   </Button>
        //   {/* TODO: Reactivate when the page is less confusing. */}
        //   {/* <Button asChild variant="ghost">
        //     <Link href="/my/renders">My renders</Link>
        //   </Button> */}
        //   <SignoutButton />
        // </div>
        <div className="flex items-baseline gap-1">
          <span className="block text-xs text-slate-400 animate-bounce-right">
            Have you been invited? →
          </span>
          <SigninButton />
        </div>
      )}
    </div>
  )
}

function SignedInUserMenu({
  user,
  planId,
}: {
  user: User
  planId: string | null
}) {
  const plan = planId ? getPlan(planId) : null

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/my/snippets" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              My snippets
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-2">
            {user?.image && (
              <Image
                className="rounded-full"
                src={user.image}
                alt=""
                width={24}
                height={24}
              />
            )}
            <span className="hidden sm:block">{user.name ?? user.email}</span>
            <PlanBadge userId={user.id} />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[350px] gap-3 p-4 ">
              {plan && (
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/my/plan"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">
                        My subscription
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Upgrade or manage your subscription
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              )}
              <li>
                <NavigationMenuItem>
                  <button
                    className="w-full block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    onClick={() =>
                      signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASE_URL })
                    }
                  >
                    <div className="text-left text-sm font-medium leading-none flex">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </div>
                  </button>
                </NavigationMenuItem>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
