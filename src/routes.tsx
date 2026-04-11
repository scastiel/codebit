import { HelpPage } from '@/pages/help-page'
import { LandingPage } from '@/pages/landing-page'
import { SnippetEditorPage } from '@/pages/snippet-editor-page'
import { SnippetsPage } from '@/pages/snippets-page'
import {
  Outlet,
  createRootRoute,
  createRoute,
  redirect,
} from '@tanstack/react-router'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
})

const myRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my',
  beforeLoad: () => {
    throw redirect({ to: '/my/snippets' })
  },
})

const snippetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my/snippets',
  component: SnippetsPage,
})

const snippetEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my/snippets/$snippetSlug',
  component: SnippetEditorPage,
})

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: HelpPage,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  myRedirectRoute,
  snippetsRoute,
  snippetEditorRoute,
  helpRoute,
])
