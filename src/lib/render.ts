import { getPrisma } from '@/lib/prisma'
import { Render } from '@prisma/client'

export async function getRendersForUser(userId: string) {
  return getPrisma().render.findMany({
    where: { userId },
    orderBy: { startedAt: 'desc' },
    include: { snippet: { select: { slug: true } } },
  })
}

export async function getRender(
  renderId: string,
  userId: string,
): Promise<Render | null> {
  const render = await getPrisma().render.findUnique({
    where: { id: renderId },
  })
  return render && render?.userId === userId ? render : null
}

export async function getLastRenderId(
  snippetSlug: string,
): Promise<string | null> {
  const render = await getPrisma().render.findFirst({
    where: { snippet: { slug: snippetSlug } },
    orderBy: { id: 'desc' },
  })
  return render ? render.id : null
}
