import { getPrisma } from '@/lib/prisma'
import { Render } from '@prisma/client'

export async function getRendersForUser(userId: string): Promise<Render[]> {
  return getPrisma().render.findMany({
    where: { userId },
  })
}
