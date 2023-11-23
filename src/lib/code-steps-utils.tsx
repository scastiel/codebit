import fm from 'front-matter'
import { lexer } from 'marked'
import { CodeVideoOptions } from '../components/remotion/code-composition'
import {
  compositionDurationInFrames,
  getCompositionData,
} from '../components/remotion/composition-data'
import { fonts, themes } from '../components/remotion/themes'
import { Plan } from '../lib/plans'
import {
  Metadata,
  SnippetParsingResult,
  Steps,
  Warning,
  metadataSchema,
} from '../lib/types'

export function parseSnippetMardown(markdown: string): SnippetParsingResult {
  try {
    const { attributes, body, bodyBegin } = fm(markdown)
    const metadataParseResult = metadataSchema.safeParse(attributes)
    const metadata: Metadata = metadataParseResult.success
      ? metadataParseResult.data
      : metadataSchema.parse({})
    const metadataWarnings: Warning[] = []
    if (!metadataParseResult.success) {
      metadataWarnings.push(
        ...metadataParseResult.error.issues.map((issue) => ({
          type: 'invalid-metadata' as const,
          line: 1 as const,
          property: issue.path.join('.'),
          message: issue.message,
        })),
      )
    }
    if (!themes.includes(metadata.highlightTheme)) {
      metadataWarnings.push({
        type: 'invalid-theme',
        theme: metadata.highlightTheme,
      })
      metadata.highlightTheme = 'github-dark'
    }
    if (!Object.keys(fonts).includes(metadata.font)) {
      metadataWarnings.push({
        type: 'invalid-font',
        font: metadata.font,
      })
      metadata.font = 'GeistMono'
    }
    const { steps, warnings } = parseMarkdown(body, bodyBegin)
    return { steps, warnings: [...metadataWarnings, ...warnings], metadata }
  } catch (err) {
    const warnings: Warning[] = [{ type: 'frontmatter-error', line: 1 }]
    const metadata = metadataSchema.parse({})
    const steps: Steps = []
    return { warnings, steps, metadata }
  }
}

export function getPlanWarnings(
  options: CodeVideoOptions,
  plan: Plan,
): Warning[] {
  const warnings: Warning[] = []
  const compositionData = getCompositionData({ ...options, multiFile: true })

  if (!plan.multiFile) {
    const filenames = new Set(
      compositionData.sequences.map((seq) => seq.filename).filter(Boolean),
    )
    if (filenames.size > 1)
      warnings.push({
        type: 'forbidden-multifile',
        filenames: Array.from(filenames),
      })
  }

  const durationInFrames = compositionDurationInFrames(compositionData)
  if (options.watermark.type === 'none' && plan.watermark === true) {
    warnings.push({ type: 'required-watermark' })
  }
  if (
    options.maxDurationInSeconds &&
    durationInFrames > 30 * options.maxDurationInSeconds
  ) {
    warnings.push({
      type: 'too-long-video',
      durationInSeconds: durationInFrames / 30,
      maxDurationInSeconds: options.maxDurationInSeconds,
    })
  }
  return warnings
}

function parseMarkdown(markdown: string, firstLineIndex: number) {
  const tokens = lexer(markdown)
  const warnings: Warning[] = []
  let currentStep = 0
  let currentLine = firstLineIndex
  const steps: Steps = []
  for (const token of tokens) {
    switch (token.type) {
      case 'space':
        break // noop
      case 'code':
        if (steps[currentStep]) {
          warnings.push({
            line: currentLine,
            type: 'step-already-has-code',
            stepIndex: currentStep,
          })
        } else {
          const [lang, ...codeMeta] =
            (token.lang as string | undefined)?.split(/\s+/) ?? []
          const meta = Object.fromEntries(
            codeMeta.map((meta) => {
              const [key, value] = meta.split('=')
              return [key, value.replace(/^"(.*)"$/, '$1')]
            }),
          )
          steps[currentStep] = {
            code: token.text,
            lang,
            filename: meta.filename,
          }
        }
        break
      case 'hr':
        if (!steps[currentStep]) {
          warnings.push({
            line: currentLine,
            type: 'step-has-no-code',
            afterStepIndex: currentStep,
          })
        } else {
          currentStep++
        }
        break
      default:
        warnings.push({
          line: currentLine,
          type: 'unsupported-content',
          contentType: token.type,
          stepIndex: currentStep,
        })
    }
    const lineCount = token.raw.split('\n').length - 1
    currentLine += lineCount
  }

  return { steps, warnings }
}
