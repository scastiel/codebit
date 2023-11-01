import { getCodeFragments } from '@/lib/code-steps-utils'
import { getPrisma } from '@/lib/prisma'
import { Snippet } from '@prisma/client'
import { User } from 'next-auth'

export async function createSnippet(user: User): Promise<Snippet> {
  const content =
    '---\ntheme: dark\n---\n\n```ts\nconsole.log("Hello World!")\n```\n\n---\n\n```ts\nconsole.log("Hello Amazing World!")\n```\n'
  const { steps } = getCodeFragments(content)
  const lastStep = steps[steps.length - 1]
  return getPrisma().snippet.create({
    data: {
      userId: user.id,
      content,
      preview: lastStep?.code,
      previewLang: lastStep?.lang,
    },
  })
}

export async function getSnippets(
  user: User,
): Promise<Pick<Snippet, 'id' | 'preview' | 'previewLang'>[]> {
  return getPrisma().snippet.findMany({
    where: { userId: user.id },
    orderBy: { id: 'desc' },
    select: { id: true, preview: true, previewLang: true },
  })
}

export async function getSnippet(
  snippetId: Snippet['id'],
): Promise<Snippet | null> {
  return getPrisma().snippet.findFirst({ where: { id: snippetId } })
}
