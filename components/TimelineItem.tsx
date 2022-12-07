import type { MilestoneItem } from '../types'

export function TimelineItem({
  isLast,
  milestone,
}: {
  isLast: boolean
  milestone: MilestoneItem
}) {
  const { title, description, tags, duration } = milestone
  const startYear = new Date(duration?.start).getFullYear()
  const endYear = duration?.end ? new Date(duration.end).getFullYear() : 'Now'

  return (
    <div className={`flex min-h-[200px] ${!isLast && 'pb-2'}`}>
      <div className="flex flex-col">
        <div
          className="rounded-md bg-black dark:bg-white"
          style={{ width: '65px', height: '65px' }}
        ></div>
        {!isLast && <div className="mt-2 w-px grow self-center bg-gray-200" />}
      </div>
      <div className="flex-initial pl-4">
        <div className="text-black dark:text-white">{title}</div>
        <div className="text-sm text-gray-600 ">
          {tags?.map((tag, key) => (
            <span key={key}>
              {tag}
              <span className="mx-1">●</span>
            </span>
          ))}
          {startYear} - {endYear}
        </div>
        <div className="pt-3 font-serif text-gray-600">{description}</div>
      </div>
    </div>
  )
}
