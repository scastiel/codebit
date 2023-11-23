import { gradientStyleFromSeed } from '@/components/remotion/gradients'
import { fonts, themes } from '@/components/remotion/themes'
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
import {
  Check,
  ChevronsUpDown,
  Paintbrush,
  Settings,
  Shuffle,
  Type,
} from 'lucide-react'
import { ReactNode, useState } from 'react'

const backgroundSeedsCount = 17

type Props = {
  metadata: Metadata
  setMetadata: (metadata: Metadata) => void
  exportButton: ReactNode
}

export function SnippetSettingsToolbar({
  metadata,
  setMetadata,
  exportButton,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1">
        <ThemeSelector
          value={metadata.highlightTheme}
          setValue={(highlightTheme) =>
            setMetadata({ ...metadata, highlightTheme })
          }
        />

        <FontSelector
          value={metadata.font}
          setValue={(font) => {
            const f = Object.keys(fonts).find((f) => f.toLowerCase() === font)
            if (f) setMetadata({ ...metadata, font: f })
          }}
        />

        <BackgroundSelector
          background={metadata.background}
          setBackground={(background) =>
            setMetadata({ ...metadata, background })
          }
          animatedBackground={metadata.animatedBackground}
          setAnimatedBackground={(animatedBackground) =>
            setMetadata({ ...metadata, animatedBackground })
          }
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Settings className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="zooming"
                  checked={metadata.zooming}
                  onCheckedChange={(checked) =>
                    setMetadata({ ...metadata, zooming: checked })
                  }
                />
                <Label htmlFor="zooming" className="leading-4">
                  Zooming effect
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
                <Label htmlFor="watermark">Display watermark</Label>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex-1" />
        {exportButton}
      </div>
    </div>
  )
}

function BackgroundSelector({
  background,
  setBackground,
  animatedBackground,
  setAnimatedBackground,
}: {
  background: number
  setBackground: (background: number) => void
  animatedBackground: boolean
  setAnimatedBackground: (animatedBackground: boolean) => void
}) {
  const backgroundSeeds = Array.from(Array(backgroundSeedsCount)).map(
    (_, i) =>
      Math.floor(background / backgroundSeedsCount) * backgroundSeedsCount + i,
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button role="combobox" className="w-12 flex p-2" variant="outline">
          <div
            className="w-full h-full rounded-[3px]"
            style={gradientStyleFromSeed(background)}
          ></div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex flex-col gap-4">
        <div className="grid grid-cols-6 gap-1">
          {backgroundSeeds.map((seed) => (
            <Button
              key={seed}
              className={cn(
                'border rounded-lg w-full h-8',
                seed === background && 'ring',
              )}
              style={gradientStyleFromSeed(seed)}
              onClick={() => {
                setBackground(seed)
              }}
            />
          ))}
          <Button
            variant="secondary"
            className="border rounded-lg w-full h-8 p-1"
            onClick={() => {
              setBackground(Math.round(Math.random() * 100000))
            }}
          >
            <Shuffle className="w-3 h-3" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="animated-background"
            checked={animatedBackground}
            onCheckedChange={setAnimatedBackground}
          />
          <Label htmlFor="animated-background">Animate the background</Label>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function FontSelector({
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
          className="flex text-left w-[150px]"
        >
          <Type className="w-4 h-4 mr-2" />
          <span className="flex-1 overflow-hidden text-ellipsis">
            {value ?? 'Select font...'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search font..." />
          <CommandEmpty>No theme found.</CommandEmpty>
          <CommandGroup className="max-h-[50vh] overflow-y-auto">
            {Object.keys(fonts).map((font) => (
              <CommandItem
                key={font}
                value={font}
                onSelect={(value) => {
                  setValue(value)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === font ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <span className={`font-${font}`}>{font}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
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
          className="w-[150px]"
        >
          <Paintbrush className="w-4 h-4 mr-2" />
          <span className="flex-1 text-left overflow-hidden text-ellipsis">
            {value ? getThemeLabel(value) : 'Select theme...'}
          </span>
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
                onSelect={(value) => {
                  setValue(value)
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
