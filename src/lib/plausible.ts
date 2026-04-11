type PlausibleFn = (event: string, options?: { props?: Record<string, unknown> }) => void

declare global {
  interface Window {
    plausible?: PlausibleFn
  }
}

export function trackEvent(event: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  window.plausible?.(event, props ? { props } : undefined)
}
