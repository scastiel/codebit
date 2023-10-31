'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from './ui/button'
import React, { useState } from 'react';

import { useStep } from "../contexts/StepContext";

function getCodeFragments(input: string) {
  return input.split(/\n+---\n+/).map((page) => {
    const [, lang, code] = page.match(/```([^\n]*)\n(.*)```/s) ?? []
    return { lang, code }
  })
}

export function Create() {
  const { sStep } = useStep();
  const [fUrl, setUrl] = useState('');
  const fetchData = async (url: any) => {
    const req = await fetch(url);
    const newData = await req.text();
    const steps = getCodeFragments(newData);
    sStep(steps);
  };

  const handleClick = () => {
    console.log(fUrl);
    fetchData(fUrl);
  };

  return (
    <Card className="m-4">
      <CardHeader />
      <CardContent>
        Create from GitHub raw url:
        <input
          type="text"
          className="w-full p-2 mt-2 border rounded-md"
          placeholder="https://raw.githubusercontent.com/..."
          onChange={e => setUrl(e.target.value)} />
        <Button
          variant="secondary"
          onClick={() => {
            handleClick();
          }}
        >Submit</Button>
      </CardContent>
    </Card>
  )
}
