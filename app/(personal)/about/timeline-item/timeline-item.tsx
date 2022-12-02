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
        <div>{item.title}</div>
        <div>
          {item.duration.start} - {item.duration.end}
        </div>
        <div>{item.description}</div>
      </div>
    </div>
  )
}
