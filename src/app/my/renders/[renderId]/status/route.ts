import { getRender } from '@/lib/render'
import { getCurrentUser } from '@/lib/user'
import { notFound } from 'next/navigation'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { renderId: string } },
) {
  const user = await getCurrentUser()
  const render = await getRender(params.renderId, user.id)
  if (!render) notFound()

  return NextResponse.json({
    done: render.done,
    error: render.error,
    videoUrl: render.videoUrl,
  })
}
