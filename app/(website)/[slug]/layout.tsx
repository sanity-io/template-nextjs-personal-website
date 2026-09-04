import {permanentRedirect} from 'next/navigation'

import {redirectTarget} from '@/sanity/lib/redirects'

export default async function SlugLayout({children, params}: LayoutProps<'/[slug]'>) {
  // Above the `loading.tsx` boundary, so a retired slug answers with a real 308 before streaming.
  const {slug} = await params
  const to = await redirectTarget(`/${slug}`)
  if (to) permanentRedirect(to)

  return (
    <div>
      <div className="mb-14">{children}</div>
      <div className="absolute left-0 w-screen border-t" />
    </div>
  )
}
