export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading project"
      className="animate-pulse space-y-6"
    >
      <div aria-hidden="true" className="space-y-4">
        <div className="h-12 w-2/3 max-w-xl rounded bg-gray-200" />
        <div className="h-6 w-full max-w-2xl rounded bg-gray-100" />
      </div>
      <div aria-hidden="true" className="overflow-hidden rounded-md border">
        <div className="aspect-[16/9] bg-gray-100" />
        <div className="grid grid-cols-1 divide-y lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {Array.from({length: 4}, (_, index) => (
            <div className="space-y-3 p-3 lg:p-4" key={index}>
              <div className="h-3 w-16 rounded bg-gray-100" />
              <div className="h-5 w-24 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="max-w-3xl space-y-3">
        <div className="h-5 w-full rounded bg-gray-100" />
        <div className="h-5 w-5/6 rounded bg-gray-100" />
      </div>
    </div>
  )
}
