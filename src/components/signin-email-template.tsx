import { Button } from '@react-email/button'
import { Heading } from '@react-email/heading'
import { Html } from '@react-email/html'
import { Preview } from '@react-email/preview'
import { Text } from '@react-email/text'

export function SigninEmailTemplate({ url }: { url: string }) {
  return (
    <Html>
      <Preview>This is your sign in link for CodeBit</Preview>
      <Heading>
        Sign in to <strong>CodeBit</strong>
      </Heading>
      <Button
        href={url}
        style={{
          backgroundColor: '#020617',
          color: '#fff',
          fontSize: '15px',
          textDecoration: 'none',
          display: 'block',
          borderRadius: '6px',
          padding: '8px 16px',
        }}
      >
        Click here to sign in
      </Button>
      <Text>If you didn’t request this, you can just ignore this email.</Text>
    </Html>
  )
}
