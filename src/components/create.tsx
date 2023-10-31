'use client'

import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Button } from './ui/button'

type Props = {
  onCodeFetched: (code: string) => void
}

export function Create({ onCodeFetched }: Props) {
  const [fUrl, setUrl] = useState(
    'https://gist.githubusercontent.com/maxday/330310ba31dfcb4613dc7331c25f9dce/raw/9551c965c2f56b4cde5c2b886af4d2c31b2ece8d/gistfile1.txt',
  )
  const fetchData = async (url: any) => {
    const req = await fetch(url)
    const newData = await req.text()
    onCodeFetched(newData)
  }

  return (
    <form
      className="flex gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        fetchData(fUrl)
      }}
    >
      <Input
        type="text"
        className="flex-1"
        placeholder="https://raw.githubusercontent.com/..."
        value={fUrl}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button variant="secondary" type="submit">
        Import from URL
      </Button>
    </form>
  )
}
