/* eslint-disable @next/next/no-html-link-for-pages */
interface PreviewBannerProps {
  loading?: boolean
}

export function PreviewBanner({ loading }: PreviewBannerProps) {
  return (
    <div
      className={`${
        loading ? 'animate-pulse' : ''
      } bg-black p-3 text-center text-white`}
    >
      {'Previewing draft content. '}
      <a
        className="underline transition hover:opacity-50"
        href="/api/disable-draft"
      >
        Disable draft mode
      </a>
    </div>
  )
}
