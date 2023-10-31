import { RedirectType, redirect } from 'next/navigation'

export default function MyPage() {
  redirect('/my/snippets', RedirectType.replace)
}
