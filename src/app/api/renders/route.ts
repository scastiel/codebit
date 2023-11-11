import {
  CodeVideoOptions,
  CodeVideoProps,
} from '@/components/remotion/code-composition'
import { parseSnippetMardown } from '@/lib/code-steps-utils'
import { env } from '@/lib/env'
import { getPlan } from '@/lib/plans'
import { getPrisma } from '@/lib/prisma'
import { getSnippetBySlug } from '@/lib/snippet'
import {
  getActiveUserPlanId,
  getCurrentUser,
  hasRemainingCredits,
} from '@/lib/user'
import { Snippet } from '@prisma/client'
import { renderMediaOnLambda } from '@remotion/lambda/client'
import { NextResponse } from 'next/server'
import rateLimiter from '../../../utils/rate-limiter'

const limiter = rateLimiter()

export async function POST(req: Request) {
  const user = await getCurrentUser() // first thing: check that user is authenticated

  const { searchParams } = new URL(req.url)
  const snippetSlug = searchParams.get('snippetSlug')
  if (!snippetSlug)
    return NextResponse.json({ error: 'Missing snippet slug' }, { status: 422 })

  const snippet = await getSnippetBySlug(snippetSlug)
  if (!snippet)
    return NextResponse.json({ error: 'Snippet not found' }, { status: 422 })
  if (user.id !== snippet.userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { isRateLimited, headers } = limiter.check(
    env.RATE_LIMIT_RENDER_REQUEST_PER_MINUTE,
    `${user.id}-render`,
  )
  if (isRateLimited || !hasRemainingCredits(user))
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers },
    )

  const renderId = await triggerRender(snippet)
  return NextResponse.json({ renderId }, { headers })
}

async function triggerRender(snippet: Snippet) {
  const plan = getPlan(await getActiveUserPlanId(snippet.userId))
  const { metadata } = parseSnippetMardown(snippet.content)
  const options: CodeVideoOptions = {
    markdown: snippet.content,
    fontSize: 24,
    watermark:
      plan.watermark || metadata.watermark
        ? { type: 'url', slug: snippet.slug }
        : { type: 'none' },
    maxDurationInSeconds: plan.maxVideoDurationInSeconds,
  }
  const { bucketName, renderId } = await renderMediaOnLambda({
    region: env.REMOTION_AWS_REGION as any,
    functionName: env.REMOTION_AWS_FUNCTION_NAME,
    composition: 'Code',
    serveUrl: env.REMOTION_SERVE_URL,
    codec: 'h264',
    inputProps: { options } as CodeVideoProps,
    webhook: {
      url: `${env.REMOTION_WEBHOOK_URL}/api/remotion-webhook`,
      secret: null,
    },
    muted: true,
  })
  await getPrisma().user.update({
    where: { id: snippet.userId },
    data: { monthlyRemainingCredits: { decrement: 1 } },
  })
  const snippetId = snippet.id
  const userId = snippet.userId
  const { id } = await getPrisma().render.create({
    data: { bucketName, renderId, snippetId, userId },
    select: { id: true },
  })
  return id
}
