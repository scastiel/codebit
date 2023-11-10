import { ThemeProvider } from '@/components/theme-provider'
import type { Metadata } from 'next'
import PlausibleProvider from 'next-plausible'
import './globals.css'
import Script from 'next/script'

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
      <Script id="datadog-rum">
           {`
             (function(h,o,u,n,d) {
               h=h[d]=h[d]||{q:[],onReady:function(c){h.q.push(c)}}
               d=o.createElement(u);d.async=1;d.src=n
               n=o.getElementsByTagName(u)[0];n.parentNode.insertBefore(d,n)
             })(window,document,'script','https://www.datadoghq-browser-agent.com/us1/v5/datadog-rum.js','DD_RUM')
             window.DD_RUM.onReady(function() {
               window.DD_RUM.init({
                 clientToken: '${process.env.NEXT_PUBLIC_DD_RUM_CLIENT_TOKEN}',
                 applicationId: '${process.env.NEXT_PUBLIC_DD_RUM_APPLICATION_ID}',
                 site: 'datadoghq.com',
                 service: 'next-app-router-rum',
                 env: 'dev',
                 // Specify a version number to identify the deployed version of your application in Datadog
                 // version: '1.0.0',
                 sessionSampleRate: 100,
                 sessionReplaySampleRate: 100,
                 trackUserInteractions: true,
                 trackResources: true,
                 trackLongTasks: true,
               });
             })
           `}
      </Script>
      <PlausibleProvider domain="codebit.xyz" trackOutboundLinks />
      <body className="min-h-[100dvh] flex flex-col dark:bg-gradient-to-br dark:from-slate-950 dark:to-slate-800">
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
