import { continueRender, delayRender, staticFile } from 'remotion'

export async function loadFonts() {
  const waitForFont = delayRender()

  const fonts = [
    new FontFace(
      `GeistMono`,
      `url('${staticFile('fonts/GeistMono-Regular.woff2')}') format('woff2')`,
    ),
    new FontFace(
      `Geist`,
      `url('${staticFile('fonts/Geist-Regular.woff2')}') format('woff2')`,
    ),
    new FontFace(
      `Geist`,
      `url('${staticFile('fonts/Geist-SemiBold.woff2')}') format('woff2')`,
      { weight: '600' },
    ),
  ]

  try {
    for (const font of fonts) {
      await font.load()
      document.fonts.add(font)
    }
    continueRender(waitForFont)
  } catch (err) {
    console.error('Error loading fonts:', err)
  }
}
