import type {StudioPathLike} from '@sanity/client/csm'
import {createDataAttribute, stegaClean} from 'next-sanity'

import {TimelineItem, type TimelineMilestone} from '@/components/TimelineItem'
import {studioUrl} from '@/sanity/lib/api'

import {OptimisticSortOrder} from './OptimisticSortOrder'

interface TimelineEntry {
  _key: string
  title?: string | null
  milestones?: Array<TimelineMilestone> | null
}

export function TimelineSection({
  timelines,
  id,
  type,
  path,
}: {
  timelines: Array<TimelineEntry> | null | undefined
  id: string | null
  type: string | null
  path: StudioPathLike
}) {
  const dataAttribute =
    id && type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id,
          type,
          path,
        })
      : null

  return (
    <div
      className="flex flex-col gap-4 pt-16 text-black md:flex-row"
      data-sanity={dataAttribute?.()}
    >
      <OptimisticSortOrder id={id} path={path}>
        {timelines?.map((timeline) => {
          const {title, milestones, _key} = timeline
          return (
            <div
              className="max-w-[80%] md:max-w-[50%]"
              key={_key}
              data-sanity={dataAttribute?.([{_key}])}
            >
              <div className="pb-5 font-sans text-xl font-bold">{stegaClean(title)}</div>
              <OptimisticSortOrder
                id={id}
                path={[...(Array.isArray(path) ? path : [path]), {_key}, 'milestones']}
              >
                {milestones?.map((experience) => (
                  <div
                    key={experience._key}
                    data-sanity={dataAttribute?.([{_key}, 'milestones', {_key: experience._key}])}
                    className="group"
                  >
                    <TimelineItem milestone={stegaClean(experience)} />
                  </div>
                ))}
              </OptimisticSortOrder>
            </div>
          )
        })}
      </OptimisticSortOrder>
    </div>
  )
}
