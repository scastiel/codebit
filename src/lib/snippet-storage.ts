import { parseSnippetMardown } from '@/lib/code-steps-utils'
import { tutorialSnippet } from '@/lib/tutorial-snippet'
import yaml from 'yaml'

export type StoredSnippet = {
  slug: string
  content: string
  createdAt: number
}

const STORAGE_KEY = 'codevideo:snippets:v1'

function isBrowser() {
  return typeof window !== 'undefined'
}

function isStoredSnippet(value: unknown): value is StoredSnippet {
  if (!value || typeof value !== 'object') return false
  const s = value as Record<string, unknown>
  return (
    typeof s.slug === 'string' &&
    typeof s.content === 'string' &&
    typeof s.createdAt === 'number'
  )
}

function readAll(): StoredSnippet[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isStoredSnippet)
  } catch {
    return []
  }
}

function writeAll(snippets: StoredSnippet[]): void {
  if (!isBrowser()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets))
}

function randomSlug(): string {
  if (isBrowser() && window.crypto?.getRandomValues) {
    const bytes = new Uint8Array(3)
    window.crypto.getRandomValues(bytes)
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }
  return Math.random().toString(16).slice(2, 8)
}

export function listSnippets(): StoredSnippet[] {
  return readAll().sort((a, b) => b.createdAt - a.createdAt)
}

export function getSnippet(slug: string): StoredSnippet | null {
  return readAll().find((s) => s.slug === slug) ?? null
}

export function updateSnippet(slug: string, content: string): void {
  const all = readAll()
  const index = all.findIndex((s) => s.slug === slug)
  if (index === -1) return
  all[index] = { ...all[index], content }
  writeAll(all)
}

export function deleteSnippet(slug: string): void {
  writeAll(readAll().filter((s) => s.slug !== slug))
}

const initialMarkdown = () => `---
background: ${Math.round(Math.random() * 100000)}
animatedBackground: true
watermark: true
zooming: true
highlightTheme: github-dark
font: GeistMono
---

\`\`\`ts
console.log("Hello World!")
\`\`\`

---

\`\`\`ts
console.log("Hello Amazing World!")
\`\`\`
`

export function createSnippet(): StoredSnippet {
  const snippet: StoredSnippet = {
    slug: randomSlug(),
    content: initialMarkdown(),
    createdAt: Date.now(),
  }
  writeAll([snippet, ...readAll()])
  return snippet
}

export function createTutorialSnippet(): StoredSnippet {
  const { metadata } = parseSnippetMardown(tutorialSnippet)
  const { speed: _speed, background: _background, ...metadataSubset } = metadata
  const content = `---\n${yaml.stringify({
    ...metadataSubset,
    background: Math.round(Math.random() * 100000),
  })}---\n\n${tutorialSnippet}`
  const snippet: StoredSnippet = {
    slug: randomSlug(),
    content,
    createdAt: Date.now(),
  }
  writeAll([snippet, ...readAll()])
  return snippet
}
