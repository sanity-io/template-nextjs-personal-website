import { PortableText } from '@portabletext/react'
import { Settings } from 'app/(personal)/queries'

export function Footer({ footer }: Settings) {
  return (
    <footer className="sticky bottom-0 border-t-2 bg-white py-4 text-center dark:bg-black">
      <PortableText value={footer} />
    </footer>
  )
}
