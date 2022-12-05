import { Project } from '../[slug]/queries'

export function Project({ project }: { project: Project }) {
  const title = project.title
  console.log(title)

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 rounded-md border">
        <div className="... col-span-4">04</div>
        <BoxElement title={'Duration'} text={'2022-'} />
        <BoxElement title={'Duration'} text={'2022-'} />
        <BoxElement title={'Duration'} text={'2022-'} />
        <BoxElement title={'Duration'} text={'2022-'} isLast />
      </div>
      <div className="pt-12 font-serif text-gray-600">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi suscipit,
        sapien et viverra consectetur, ligula mauris tempor enim, at tristique
        est justo ut nisl. Ut consectetur ut lorem sit amet commodo. Nam
        elementum, eros non maximus convallis, purus tortor cursus nisl, eget
        tincidunt nisl dui eget mauris. Vestibulum luctus porta eros vel
        dapibus. Ut bibendum sollicitudin orci sollicitudin pharetra.
        Pellentesque habitant morbi tristique senectus et netus et malesuada
        fames ac turpis egestas. Fusce egestas, velit eget lacinia rhoncus, odio
        ipsum iaculis velit, id laoreet augue neque eget ex. Phasellus eu sapien
        sit amet lectus placerat interdum eu a turpis.
      </div>
    </div>
  )
}

function BoxElement({
  title,
  text,
  isLast,
}: {
  title: string
  text: string
  isLast?: boolean
}) {
  return (
    <div className={`${!isLast && 'border-r'} p-4`}>
      <div className="font-inter text-sm">{title}</div>
      <div className="">{text}</div>
    </div>
  )
}
