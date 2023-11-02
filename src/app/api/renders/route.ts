import { env } from '@/lib/env'
import { getPrisma } from '@/lib/prisma'
import { getSnippet } from '@/lib/snippet'
import { TriggerRenderPayload } from '@/lib/types'
import { renderMediaOnLambda } from '@remotion/lambda/client'
import { NextResponse } from 'next/server'
import rateLimiter from '../../../utils/rate-limiter'

const limiter = rateLimiter()

export async function POST(req: Request) {
  const payload = (await req.json()) as TriggerRenderPayload
  try {
    const headers = await limiter.check(
      env.RATE_LIMIT_RENDER_REQUEST_PER_MINUTE,
      `${payload.userId}-render`,
    )
    try {
      await triggerRender(payload.snippetId, payload.userId)
    } catch (error) {
      return NextResponse.json({ error }, { status: 400 })
    }
    return NextResponse.json({ msg: 'Success' }, { headers })
  } catch (e) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }
}

async function triggerRender(snippetId: string, userId: string) {
  const snippet = await getSnippet(snippetId)
  if (!snippet) throw new Error('Missing snippet')
  if (userId !== snippet.userId) throw new Error('Unauthorized')

  const { bucketName, renderId } = await renderMediaOnLambda({
    region: env.REMOTION_AWS_REGION as any,
    functionName: env.REMOTION_AWS_FUNCTION_NAME,
    composition: 'Code',
    serveUrl: env.REMOTION_SERVE_URL,
    codec: 'h264',
    inputProps: {
      markdown: snippet.content,
    },
    webhook: env.NEXT_PUBLIC_BASE_URL.startsWith('http://localhost:')
      ? undefined
      : {
          url: `${env.NEXT_PUBLIC_BASE_URL}/api/remotion-webhook`,
          secret: null,
        },
  })

  const { id } = await getPrisma().render.create({
    data: { bucketName, renderId, snippetId, userId },
    select: { id: true },
  })
  return id
}
