import { parseSnippetMardown } from '@/lib/code-steps-utils'
import { getPrisma } from '@/lib/prisma'
import { tutorialSnippet } from '@/lib/tutorial-snippet'
import { Snippet } from '@prisma/client'
import { User } from 'next-auth'
import yaml from 'yaml'

export async function createSnippet(user: User): Promise<Snippet> {
  const background = Math.round(Math.random() * 100000)
  const content = `---\ntheme: dark\nbackground: ${background}\n---\n\n\`\`\`ts\nconsole.log("Hello World!")\n\`\`\`\n\n---\n\n\`\`\`ts\nconsole.log("Hello Amazing World!")\n\`\`\`\n`
  const { steps } = parseSnippetMardown(content)
  const lastStep = steps[steps.length - 1]
  return getPrisma().snippet.create({
    data: {
      slug: Math.random().toString(16).slice(2, 8),
      userId: user.id,
      content,
      preview: lastStep?.code,
      previewLang: lastStep?.lang,
    },
  })
}

export async function getSnippets(
  user: User,
): Promise<Pick<Snippet, 'id' | 'slug' | 'preview' | 'previewLang'>[]> {
  return getPrisma().snippet.findMany({
    where: { userId: user.id },
    orderBy: { id: 'desc' },
    select: { id: true, slug: true, preview: true, previewLang: true },
  })
}

export async function getSnippetById(
  snippetId: Snippet['id'],
): Promise<Snippet | null> {
  return getPrisma().snippet.findFirst({ where: { id: snippetId } })
}

export async function getSnippetBySlug(
  snippetSlug: Snippet['slug'],
): Promise<Snippet | null> {
  return getPrisma().snippet.findFirst({ where: { slug: snippetSlug } })
}

export async function createTutorialSnippet(user: User) {
  const content = tutorialSnippet
  const { steps, metadata } = parseSnippetMardown(content)
  const { speed, background, ...metadataSubset } = metadata
  const lastStep = steps[steps.length - 1]
  return getPrisma().snippet.create({
    data: {
      slug: Math.random().toString(16).slice(2, 8),
      userId: user.id,
      content: `---\n${yaml.stringify({
        ...metadataSubset,
        background: Math.round(Math.random() * 100000),
      })}---\n\n${content}`,
      preview: lastStep?.code,
      previewLang: lastStep?.lang,
    },
  })
}
