import { gradientStyleFromSeed } from '@/components/remotion/gradients'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Metadata } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Moon, Shuffle, Sun } from 'lucide-react'

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
        <Tabs
          value={metadata.theme}
          onValueChange={(theme: string) =>
            setMetadata({ ...metadata, theme: theme as 'light' | 'dark' })
          }
        >
          <TabsList>
            <TabsTrigger value="light">
              <Sun />
            </TabsTrigger>
            <TabsTrigger value="dark">
              <Moon />
            </TabsTrigger>
          </TabsList>
        </Tabs>
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
