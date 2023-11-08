import { Code2 } from 'lucide-react'
import { match } from 'ts-pattern'
import { Watermark } from '../../components/remotion/code-composition'

type Props = { watermark: Watermark }

export function WatermarkText({ watermark }: Props) {
  if (watermark.type === 'none') return null

  const link = (
    <a
      href={process.env.NEXT_PUBLIC_BASE_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Code2 /> <strong>CodeBit.xyz</strong>
    </a>
  )

  return (
    <div className="watermark">
      {match(watermark)
        .with({ type: 'get-your-own' }, () => (
          <>Create your code animation at&nbsp;{link}</>
        ))
        .with({ type: 'url' }, ({ slug }) => (
          <>
            {link} <code>/{slug}</code>
          </>
        ))
        .exhaustive()}
    </div>
  )
}
