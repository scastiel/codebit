import { env } from '@/lib/env'
import { getPrisma } from '@/lib/prisma'
import { getSnippet } from '@/lib/snippet'
import { getCurrentUser } from '@/lib/user'
import { Snippet } from '@prisma/client'
import { renderMediaOnLambda } from '@remotion/lambda/client'
import { NextResponse } from 'next/server'
import rateLimiter from '../../../utils/rate-limiter'

const limiter = rateLimiter()

const getSecureSnippet = async (snippetId: string | null) => {
  try {
    if (!snippetId) throw new Error('Missing snippetId')
    const user = await getCurrentUser()
    const snippet = await getSnippet(snippetId)
    if (!snippet) throw new Error('Missing snippet')
    if (user.id !== snippet.userId) throw new Error('Unauthorized')
    return snippet
  } catch {
    throw new Error('Unauthorized')
  }
}

const render = async (headers: Headers, snippet: Snippet) => {
  try {
    const renderId = await triggerRender(snippet)
    return NextResponse.json({ renderId }, { headers })
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const snippetId = searchParams.get('snippetId')
  try {
    const snippet = await getSecureSnippet(snippetId)
    try {
      const headers = await limiter.check(
        env.RATE_LIMIT_RENDER_REQUEST_PER_MINUTE,
        `${snippet.id}-render`,
      )
      const renderId = await render(headers, snippet)
      return NextResponse.json({ renderId }, { headers })
    } catch (e) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 },
      )
    }
  } catch (e) {
    throw e
  }
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
