'use client'
import { SnippetPlayer } from '@/components/snippet-player'
import useSize from '@react-hook/size'
import { useEffect, useRef, useState } from 'react'

export function LandingPlayer() {
  const playerRef = useRef<HTMLDivElement | null>(null)
  const [width, height] = useSize(playerRef)

  const [browser, setBrowser] = useState(false)
  useEffect(() => setBrowser(true), [])

  const fontSize = Math.min(Math.max(8, Math.min(0.02 * width, 16)))

  return (
    <div className="w-full max-w-2xl rounded-[10px] p-[2px] bg-gradient-to-b from-slate-100 to-slate-800">
      <div
        className="w-full h-full aspect-video overflow-hidden rounded-[8px]"
        ref={playerRef}
      >
        {browser && width > 0 && height > 0 && (
          <SnippetPlayer
            snippet={{ content: snippet }}
            width={width}
            height={height}
            fontSize={fontSize}
            autoMode
            watermark={false}
          />
        )}
      </div>
    </div>
  )
}

const snippet = `
\`\`\`ts
console.log("Hi there 👋")
\`\`\`

---

\`\`\`ts

\`\`\`

---

\`\`\`ts
console.log("")
\`\`\`

---

\`\`\`ts
console.log("Ready to tell a story with your code?")
\`\`\`

---

\`\`\`ts
console.log("Ready to tell a story with your code?")


\`\`\`

---

\`\`\`ts
console.log("Ready to tell a story with your code?")

console.log("")
\`\`\`

---

\`\`\`ts
console.log("Ready to tell a story with your code?")

console.log("Did you notice that this is *not* a video?")
\`\`\`

---

\`\`\`ts
console.log("Ready to tell a story with your code?")

console.log("Did you notice that this is *not* a video?")


\`\`\`

---

\`\`\`ts
console.log("Ready to tell a story with your code?")

console.log("Did you notice that this is *not* a video?")

if (interested) {
  
}
\`\`\`

---

\`\`\`ts
console.log("Ready to tell a story with your code?")

console.log("Did you notice that this is *not* a video?")

if (interested) {
  console.log("")
}
\`\`\`

---

\`\`\`ts
console.log("Ready to tell a story with your code?")

console.log("Did you notice that this is *not* a video?")

if (interested) {
  console.log("Enter your email to know when we go public!")
}
\`\`\`

---

\`\`\`ts
console.log("Ready to tell a story with your code?")

console.log("Did you notice that this is *not* a video?")

if (interested) {
  console.log("Enter your email to know when we go public!")
  // 👇
}
\`\`\`

---

\`\`\`ts
console.log("Ready to tell a story with your code?")

console.log("Did you notice that this is *not* a video?")

if (interested) {
  console.log("Enter your email to know when we go public!")
  // 👇 👇
}
\`\`\`

---

\`\`\`ts
console.log("Ready to tell a story with your code?")

console.log("Did you notice that this is *not* a video?")

if (interested) {
  console.log("Enter your email to know when we go public!")
  // 👇 👇 👇
}
\`\`\`
`
