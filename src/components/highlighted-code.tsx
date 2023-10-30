import hljs from 'highlight.js'
import { ReactNode, useEffect, useRef } from 'react'

type Props = {
  children: ReactNode
}

export function HighlightedCode({ children }: Props) {
  const hiddenRef = useRef<HTMLElement>(null)
  const visibleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const hidden = hiddenRef.current
    const visible = visibleRef.current
    if (hidden && visible) {
      const highlight = () => {
        visible.innerHTML = hljs.highlight(hidden.innerText, {
          language: 'ts',
        }).value
      }
      highlight()
      const observer = new MutationObserver(() => {
        if (visible && hidden) {
          highlight()
        }
      })
      observer.observe(hiddenRef.current, { subtree: true, childList: true })
    }
  }, [])

  return (
    <pre>
      <code className="hidden" ref={hiddenRef}>
        {children}
      </code>
      <code className="language-typescript" ref={visibleRef}></code>
    </pre>
  )
}
