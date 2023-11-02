import { CodeEditor } from '@/components/code-editor'
import { Button } from '@/components/ui/button'
import { getCodeFragments } from '@/lib/code-steps-utils'
import { env } from '@/lib/env'
import { getPrisma } from '@/lib/prisma'
import { getLastRenderId } from '@/lib/render'
import { getSnippet } from '@/lib/snippet'
import { getCurrentUser, getCurrentUserOrRedirect } from '@/lib/user'
import { renderMediaOnLambda } from '@remotion/lambda/client'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Edit snippet',
}

export default async function SnippetPage({
  params: { snippetId },
}: {
  params: { snippetId: string }
}) {
  const user = await getCurrentUserOrRedirect(
    `${env.NEXT_PUBLIC_BASE_URL}/my/snippets/${snippetId}`,
  )
  const snippet = await getSnippet(snippetId)
  if (!snippet) notFound()
  if (snippet.userId !== user.id) {
    return <p>You are not authorized to edit this snippet.</p>
  }
  const lastRenderId = await getLastRenderId(snippetId)

  async function saveSnippetAction(content: string) {
    'use server'
    const snippet = await getSnippet(snippetId)
    if (!snippet) throw new Error('Missing snippet')
    const user = await getCurrentUser()
    if (!user || user.id !== snippet.userId) throw new Error('Unauthorized')

    const { steps } = getCodeFragments(snippet.content)
    const lastStep = steps[steps.length - 1]

    await getPrisma().snippet.update({
      where: { id: snippet.id },
      data: { content, preview: lastStep?.code, previewLang: lastStep?.lang },
    })
    revalidatePath(`/my/snippets/${snippet.id}`)
    revalidatePath(`/${snippet.id}`)
  }

  async function generateVideoAction() {
    'use server'
    const snippet = await getSnippet(snippetId)
    if (!snippet) throw new Error('Missing snippet')
    const user = await getCurrentUser()
    if (!user || user.id !== snippet.userId) throw new Error('Unauthorized')

    const webhookBaseUrl = env.NEXT_PUBLIC_BASE_URL.startsWith('http://localhost:') ? env.NGROK_URL : env.NEXT_PUBLIC_BASE_URL;

    const { bucketName, renderId } = await renderMediaOnLambda({
      region: env.REMOTION_AWS_REGION as any,
      functionName: env.REMOTION_AWS_FUNCTION_NAME,
      composition: 'Code',
      serveUrl: env.REMOTION_SERVE_URL,
      codec: 'h264',
      inputProps: {
        markdown: snippet.content,
      },
      webhook: {
            url: `${webhookBaseUrl}/api/remotion-webhook`,
            secret: null,
          },
    })

    const { id } = await getPrisma().render.create({
      data: { bucketName, renderId, snippetId, userId: user.id },
      select: { id: true },
    })
    return id
  }

  return (
    <div className="flex flex-col">
      <div className="px-4">
        <Button variant="ghost" asChild>
          <Link href="/my/snippets">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to snippets</span>
          </Link>
        </Button>
      </div>
      <div className="flex-1 flex [&>div]:w-full">
        <CodeEditor
          snippetId={snippet.id}
          initialContent={snippet.content}
          saveSnippetAction={saveSnippetAction}
          generateVideoAction={generateVideoAction}
          lastRenderId={lastRenderId}
        />
      </div>
    </div>
  )
}
