import { ThemeProvider } from '@/components/theme-provider'
import type { Metadata } from 'next'
import PlausibleProvider from 'next-plausible'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Share animated code snippets with your community – CodeBit',
    template: '%s – CodeBit',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <PlausibleProvider domain="codevideo.vercel.app" trackOutboundLinks />
      <body className="min-h-screen flex flex-col dark:bg-gradient-to-br dark:from-slate-950 dark:to-slate-800">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
