'use client'

import type {QueryResponse} from '#queries/projectSlugPage.groq'

interface ProjectDurationProps {
  /**
   * Typed straight off the `.groq` module. A type-only import needs no loader and is erased at
   * compile time, so the query text stays out of the client bundle.
   */
  'duration': NonNullable<QueryResponse>['duration']
  'data-sanity-start'?: string
  'data-sanity-end'?: string
}

export function ProjectDuration(props: ProjectDurationProps) {
  const {duration} = props
  // UTC so the server render and hydration agree regardless of either side's timezone.
  const startYear = duration?.start ? new Date(duration.start).getUTCFullYear() : undefined
  const endYear = duration?.end ? new Date(duration.end).getUTCFullYear() : 'Now'

  if (!(startYear && endYear)) {
    return null
  }

  return (
    <div className="p-3 lg:p-4">
      <div className="text-xs md:text-sm">Duration</div>
      <div className="text-md md:text-lg">
        <span data-sanity={props['data-sanity-start']}>{startYear}</span>
        {' - '}
        <span data-sanity={props['data-sanity-end']}>{endYear}</span>
      </div>
    </div>
  )
}
