export const landingPageSnippet = `
---
theme: dark
background: 94261
---

\`\`\`ts filename="src/app/layout.tsx"
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
\`\`\`

---

\`\`\`ts filename="src/app/layout.tsx"
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
\`\`\`

---

\`\`\`ts filename="src/app/layout.tsx"
import PlausibleProvider from ''

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
\`\`\`

---

\`\`\`ts filename="src/app/layout.tsx"
import PlausibleProvider from 'next-plausible'

export default function RootLayout({ children }) {
  return (
    <html>
      
      <body>{children}</body>
    </html>
  )
}
\`\`\`

---

\`\`\`ts filename="src/app/layout.tsx"
import PlausibleProvider from 'next-plausible'

export default function RootLayout({ children }) {
  return (
    <html>
      <PlausibleProvider domain="codebit.xyz" />
      <body>{children}</body>
    </html>
  )
}
\`\`\`

---

\`\`\`ts filename="src/app/layout.tsx"
import PlausibleProvider from 'next-plausible'

export default function RootLayout({ children }) {
  return (
    <html>
      <PlausibleProvider domain="codebit.xyz" />
      <body>{children}</body>
    </html>
  )
}
\`\`\`

---

\`\`\`js filename="next.config.js"
module.exports = { /* your Next.js config */ }
\`\`\`

---

\`\`\`js filename="next.config.js"


module.exports = { /* your Next.js config */ }
\`\`\`

---

\`\`\`js filename="next.config.js"
const { withPlausibleProxy } = require('')

module.exports = { /* your Next.js config */ }
\`\`\`

---

\`\`\`js filename="next.config.js"
const { withPlausibleProxy } = require('next-plausible')

module.exports = { /* your Next.js config */ }
\`\`\`

---

\`\`\`js filename="next.config.js"
const { withPlausibleProxy } = require('next-plausible')

module.exports = withPlausibleProxy()({ /* your Next.js config */ })
\`\`\`

---

\`\`\`ts filename="src/app/layout.tsx"
import PlausibleProvider from 'next-plausible'

export default function RootLayout({ children }) {
  return (
    <html>
      <PlausibleProvider domain="codebit.xyz" />
      <body>{children}</body>
    </html>
  )
}
\`\`\`

---

\`\`\`ts filename="src/app/layout.tsx"
import PlausibleProvider from 'next-plausible'
// Just to test the return to a previous file :)
export default function RootLayout({ children }) {
  return (
    <html>
      <PlausibleProvider domain="codebit.xyz" />
      <body>{children}</body>
    </html>
  )
}
\`\`\`
`.trim()
