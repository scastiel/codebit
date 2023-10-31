export function getCodeFragments(input: string) {
  return input.split(/\n+---\n+/).map((page) => {
    const [, lang, code] = page.match(/```([^\n]*)\n(.*)```/s) ?? []
    return { lang, code }
  })
}
