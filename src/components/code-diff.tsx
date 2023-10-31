import { HighlightedCode } from '@/components/highlighted-code'
import { Change, diffWordsWithSpace } from 'diff'
import GraphemeSplitter from 'grapheme-splitter'
import 'highlight.js/styles/github.css'
import { TypeAnimation } from 'react-type-animation'

type Props = {
  fromCode: string | null
  toCode: string
  done: () => void
  animate: boolean
  keystrokeDelay: number
}

const splitter = new GraphemeSplitter()

function diffCode(from: string, to: string) {
  const reverseString = (str: string) =>
    splitter.splitGraphemes(str).reverse().join('')
  return diffWordsWithSpace(
    `\n${reverseString(from)}\n`,
    `\n${reverseString(to)}\n`,
  )
    .reverse()
    .map((change, index, arr) => {
      let value = reverseString(change.value)
      if (index === 0) value = value.replace(/^\n/, '')
      if (index === arr.length - 1) value = value.replace(/\n$/, '')
      return { ...change, value }
    })
}

export function CodeDiff({
  fromCode,
  toCode,
  done,
  animate,
  keystrokeDelay,
}: Props) {
  const diff = diffCode(animate && fromCode ? fromCode : toCode, toCode)
  return (
    <HighlightedCode>
      {getTypeAnimations(diff, keystrokeDelay, done)}
    </HighlightedCode>
  )
}

function getTypeAnimations(
  diff: Change[],
  keystrokeDelay: number,
  done: () => void,
) {
  let t = 0
  const arr = []
  for (let i = 0; i < diff.length; i++) {
    arr.push(
      <TypeAnimation
        key={i}
        preRenderFirstString
        sequence={
          diff[i].added
            ? [t, '', diff[i].value]
            : diff[i].removed
            ? [t, diff[i].value, '']
            : [diff[i].value]
        }
        cursor={false}
        speed={{
          type: 'keyStrokeDelayInMs',
          value: keystrokeDelay,
        }}
        deletionSpeed={{
          type: 'keyStrokeDelayInMs',
          value: keystrokeDelay,
        }}
        splitter={(str) => splitter.splitGraphemes(str)}
      />,
    )

    if (diff[i].added || diff[i].removed) {
      t += splitter.countGraphemes(diff[i].value) * keystrokeDelay
    }
  }
  arr.push(
    <TypeAnimation
      key={diff.length}
      preRenderFirstString
      sequence={['', t, done]}
      cursor={false}
    />,
  )
  return arr
}
