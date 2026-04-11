import { TopBar } from '@/components/top-bar'
import { useEffect } from 'react'

export function HelpPage() {
  useEffect(() => {
    document.title = 'Help – CodeBit'
  }, [])

  return (
    <div className="flex-1 flex flex-col">
      <TopBar />
      <main className="w-full my-10 px-4 max-w-screen-lg mx-auto prose dark:prose-invert lg:prose-xl">
        <h1>How to use CodeBit</h1>

      <p>
        In CodeBit, a code animation is called a <strong>snippet</strong>, which
        contains several <strong>steps</strong>, i.e. several versions of the
        code.
      </p>

      <ul>
        <li>The animation will display one step after the other;</li>
        <li>
          The transition between each step is based on a <em>diff</em>{' '}
          algorithm, simulating key strokes.
        </li>
      </ul>

      <h2>Format of a snippet definition</h2>

      <p>Here is an example of a snippet definition:</p>

      <pre>
        <code>{`---
theme: dark
background: 60665
---

\`\`\`ts
console.log("Hello World!")
\`\`\`

---

\`\`\`ts
console.log("Hello Amazing World!")
\`\`\``}</code>
      </pre>

      <p>Notice that:</p>

      <ol>
        <li>The syntax is plain Markdown</li>
        <li>
          It includes some configuration in the <em>frontmatter</em> (the part
          between <code>---</code> in the header)
        </li>
        <li>
          Each step is a code block delimited by <code>```ts</code> (
          <code>ts</code> is for TypeScript; feel free to try different
          languages) and separated with <code>---</code>.
        </li>
      </ol>

      <p>
        You can specify a file name on each code block, that will be displayed
        at top. You can also define several files in your snippets, creating an
        animation when switching from one file to another.
      </p>

      <pre>
        <code>{`\`\`\`ts filename="hello.ts"
console.log("Hello World!")
\`\`\``}</code>
      </pre>

      <h2>Configuration options</h2>

      <ul>
        <li>
          <code>theme</code> can be either <code>light</code> or{' '}
          <code>dark</code> (default)
        </li>
        <li>
          <code>background</code> is a number used to generate a random
          background mesh gradient. Try different values to find the best one.
        </li>
        <li>
          <code>animatedBackground</code>: whether the background is animated or
          not. Default is <code>true</code>, set it to <code>false</code> to
          disable.
        </li>
        <li>
          <code>watermark</code> controls whether a reference to CodeBit is
          displayed at the bottom. It is <code>false</code> by default.
        </li>
        <li>
          <code>zooming</code> defines if the animation should show a zooming
          effect. Default is <code>true</code>; set to <code>false</code> to
          disable it.
        </li>
      </ul>

      <h2>Some tips for better animations</h2>

      <p>
        Creating different versions of the same code for animation can be
        exhausting, as a tiny change at the beginning forces you to change every
        step after.
      </p>

      <p>
        Here are a few tips we discovered when using our application to make it
        easier:
      </p>

      <ol>
        <li>
          Start with the <strong>first</strong> and the <strong>last</strong>{' '}
          steps of your animation, then continue with intermediate steps of
          your explanation, and end with steps that are here only for animation
          tweaking.
        </li>
        <li>
          If the animation isn’t exactly the one you want, add extra steps. For
          instance, if a step adds a line of code between two lines, it might
          look nicer if you first add an empty line, then add the line content:
        </li>
      </ol>

      <pre>
        <code>{`\`\`\`ts
first()
third()
\`\`\`

---

\`\`\`ts
first()

third()
\`\`\`

---

\`\`\`ts
first()
second()
third()
\`\`\``}</code>
      </pre>

      <h2>Anything unclear? Do you have other tips?</h2>

      <p>
        We’re constantly working on improving the snippet creation experience.
        If anything is unclear or if you want to share any other tips, shout us
        an email at{' '}
        <a href="mailto:hello@codebit.xyz">hello@codebit.xyz</a>.
      </p>
      </main>
    </div>
  )
}
