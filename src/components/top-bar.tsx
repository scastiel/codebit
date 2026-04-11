import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { Code2 } from 'lucide-react'

export function TopBar() {
  const itemClassName = cn(
    navigationMenuTriggerStyle(),
    'bg-transparent px-2 sm:px-4',
  )
  return (
    <div className="flex items-center p-4 h-14 gap-2">
      <h1 className="drop-shadow-md font-semibold">
        <Link to="/" className="flex gap-2">
          <Code2 />
          <span className="hidden sm:block">CodeBit</span>
        </Link>
      </h1>

      <div className="flex-1" />

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={itemClassName}>
              <Link to="/my/snippets">My snippets</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={itemClassName}>
              <Link to="/help">Help</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
