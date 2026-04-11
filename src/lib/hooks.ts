import { useEffect, useState } from 'react'

export function useIsBrowser() {
  const [browser, setBrowser] = useState(false)
  useEffect(() => {
    if (!browser) setBrowser(true)
  }, [browser])

  return browser
}
