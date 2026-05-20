export default function Loading() {
  return (
    <div className="w-5/6 space-y-4 lg:w-3/5">
      <div className="h-10 w-3/4 animate-pulse rounded bg-gray-100 md:h-14" />
      <div className="mt-4 space-y-2">
        <div className="h-5 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-5 w-5/6 animate-pulse rounded bg-gray-100" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  )
}
