import { FeedbackButtonClient } from '@/components/feedback-button/feedback-button-client'
import { formSchema } from '@/components/feedback-button/feedback-button-common'
import { FeedbackButtonEmail } from '@/components/feedback-button/feedback-button-email'
import { getResend } from '@/lib/resend'
import { getCurrentUser } from '@/lib/user'

export function FeedbackButton() {
  async function sendFeedback(values: unknown) {
    'use server'
    const user = await getCurrentUser()
    const { message } = formSchema.parse(values)
    await getResend().emails.send({
      from: 'no-reply@scastiel.dev',
      to: 'hello@codebit.xyz',
      subject: `CodeBit: new feedback from ${user.email}`,
      react: <FeedbackButtonEmail user={user} message={message} />,
    })
  }

  return <FeedbackButtonClient sendFeedback={sendFeedback} />
}
