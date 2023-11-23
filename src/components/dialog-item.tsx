import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ReactNode, forwardRef } from 'react'

type Props = {
  triggerChildren: ReactNode
  children: ReactNode
}

export const DialogItem = forwardRef<HTMLDivElement | null, Props>(
  ({ triggerChildren, children, ...itemProps }: Props, forwardedRef) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <DropdownMenuItem
            {...itemProps}
            ref={forwardedRef}
            className="DropdownMenuItem"
            onSelect={(event) => {
              event.preventDefault()
            }}
          >
            {triggerChildren}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay className="DialogOverlay" />
          <DialogContent className="DialogContent">{children}</DialogContent>
        </DialogPortal>
      </Dialog>
    )
  },
)
DialogItem.displayName = 'DialogItem'
