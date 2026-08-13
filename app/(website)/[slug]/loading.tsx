export default function SlugLoading() {
  return (
    <div aria-busy>
      <div className="w-5/6 lg:w-3/5">
        <div className="h-10 w-2/3 animate-pulse rounded bg-gray-200 md:h-12" />
        <div className="mt-4 h-6 w-full animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  )
}
