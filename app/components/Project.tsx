import Image from 'next/image'

import cover from '../../intro-template/cover.png'

export function Project() {
  return (
    <div className="mx-12 grid grid-cols-2 rounded-md border-2">
      <Image alt="" src={cover}></Image>
      <div>
        <div className="mb-2 mt-4 text-xl font-bold">Project</div>
        <div>teskljgkdjghjker</div>
      </div>
    </div>
  )
}
