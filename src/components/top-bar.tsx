import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { Code2 } from 'lucide-react'
import Link from 'next/link'

export function TopBar() {
  const itemClassName = cn(
    navigationMenuTriggerStyle(),
    'bg-transparent px-2 sm:px-4',
  )
  return (
    <div className="flex items-center p-4 h-14 gap-2">
      <h1 className="drop-shadow-md font-semibold">
        <Link href="/" className="flex gap-2">
          <Code2 />
          <span className="hidden sm:block">CodeBit</span>
        </Link>
      </h1>

      <div className="flex-1" />

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/my/snippets" legacyBehavior passHref>
              <NavigationMenuLink className={itemClassName}>
                My snippets
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/help" legacyBehavior passHref>
              <NavigationMenuLink className={itemClassName}>
                Help
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
