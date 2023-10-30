import { diffWordsWithSpace, Change } from 'diff'
import GraphemeSplitter from 'grapheme-splitter'
import { Fragment } from 'react'
import { TypeAnimation } from 'react-type-animation'
import 'highlight.js/styles/github.css'
import { HighlightedCode } from '@/components/highlighted-code'

type Props = {
  fromCode: string | null
  toCode: string
  done: () => void
}

const splitter = new GraphemeSplitter()

export function CodeDiff({ fromCode, toCode, done }: Props) {
  const diff = diffWordsWithSpace(fromCode ?? toCode, toCode)
  return <HighlightedCode>{getTypeAnimations(diff, done)}</HighlightedCode>
}

function getTypeAnimations(diff: Change[], done: () => void) {
  let t = 0
  const arr = []
  const keystrokeTime = 50
  for (let i = 0; i < diff.length; i++) {
    if (diff[i].added) {
      arr.push(
        <TypeAnimation
          key={i}
          preRenderFirstString
          sequence={[t, '', diff[i].value]}
          cursor={false}
          speed={{
            type: 'keyStrokeDelayInMs',
            value: keystrokeTime,
          }}
          splitter={(str) => splitter.splitGraphemes(str)}
        />
      )
      t += splitter.countGraphemes(diff[i].value) * keystrokeTime
    } else if (diff[i].removed) {
      arr.push(
        <TypeAnimation
          key={i}
          preRenderFirstString
          sequence={[t, diff[i].value, '']}
          cursor={false}
          deletionSpeed={{
            type: 'keyStrokeDelayInMs',
            value: keystrokeTime,
          }}
          splitter={(str) => splitter.splitGraphemes(str)}
        />
      )
      t += splitter.countGraphemes(diff[i].value) * keystrokeTime
    } else {
      arr.push(<Fragment key={i}>{diff[i].value}</Fragment>)
    }
  }
  arr.push(
    <TypeAnimation
      key={diff.length}
      preRenderFirstString
      sequence={['', t, done]}
      cursor={false}
    />
  )
  return arr
}
