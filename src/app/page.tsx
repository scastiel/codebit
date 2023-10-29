import { CodeSteps } from '@/components/code-steps'
import { input } from '@/mocks/input'

export default async function Home() {
  return (
    <main>
      <CodeSteps steps={getCodeFragments(input)} />
      {/* <pre>{JSON.stringify(getCodeFragments(input), null, 2)}</pre> */}
    </main>
  )
}

function getCodeFragments(input: string) {
  return input.split(/\n+---\n+/).map((page) => {
    const [, lang, code] = page.match(/```([^\n]*)\n(.*)```/s) ?? []
    return { lang, code }
  })
}
