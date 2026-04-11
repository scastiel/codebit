import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Warning } from '@/lib/types'
import { AlertCircle } from 'lucide-react'
import { match } from 'ts-pattern'

export function WarningList({
  warnings,
  goToLine,
}: {
  warnings: Warning[]
  goToLine: (line: number) => void
}) {
  return (
    <ul className="flex flex-col gap-1">
      {warnings.map((warning, index) => (
        <li key={index}>
          <Alert
            role="button"
            className="hover:bg-slate-800"
            onClick={() => 'line' in warning && goToLine(warning.line)}
          >
            <AlertCircle className="w-3.5 h-3.5 mt-1" />
            <AlertTitle className="flex justify-between text-sm">
              <span>
                {match(warning)
                  .with({ type: 'step-already-has-code' }, () => (
                    <>Step already has code</>
                  ))
                  .with({ type: 'step-has-no-code' }, () => (
                    <>Step without code</>
                  ))
                  .with({ type: 'unsupported-content' }, () => (
                    <>Unsupported content</>
                  ))
                  .with({ type: 'invalid-metadata' }, () => (
                    <>Invalid metadata</>
                  ))
                  .with({ type: 'frontmatter-error' }, () => <>Syntax error</>)
                  .with({ type: 'invalid-theme' }, () => <>Invalid theme</>)
                  .with({ type: 'invalid-font' }, () => <>Invalid font</>)
                  .exhaustive()}
              </span>
              {'line' in warning && (
                <span className="text-xs opacity-60">Line {warning.line}</span>
              )}
            </AlertTitle>
            <AlertDescription className="text-xs">
              {match(warning)
                .with({ type: 'step-already-has-code' }, ({ stepIndex }) => (
                  <>Step #{stepIndex} already has code, ignoring.</>
                ))
                .with({ type: 'step-has-no-code' }, ({ afterStepIndex }) => (
                  <>Step after step #{afterStepIndex} has no code, ignoring.</>
                ))
                .with({ type: 'unsupported-content' }, ({ contentType }) => (
                  <>
                    Unsupported element of type <em>{contentType}</em> detected,
                    ignoring.
                  </>
                ))
                .with({ type: 'invalid-metadata' }, ({ property, message }) => (
                  <>
                    Invalid value for metadata <code>{property}</code>.{' '}
                    {message}.
                  </>
                ))
                .with({ type: 'frontmatter-error' }, () => (
                  <>Check the syntax of the content.</>
                ))
                .with({ type: 'invalid-theme' }, ({ theme }) => (
                  <>
                    The color theme <em>{theme}</em> is not available.
                  </>
                ))
                .with({ type: 'invalid-font' }, ({ font }) => (
                  <>
                    The font <em>{font}</em> is not available.
                  </>
                ))
                .exhaustive()}
            </AlertDescription>
          </Alert>
        </li>
      ))}
    </ul>
  )
}
