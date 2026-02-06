import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {type PortableTextBlock} from 'next-sanity'
import {CustomPortableText} from './CustomPortableText'

export async function Footer() {
  const {data} = await sanityFetch({query: settingsQuery})
  return (
    <footer className="bottom-0 w-full bg-white py-12 text-center md:py-20">
      {data?.footer && (
        <CustomPortableText
          id={data._id}
          type={data._type}
          path={['footer']}
          paragraphClasses="text-md md:text-xl"
          value={data.footer as unknown as PortableTextBlock[]}
        />
      )}
    </footer>
  )
}
