import { useSyncExternalStore } from 'react'

/* eslint-disable @next/next/no-html-link-for-pages */
interface PreviewBannerProps {
  loading?: boolean
}

const subscribe = () => () => {}

export function PreviewBanner({ loading }: PreviewBannerProps) {
  const shouldShow = useSyncExternalStore(
    subscribe,
    () => window.top === window,
    () => false,
  )

  if (!shouldShow) return null

  return (
    <div
      className={`${
        loading ? 'animate-pulse' : ''
      } bg-black p-3 text-center text-white`}
    >
      {'Previewing drafts. '}
      <a
        className="underline transition hover:opacity-50"
        href="/api/disable-draft"
      >
        Back to published
      </a>
    </div>
  )
}
