import {sanityFetch} from '@/sanity/lib/live'
import {defineQuery, type PortableTextBlock} from 'next-sanity'
import {Suspense} from 'react'
import {CustomPortableText} from './CustomPortableText'

const footerQuery = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    footer,
  }
`)
export function Footer() {
  console.log('Footer')
  return (
    <footer className="bottom-0 w-full bg-white py-12 text-center md:py-20">
      <Suspense>
        <FooterContent />
      </Suspense>
    </footer>
  )
}

async function FooterContent() {
  console.log('FooterContent')
  const {data} = await sanityFetch({query: footerQuery})
  if (!data?.footer) return null
  return (
    <CustomPortableText
      id={data._id}
      type={data._type}
      path={['footer']}
      paragraphClasses="text-md md:text-xl"
      value={data.footer as unknown as PortableTextBlock[]}
    />
  )
}
