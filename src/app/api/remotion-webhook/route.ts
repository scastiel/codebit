import { env } from '@/lib/env'
import { getPrisma } from '@/lib/prisma'
import { WebhookPayload } from '@remotion/lambda/client'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  if (req.method === 'OPTIONS') {
    return new NextResponse()
  }

  const payload = (await req.json()) as WebhookPayload
  if (payload.type !== 'success') {
    console.warn(
      `Rendering ${payload.bucketName}/${payload.renderId} failed (${payload.type}).`,
    )
  }

  await getPrisma().render.update({
    where: {
      bucketName_renderId: {
        bucketName: payload.bucketName,
        renderId: payload.renderId,
      },
    },
    data: {
      done: payload.type === 'success',
      error: payload.type !== 'success',
      endedAt: new Date(),
      videoUrl:
        payload.type === 'success'
          ? `https://${payload.bucketName}.s3.${env.REMOTION_AWS_REGION}.amazonaws.com/renders/${payload.renderId}/out.mp4`
          : null,
    },
  })

  return NextResponse.json({ success: true })
}
