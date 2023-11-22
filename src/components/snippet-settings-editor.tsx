import { gradientStyleFromSeed } from '@/components/remotion/gradients'
import { themes } from '@/components/remotion/themes'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Metadata } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown, Shuffle } from 'lucide-react'
import { useState } from 'react'

const backgroundSeedsCount = 7

type Props = {
  metadata: Metadata
  setMetadata: (metadata: Metadata) => void
}

export function SnippetSettingsEditor({ metadata, setMetadata }: Props) {
  const backgroundSeeds = Array.from(Array(backgroundSeedsCount)).map(
    (_, i) =>
      Math.floor(metadata.background / backgroundSeedsCount) *
        backgroundSeedsCount +
      i,
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Theme</Label>
        <ThemeSelector
          value={metadata.highlightTheme}
          setValue={(highlightTheme) =>
            setMetadata({ ...metadata, highlightTheme })
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Background</Label>
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
          {backgroundSeeds.map((seed) => (
            <Button
              key={seed}
              className={cn(
                'border rounded-lg aspect-video h-full',
                seed === metadata.background && 'ring',
              )}
              style={gradientStyleFromSeed(seed)}
              onClick={() => setMetadata({ ...metadata, background: seed })}
            />
          ))}
          <Button
            variant="secondary"
            className="border rounded-lg aspect-video h-full"
            onClick={() =>
              setMetadata({
                ...metadata,
                background: Math.round(Math.random() * 100_000),
              })
            }
          >
            <Shuffle />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="animated-background"
            checked={metadata.animatedBackground}
            onCheckedChange={(checked) =>
              setMetadata({ ...metadata, animatedBackground: checked })
            }
          />
          <Label htmlFor="animated-background">Animate the background</Label>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="zooming"
            checked={metadata.zooming}
            onCheckedChange={(checked) =>
              setMetadata({ ...metadata, zooming: checked })
            }
          />
          <Label htmlFor="zooming">
            Animate the window with zooming effect
          </Label>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="watermark"
            checked={metadata.watermark}
            onCheckedChange={(checked) =>
              setMetadata({ ...metadata, watermark: checked })
            }
          />
          <Label htmlFor="watermark">
            Display the watermark below the window
          </Label>
        </div>
      </div>
    </div>
  )
}

function ThemeSelector({
  value,
  setValue,
}: {
  value: string
  setValue: (value: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[200px] w-fit justify-between"
        >
          {value ? getThemeLabel(value) : 'Select theme...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search theme..." />
          <CommandEmpty>No theme found.</CommandEmpty>
          <CommandGroup className="max-h-[50vh] overflow-y-auto">
            {themes.map((theme) => (
              <CommandItem
                key={theme}
                value={theme}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? '' : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === theme ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {getThemeLabel(theme)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function getThemeLabel(theme: string) {
  return theme
    .split('-')
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(' ')
}
