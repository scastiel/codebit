export const input = `
\`\`\`ts
type User = { name: string }

export async function createUser(user: User) {
  'use server'
  console.log(\`User name: \${user.name}\`)
}
\`\`\`

---

\`\`\`ts
type User = { name: string }

export async function createUser(user: User) {
  'use server'
  console.log(\`User name: \${user.name}\`)
  // ⛔️ \`user\` can be anything!
}
\`\`\`

---

\`\`\`ts
type User = { name: string }

export async function createUser(user: User) {
  'use server'
  console.log(\`User name: \${user.name}\`)
}
\`\`\`

---

\`\`\`ts
// Let’s use a Zod schema to define the User type
type User = { name: string }

export async function createUser(user: User) {
  'use server'
  console.log(\`User name: \${user.name}\`)
}
\`\`\`

---

\`\`\`ts
// Let’s use a Zod schema to define the User type
import z from 'zod'
const userSchema = z.object({ name: z.string() })
type User = { name: string }

export async function createUser(user: User) {
  'use server'
  console.log(\`User name: \${user.name}\`)
}
\`\`\`

---

\`\`\`ts
// Let’s use a Zod schema to define the User type
import z from 'zod'
const userSchema = z.object({ name: z.string() })
type User = z.infer<typeof userSchema>

export async function createUser(user: User) {
  'use server'
  console.log(\`User name: \${user.name}\`)
}
\`\`\`

---

\`\`\`ts
// Let’s use a Zod schema to define the User type
import z from 'zod'
const userSchema = z.object({ name: z.string() })
type User = z.infer<typeof userSchema>

// Let’s define the parameter as \`unknown\`
export async function createUser(user: User) {
  'use server'
  console.log(\`User name: \${user.name}\`)
}
\`\`\`

---

\`\`\`ts
// Let’s use a Zod schema to define the User type
import z from 'zod'
const userSchema = z.object({ name: z.string() })
type User = z.infer<typeof userSchema>

// Let’s define the parameter as \`unknown\`
export async function createUser(param: unknown) {
  'use server'
  console.log(\`User name: \${user.name}\`)
}
\`\`\`

---

\`\`\`ts
// Let’s use a Zod schema to define the User type
import z from 'zod'
const userSchema = z.object({ name: z.string() })
type User = z.infer<typeof userSchema>

// Let’s define the parameter as \`unknown\`
export async function createUser(param: unknown) {
  'use server'
  // We can parse \`params\` with the schema
  console.log(\`User name: \${user.name}\`)
}
\`\`\`

---

\`\`\`ts
// Let’s use a Zod schema to define the User type
import z from 'zod'
const userSchema = z.object({ name: z.string() })
type User = z.infer<typeof userSchema>

// Let’s define the parameter as \`unknown\`
export async function createUser(param: unknown) {
  'use server'
  // We can parse \`params\` with the schema
  const user = userSchema.parse(param)
  console.log(\`User name: \${user.name}\`)
}
\`\`\`

---

\`\`\`ts
// Let’s use a Zod schema to define the User type
import z from 'zod'
const userSchema = z.object({ name: z.string() })
type User = z.infer<typeof userSchema>

// Let’s define the parameter as \`unknown\`
export async function createUser(param: unknown) {
  'use server'
  // We can parse \`params\` with the schema
  const user = userSchema.parse(param)
  // ✅ \`user\` is a User!
  console.log(\`User name: \${user.name}\`)
}
\`\`\`

`.trim()
