import {Header} from '@/components/Header'
import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: '404 Page Not Found',
}

export default function SlugNotFound() {
  return (
    <>
      <Header id={null} type={null} path={['overview']} title="404 Page Not Found" />
      <p className="mt-6 max-w-3xl font-serif text-xl text-gray-600">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have been moved.
      </p>
    </>
  )
}
