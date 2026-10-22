'use client'

import type {QueryResponse} from './projectSlugPage.groq'

interface ProjectDurationProps {
  /**
   * Typed straight off the `.groq` module. A type-only import needs no `with {type: 'text'}`
   * attribute and is erased at compile time, so the query text stays out of the client bundle.
   */
  'duration': NonNullable<QueryResponse>['duration']
  'data-sanity-start'?: string
  'data-sanity-end'?: string
}

export function ProjectDuration(props: ProjectDurationProps) {
  const {duration} = props
  const startYear = duration?.start ? new Date(duration.start).getFullYear() : undefined
  const endYear = duration?.end ? new Date(duration.end).getFullYear() : 'Now'

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
