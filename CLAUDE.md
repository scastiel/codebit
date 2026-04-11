# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Commands

- `npm run dev` — Next.js dev server on port 3000
- `npm run build` / `npm start` — production build/serve
- `npm run lint` — `next lint`
- `npm test` — Jest (jsdom). Run one test with `npx jest path/to/file.test.ts` or `-t 'name'`
- `npm run remotion-studio` — Remotion Studio pointed at `src/remotion/index.ts` for previewing the composition in isolation

TypeScript path alias: `@/*` → `src/*`.

## Architecture

**CodeBit** is a Next.js 14 (App Router) web app that turns markdown-defined code snippets into animated videos. It is **fully client-side**: no backend, no database, no accounts, no billing. Snippets live in `localStorage`; videos are rendered in the browser via `@remotion/web-renderer` (WebCodecs) and downloaded as MP4.

### The snippet → video pipeline

The markdown snippet format is the central data model. Everything else is a transform over it:

1. **Authoring.** A snippet is markdown with YAML front matter (background, font, watermark, zooming, highlightTheme…) plus fenced code blocks separated by `---`. Each fenced block is one "step" — the diff between consecutive steps drives the typing/replace animation. Templates: the `initialMarkdown()` inside `src/lib/snippet-storage.ts` and `src/lib/tutorial-snippet.ts` / `src/lib/landing-page-snippet.ts`.
2. **Parsing.** `src/lib/code-steps-utils.tsx` (`parseSnippetMardown`) parses front matter with `front-matter`, validates it against `metadataSchema` (Zod, in `src/lib/types.ts`), falls back to defaults for invalid theme/font, and lexes the body with `marked` to produce `Steps` + `Warning[]`. Parse warnings surface in the editor UI via `warning-list.tsx`.
3. **Composition data.** `src/components/remotion/composition-data.ts` turns steps into per-frame data consumed by the Remotion composition (`code-composition.tsx`), including timings. `compositionDurationInFrames` is the source of truth for video length.
4. **Preview vs render.** The same Remotion composition is used two ways, both client-side:
   - **Preview** via `@remotion/player` in `src/components/snippet-player.tsx`.
   - **MP4 export** via `renderMediaOnWeb()` in `src/components/generate-button.tsx` — produces a Blob via WebCodecs, triggers a download, no network call. `licenseKey: 'free-license'` is passed.

### Web-renderer caveats

`@remotion/web-renderer` (experimental) has strict CSS limits. Don't introduce:

- `radial-gradient` (use `<canvas>` — see `gradient-canvas.tsx` + `gradients.ts:drawGradientOnCanvas`)
- `z-index` (use DOM order instead — the window chrome in `code-composition.tsx` relies on this)
- `clip-path`, `backdrop-filter`, `mix-blend-mode`
- Safari `filter` is broken (pre-accepted)

Canvas2D `fontStretch` setter rejects the `"100%"` value modern browsers return for `font-stretch: normal`. The shim in `src/lib/canvas-shim.ts` (and an inline `<script>` in `src/app/layout.tsx` that runs at page parse time) monkey-patches both `CanvasRenderingContext2D.prototype` and `OffscreenCanvasRenderingContext2D.prototype` to silently map any percentage to `'normal'`.

### Persistence

All snippet state lives in `localStorage` under key `codevideo:snippets:v1`. API in `src/lib/snippet-storage.ts`:

```ts
listSnippets(): StoredSnippet[]
getSnippet(slug): StoredSnippet | null
createSnippet(): StoredSnippet       // random 6-char hex slug, seeded with initialMarkdown
createTutorialSnippet(): StoredSnippet
updateSnippet(slug, content): void
deleteSnippet(slug): void
```

Preview thumbnails in the snippet list are derived on the fly from the last fenced code block (`derivePreview()` in `snippet-list-item.tsx`) — there is no cached preview column.

### App routes

- `src/app/page.tsx` — landing page (plays `landing-page-snippet.ts` via `landing-player.tsx`)
- `src/app/my/snippets` — snippet list (client-only, reads from localStorage)
- `src/app/my/snippets/[snippetSlug]` — snippet editor (client-only)
- `src/app/help` — plain TSX page with Tailwind `prose` styling (no MDX)

`TopBar` (`src/components/top-bar.tsx`) is shared between `/my/` and `/help` layouts. The landing page uses its own `LandingPageMenu`.

### Theme

The app is **dark-only**. `ThemeProvider` in `src/app/layout.tsx` uses `forcedTheme="dark"`. **Do not call `useTheme().theme`** — it returns `'system'` (the internal default) under `forcedTheme`, not `'dark'`. Use `resolvedTheme`, or just hardcode dark values. Examples: `code-editor.tsx` hardcodes Monaco's `github-dark`; `snippet-list.tsx` hardcodes the `github-dark.css` highlight stylesheet. The body has an unconditional `bg-gradient-to-br from-slate-950 to-slate-800`.

### UI conventions

shadcn/ui primitives in `src/components/ui/` (config in `components.json`). Tailwind + `tailwind-merge`/`clsx` via `cn()` in `src/lib/utils.ts`. Monaco is the markdown editor (`src/components/code-editor.tsx` wrapping `src/components/markdown-editor.tsx`, themes in `src/lib/monaco-themes.ts`). `ts-pattern` is used for exhaustive pattern matching on tagged unions — prefer it over chained `if`/`switch`.

### Third-party services

Only **Plausible Analytics** — opt-in via `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env var. If unset, no provider renders and no analytics script loads. Everything else is bundled client code.
