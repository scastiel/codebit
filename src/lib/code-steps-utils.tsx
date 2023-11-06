import fm from 'front-matter'
import { lexer } from 'marked'
import {
  Metadata,
  SnippetParsingResult,
  Steps,
  Warning,
  metadataSchema,
} from '../lib/types'

export function parseSnippetMardown(markdown: string): SnippetParsingResult {
  const { attributes, body, bodyBegin } = fm(markdown)
  const metadataParseResult = metadataSchema.safeParse(attributes)
  const metadata: Metadata = metadataParseResult.success
    ? metadataParseResult.data
    : metadataSchema.parse({})
  let metadataWarnings: Warning[] = []
  if (!metadataParseResult.success) {
    metadataWarnings = metadataParseResult.error.issues.map((issue) => ({
      type: 'invalid-metadata',
      line: 1,
      property: issue.path.join('.'),
      message: issue.message,
    }))
  }
  const { steps, warnings } = parseMarkdown(body, bodyBegin)
  return { steps, warnings: [...metadataWarnings, ...warnings], metadata }
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
          steps[currentStep] = { code: token.text, lang: token.lang }
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
