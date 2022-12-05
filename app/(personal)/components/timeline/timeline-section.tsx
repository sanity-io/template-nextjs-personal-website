import { TimelineItem } from './timeline-item'

interface TimelineItem {
  title: string
  milestones: object[]
}

export function TimelineSection({ timelines }: { timelines: TimelineItem[] }) {
  return (
    <div className="flex pt-16">
      {timelines.map((timeline, key) => {
        const { title, milestones } = timeline
        return (
          <div className="max-w-[50%]" key={key}>
            <div className="text-l pb-5 font-bold">{title}</div>

            {milestones.map((experience, index) => (
              <div key={index}>
                <TimelineItem
                  item={experience}
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
