interface TimelineItemProps {
  isLast: boolean
  item: {
    title: string
    duration: {
      start: string
      end: string
    }
    description: string
  }
}

export function TimelineItem(props: TimelineItemProps) {
  const { isLast, item } = props
  const startYear = new Date(item.duration.start).getFullYear()
  const endYear = item.duration.end
    ? new Date(item.duration.end).getFullYear()
    : 'Now'

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
        <div className="text-black">{item.title}</div>
        <div className="text-sm text-gray-600 ">
          {startYear} - {endYear}
        </div>
        <div className="pt-3 font-serif text-gray-600">{item.description}</div>
      </div>
    </div>
  )
}
