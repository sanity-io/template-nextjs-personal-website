import { TimelineItem } from 'components/pages/page/TimelineItem'
import type { MilestoneItem } from 'types'

interface TimelineItem {
  title: string
  milestones: MilestoneItem[]
}

export function TimelineSection({ timelines }: { timelines: TimelineItem[] }) {
  return (
    <div className="flex gap-2 pt-16">
      {timelines?.map((timeline, key) => {
        const { title, milestones } = timeline
        return (
          <div className="max-w-[50%]" key={key}>
            <div className="pb-5 text-xl font-bold">{title}</div>

            {milestones?.map((experience, index) => (
              <div key={index}>
                <TimelineItem
                  milestone={experience}
                  isLast={milestones.length - 1 === index}
                />
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
