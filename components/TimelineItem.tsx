import type {InferImageValue} from 'next-sanity/image'

import ImageBox from '@/components/ImageBox'
import type {QueryResults} from '@/sanity/lib/queryResults'

export interface TimelineMilestone {
  _key: string
  title?: string | null
  description?: string | null
  // oxlint-disable-next-line typescript/no-redundant-type-constituents -- inferred from `.groq` imports oxlint cannot see
  image?: InferImageValue<QueryResults> | null
  tags?: Array<string | null> | null
  duration?: {
    start?: string | null
    end?: string | null
  } | null
}

export function TimelineItem({milestone}: {milestone: TimelineMilestone}) {
  const {description, duration, image, tags, title} = milestone
  const startYear = duration?.start ? new Date(duration.start).getFullYear() : undefined
  const endYear = duration?.end ? new Date(duration.end).getFullYear() : 'Now'

  return (
    <div className="flex min-h-[200px] font-sans last:pb-2">
      <div className="flex flex-col">
        {/* Thumbnail */}
        <div
          className="relative overflow-hidden rounded-md bg-black"
          style={{width: '65px', height: '65px'}}
        >
          <ImageBox
            image={image}
            alt={title || 'Timeline item icon'}
            classesWrapper="h-full"
            size="10vw"
          />
        </div>
        {/* Vertical line */}
        <div className="mt-2 w-px grow self-center bg-gray-200 group-last:hidden" />
      </div>
      <div className="flex-initial pl-4">
        {/* Title */}
        <div className="font-bold text-black">{title}</div>
        {/* Tags */}
        <div className="text-sm text-gray-600">
          {tags?.map((tag, key) => (
            <span key={key}>
              {tag}
              <span className="mx-1">●</span>
            </span>
          ))}
          {startYear} - {endYear}
        </div>
        {/* Description */}
        <div className="pt-3 pb-5 font-serif text-gray-600">{description}</div>
      </div>
    </div>
  )
}
