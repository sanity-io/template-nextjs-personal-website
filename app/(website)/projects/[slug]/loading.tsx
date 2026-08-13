export default function ProjectSlugLoading() {
  return (
    <div className="space-y-6" aria-busy data-testid="project-loading">
      <div className="w-5/6 lg:w-3/5">
        <div className="h-10 w-2/3 animate-pulse rounded bg-gray-200 md:h-12" />
        <div className="mt-4 h-6 w-full animate-pulse rounded bg-gray-100" />
      </div>
      <div className="overflow-hidden rounded-md border">
        <div className="relative aspect-[16/9] animate-pulse bg-gray-200" />
      </div>
    </div>
  )
}
