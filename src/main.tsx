import { Toaster } from '@/components/ui/toaster'
import '@/lib/canvas-shim'
import { env } from '@/lib/env'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './globals.css'
import { routeTree } from './routes'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

if (env.VITE_PLAUSIBLE_DOMAIN) {
  const script = document.createElement('script')
  script.defer = true
  script.src = 'https://plausible.io/js/script.outbound-links.js'
  script.dataset.domain = env.VITE_PLAUSIBLE_DOMAIN
  document.head.appendChild(script)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>,
)
