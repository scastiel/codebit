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
  animate: boolean
}

const splitter = new GraphemeSplitter()

function diffCode(from: string, to: string) {
  const reverseString = (str: string) =>
    splitter.splitGraphemes(str).reverse().join('')
  return diffWordsWithSpace(
    `\n${reverseString(from)}\n`,
    `\n${reverseString(to)}\n`
  )
    .reverse()
    .map((change, index, arr) => {
      let value = reverseString(change.value)
      if (index === 0) value = value.replace(/^\n/, '')
      if (index === arr.length - 1) value = value.replace(/\n$/, '')
      return { ...change, value }
    })
}

export function CodeDiff({ fromCode, toCode, done, animate }: Props) {
  const diff = diffCode(animate && fromCode ? fromCode : toCode, toCode)
  return <HighlightedCode>{getTypeAnimations(diff, done)}</HighlightedCode>
}

function getTypeAnimations(diff: Change[], done: () => void) {
  let t = 0
  const arr = []
  const keystrokeTime = 50
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
          value: keystrokeTime,
        }}
        deletionSpeed={{
          type: 'keyStrokeDelayInMs',
          value: keystrokeTime,
        }}
        splitter={(str) => splitter.splitGraphemes(str)}
      />
    )

    if (diff[i].added || diff[i].removed) {
      t += splitter.countGraphemes(diff[i].value) * keystrokeTime
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
