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

  if (!render.videoUrl) {
    return new NextResponse('No video to download', { status: 400 })
  }

  const response = await fetch(render.videoUrl)

  return new NextResponse(response.body, {
    headers: {
      ...response.headers, // copy the previous headers
      'content-disposition': `attachment; filename="code-video.mp4"`,
    },
  })
}
