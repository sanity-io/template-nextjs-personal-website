import { PortableText } from '@portabletext/react'
import { ShowcaseProjects } from 'app/(personal)/queries'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'

interface ProjectProps extends ShowcaseProjects {
  imageRightPosition?: boolean
}

export function Project(props: ProjectProps) {
  const { title, overview, coverImage, imageRightPosition } = props

  return (
    <div className="grid grid-cols-3 rounded-md border-2">
      <div className="col-span-2 ">
        <Image
          className="h-full w-auto p-4"
          alt=""
          width={700}
          height={500}
          sizes="100vw"
          src={
            coverImage?.asset?._ref &&
            urlForImage(coverImage).height(500).width(700).fit('crop').url()
          }
        />
      </div>
      <div>
        <div className="font-inter mb-2 mt-4 text-2xl font-extrabold">
          {title}
        </div>
        <div className="font-serif text-gray-500">
          <PortableText value={overview} />
        </div>
      </div>
    </div>
  )
}
