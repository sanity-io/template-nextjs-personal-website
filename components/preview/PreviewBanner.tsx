/* eslint-disable @next/next/no-html-link-for-pages */
interface PreviewBannerProps {
  loading?: boolean
}

export function PreviewBanner({ loading }: PreviewBannerProps) {
  return (
    <div className="bg-black p-3 text-center text-white">
      {loading ? 'Loading...' : 'This page is a preview.'}{' '}
      <a
        className="underline transition hover:opacity-50"
        href="/api/exit-preview"
      >
        Exit preview mode
      </a>
    </div>
  )
}
