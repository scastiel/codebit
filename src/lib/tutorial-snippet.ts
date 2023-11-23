export const tutorialSnippet = `
<!--
  ☝️ The section at the top contains settings for the snippet.
  You can change them either manually, or with the selectors
  above the video preview.
-->

<!-- A snippet is a plain Markdown file! -->

<!--
  Each step of the animation is a code block delimited with: \`\`\`
  and separated from the others with: ---
-->

\`\`\`ts
console.log('This is a TypeScript snippet!')
\`\`\`

---

\`\`\`ts
console.log('This is a TypeScript snippet!')
console.log('The language is specified in the code block header')
\`\`\`

---

\`\`\`ts
console.log('This is a TypeScript snippet!')
console.log('The language is specified in the code block header')
console.log('Try to change it: \`\`\`rust for instance :)')
\`\`\`


`.trim()
