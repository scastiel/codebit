import { getPrisma } from '@/lib/prisma'
import { Snippet } from '@prisma/client'
import { User } from 'next-auth'

export async function createSnippet(user: User): Promise<Snippet> {
  return getPrisma().snippet.create({
    data: {
      userId: user.id,
      content:
        '```ts\nconsole.log("Hello World!")\n```\n\n---\n\n```ts\nconsole.log("Hello Amazing World!")\n```\n',
    },
  })
}

export async function getSnippets(user: User): Promise<Snippet[]> {
  return getPrisma().snippet.findMany({
    where: { userId: user.id },
    orderBy: { id: 'desc' },
  })
}

export async function getSnippet(
  snippetId: Snippet['id'],
): Promise<Snippet | null> {
  return getPrisma().snippet.findFirst({ where: { id: snippetId } })
}
