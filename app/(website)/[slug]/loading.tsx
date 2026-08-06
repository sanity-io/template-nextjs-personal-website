export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading page" className="animate-pulse space-y-10">
      <div aria-hidden="true" className="space-y-4">
        <div className="h-12 w-2/3 max-w-xl rounded bg-gray-200" />
        <div className="h-6 w-full max-w-2xl rounded bg-gray-100" />
      </div>
      <div aria-hidden="true" className="max-w-3xl space-y-3">
        <div className="h-5 w-full rounded bg-gray-100" />
        <div className="h-5 w-11/12 rounded bg-gray-100" />
        <div className="h-5 w-4/5 rounded bg-gray-100" />
      </div>
    </div>
  )
}
