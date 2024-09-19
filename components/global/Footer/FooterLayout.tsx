import type { PortableTextBlock } from 'next-sanity'

import { CustomPortableText } from '@/components//shared/CustomPortableText'
import type { SettingsQueryResult } from '@/sanity.types'

interface FooterProps {
  data: SettingsQueryResult
}
export default function Footer(props: FooterProps) {
  const { data } = props
  const footer = data?.footer || []
  return (
    <footer className="bottom-0 w-full bg-white py-12 text-center md:py-20">
      {footer && (
        <CustomPortableText
          paragraphClasses="text-md md:text-xl"
          value={footer as unknown as PortableTextBlock[]}
        />
      )}
    </footer>
  )
}
