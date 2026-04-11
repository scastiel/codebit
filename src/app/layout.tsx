import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { env } from '@/lib/env'
import type { Metadata } from 'next'
import PlausibleProvider from 'next-plausible'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  title: {
    default: 'Tell a story with your code – CodeBit',
    template: '%s – CodeBit',
  },
  description:
    'Create animations from code snippets, and export them as videos to share with your community.',
  openGraph: {
    title: 'Tell a story with your code – CodeBit',
    description:
      'Create animations from code snippets, and export them as videos to share with your community.',
    images: `/banner.png`,
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@codebitxyz',
    site: '@codebitxyz',
    images: `/banner.png`,
    title: 'Tell a story with your code – CodeBit',
    description:
      'Create animations from code snippets, and export them as videos to share with your community.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      {env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
        <PlausibleProvider
          domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          trackOutboundLinks
        />
      )}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              function patch(proto){
                if(!proto) return;
                var d = Object.getOwnPropertyDescriptor(proto, 'fontStretch');
                if(!d || !d.set) return;
                var orig = d.set;
                Object.defineProperty(proto, 'fontStretch', Object.assign({}, d, {
                  set: function(v){
                    if(typeof v === 'string' && v.charAt(v.length-1) === '%'){
                      orig.call(this, 'normal'); return;
                    }
                    try { orig.call(this, v); } catch(e){ orig.call(this, 'normal'); }
                  }
                }));
              }
              if(typeof CanvasRenderingContext2D !== 'undefined') patch(CanvasRenderingContext2D.prototype);
              if(typeof OffscreenCanvasRenderingContext2D !== 'undefined') patch(OffscreenCanvasRenderingContext2D.prototype);
            })();`,
          }}
        />
      </head>
      <body className="min-h-[100dvh] flex flex-col bg-gradient-to-br from-slate-950 to-slate-800">
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
