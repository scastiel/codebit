import { getPrisma } from '@/lib/prisma'
import { Render } from '@prisma/client'

export async function getRendersForUser(userId: string): Promise<Render[]> {
  return getPrisma().render.findMany({
    where: { userId },
    orderBy: { startedAt: 'desc' },
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
  snippetId: string,
): Promise<string | null> {
  const render = await getPrisma().render.findFirst({
    where: { snippetId },
    orderBy: { id: 'desc' },
  })
  return render ? render.id : null
}
