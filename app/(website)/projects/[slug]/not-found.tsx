import {Header} from '@/components/Header'
import ImageBox from '@/components/ImageBox'
import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: '404 Project Not Found',
}

export default function ProjectSlugNotFound() {
  return (
    <>
      <Header id={null} type={null} path={['overview']} title="404 Project Not Found" />

      <div className="rounded-md border">
        <ImageBox alt="" classesWrapper="relative aspect-[16/9]" />
        <div className="divide-inherit grid grid-cols-1 divide-y lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          <div className="p-3 lg:p-4">
            <div className="text-xs md:text-sm">Status</div>
            <div className="text-md md:text-lg">Not found</div>
          </div>
        </div>
      </div>

      <p className="max-w-3xl font-serif text-xl text-gray-600">
        The project you&rsquo;re looking for doesn&rsquo;t exist or may have been moved.
      </p>
    </>
  )
}
