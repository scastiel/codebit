import { env } from '@/lib/env'
import { getPrisma } from '@/lib/prisma'
import { getSnippet } from '@/lib/snippet'
import { getCurrentUser } from '@/lib/user'
import { Snippet } from '@prisma/client'
import { renderMediaOnLambda } from '@remotion/lambda/client'
import { NextResponse } from 'next/server'
import rateLimiter from '../../../utils/rate-limiter'

const limiter = rateLimiter()

export async function POST(req: Request) {
  const user = await getCurrentUser() // first thing: check that user is authenticated

  const { searchParams } = new URL(req.url)
  const snippetId = searchParams.get('snippetId')
  if (!snippetId)
    return NextResponse.json({ error: 'Missing snippet ID' }, { status: 422 })

  const snippet = await getSnippet(snippetId)
  if (!snippet)
    return NextResponse.json({ error: 'Snippet not found' }, { status: 422 })
  if (user.id !== snippet.userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { isRateLimited, headers } = limiter.check(
    env.RATE_LIMIT_RENDER_REQUEST_PER_MINUTE,
    `${snippet.id}-render`,
  )
  if (isRateLimited)
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers },
    )

  const renderId = await triggerRender(snippet)
  return NextResponse.json({ renderId }, { headers })
}

async function triggerRender(snippet: Snippet) {
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
  const snippetId = snippet.id
  const userId = snippet.userId
  const { id } = await getPrisma().render.create({
    data: { bucketName, renderId, snippetId, userId },
    select: { id: true },
  })
  return id
}
