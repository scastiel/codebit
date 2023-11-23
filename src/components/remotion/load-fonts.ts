import { fonts } from '@/components/remotion/themes'
import { continueRender, delayRender, staticFile } from 'remotion'

export async function loadFonts() {
  const waitForFont = delayRender()

  const fontFaces = [
    ...Object.entries(fonts).map(
      ([fontName, filename]) =>
        new FontFace(
          fontName,
          `url('${staticFile(filename)}') format('woff2')`,
        ),
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
    for (const font of fontFaces) {
      await font.load()
      document.fonts.add(font)
    }
    continueRender(waitForFont)
  } catch (err) {
    console.error('Error loading fonts:', err)
  }
}
