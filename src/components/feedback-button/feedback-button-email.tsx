import { User } from '@prisma/client'
import { Heading } from '@react-email/heading'
import { Html } from '@react-email/html'
import { Preview } from '@react-email/preview'
import { Text } from '@react-email/text'

type Props = {
  user: User
  message: string
}

export function FeedbackButtonEmail({ user, message }: Props) {
  return (
    <Html>
      <Preview>New feedback from {user.email!}</Preview>
      <Heading>New feedback on CodeBit</Heading>
      <Text>
        User: <strong>{user.email!}</strong>
      </Text>
      <pre style={{ padding: 16, borderLeft: '2px solid lightgray' }}>
        {message}
      </pre>
    </Html>
  )
}
