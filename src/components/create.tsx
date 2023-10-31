'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useState } from 'react'
import { Button } from './ui/button'

import { useStep } from '../contexts/steps-context'

function getCodeFragments(input: string) {
  return input.split(/\n+---\n+/).map((page) => {
    const [, lang, code] = page.match(/```([^\n]*)\n(.*)```/s) ?? []
    return { lang, code }
  })
}

export function Create() {
  const { updateSteps } = useStep()
  const [fUrl, setUrl] = useState(
    'https://gist.githubusercontent.com/maxday/330310ba31dfcb4613dc7331c25f9dce/raw/9551c965c2f56b4cde5c2b886af4d2c31b2ece8d/gistfile1.txt',
  )
  const fetchData = async (url: any) => {
    const req = await fetch(url)
    const newData = await req.text()
    const steps = getCodeFragments(newData)
    updateSteps(steps)
  }

  const handleClick = () => {
    fetchData(fUrl)
  }

  return (
    <Card className="m-4">
      <CardHeader />
      <CardContent>
        Create from GitHub raw url:
        <input
          type="text"
          className="w-full p-2 mt-2 border rounded-md"
          placeholder="https://raw.githubusercontent.com/..."
          value={fUrl}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
          variant="secondary"
          onClick={() => {
            handleClick()
          }}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  )
}
